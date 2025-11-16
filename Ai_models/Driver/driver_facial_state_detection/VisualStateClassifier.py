class VisualStateClassifier:
    def __init__(self):
        print("Initializing Visual State Classifier...")
        
        # Initialize MediaPipe for face detection and landmarks
        self.face_detection = mp.solutions.face_detection.FaceDetection(
            model_selection=0, min_detection_confidence=0.7
        )
        
        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Initialize YOLOv8 for face detection (alternative)
        self.yolo_face = YOLO('yolov8n.pt')  # Using standard YOLO for person/face detection
        
        # Eye state parameters
        self.eye_landmarks = {
            'left': [33, 160, 158, 133, 153, 144],  # Left eye landmarks
            'right': [362, 385, 387, 263, 373, 380]  # Right eye landmarks
        }
        
        # Blink detection
        self.eye_history = deque(maxlen=10)
        self.blink_counter = 0
        self.eye_closed_frames = 0
        
        print("Visual State Classifier initialized!")
    
    def calculate_eye_aspect_ratio(self, landmarks, eye_points):
        """Calculate Eye Aspect Ratio (EAR) for blink detection"""
        # Horizontal points
        p1 = np.array([landmarks[eye_points[0]].x, landmarks[eye_points[0]].y])
        p2 = np.array([landmarks[eye_points[1]].x, landmarks[eye_points[1]].y])
        # Vertical points
        p3 = np.array([landmarks[eye_points[2]].x, landmarks[eye_points[2]].y])
        p4 = np.array([landmarks[eye_points[3]].x, landmarks[eye_points[3]].y])
        p5 = np.array([landmarks[eye_points[4]].x, landmarks[eye_points[4]].y])
        p6 = np.array([landmarks[eye_points[5]].x, landmarks[eye_points[5]].y])
        
        # Calculate distances
        vertical1 = np.linalg.norm(p3 - p5)
        vertical2 = np.linalg.norm(p4 - p6)
        horizontal = np.linalg.norm(p1 - p2)
        
        # Calculate EAR
        ear = (vertical1 + vertical2) / (2.0 * horizontal)
        return ear
    
    def analyze_eye_state(self, landmarks):
        """Analyze eye state (open/closed) and detect blinks"""
        left_ear = self.calculate_eye_aspect_ratio(landmarks, self.eye_landmarks['left'])
        right_ear = self.calculate_eye_aspect_ratio(landmarks, self.eye_landmarks['right'])
        
        avg_ear = (left_ear + right_ear) / 2.0
        self.eye_history.append(avg_ear)
        
        # Detect blink (EAR drops below threshold)
        ear_threshold = 0.2
        if avg_ear < ear_threshold:
            self.eye_closed_frames += 1
        else:
            if self.eye_closed_frames >= 2:  # Minimum frames for blink
                self.blink_counter += 1
            self.eye_closed_frames = 0
        
        # Calculate blink rate (blinks per minute)
        if len(self.eye_history) >= 10:
            blink_rate = (self.blink_counter / len(self.eye_history)) * 600  # Estimate per minute
        
        return {
            'left_ear': left_ear,
            'right_ear': right_ear,
            'avg_ear': avg_ear,
            'eyes_open': avg_ear > ear_threshold,
            'blink_count': self.blink_counter,
            'blink_rate': blink_rate if len(self.eye_history) >= 10 else 0,
            'perclos': self.calculate_perclos()  # Percentage of eye closure
        }
    
    def calculate_perclos(self):
        """Calculate PERCLOS (percentage of eye closure)"""
        if len(self.eye_history) == 0:
            return 0
        closed_frames = sum(1 for ear in self.eye_history if ear < 0.2)
        return closed_frames / len(self.eye_history)
    
    def analyze_head_pose(self, landmarks):
        """Estimate head pose using facial landmarks"""
        # Simple head pose estimation using nose and eye positions
        nose_tip = landmarks[1]
        left_eye = landmarks[33]
        right_eye = landmarks[263]
        
        # Calculate head rotation (simplified)
        eye_center_x = (left_eye.x + right_eye.x) / 2
        head_tilt = (nose_tip.x - eye_center_x) * 100  # Simplified tilt estimation
        
        return {
            'head_tilt': head_tilt,
            'looking_forward': abs(head_tilt) < 20,
            'yaw_angle': head_tilt
        }
    
    def detect_yawn(self, landmarks):
        """Detect yawning using mouth landmarks"""
        # Mouth landmarks
        upper_lip = landmarks[13]
        lower_lip = landmarks[14]
        mouth_left = landmarks[78]
        mouth_right = landmarks[308]
        
        # Calculate mouth aspect ratio
        vertical = np.linalg.norm([
            upper_lip.x - lower_lip.x,
            upper_lip.y - lower_lip.y
        ])
        horizontal = np.linalg.norm([
            mouth_left.x - mouth_right.x,
            mouth_left.y - mouth_right.y
        ])
        
        mar = vertical / horizontal if horizontal > 0 else 0
        return {
            'mouth_open': mar > 0.5,
            'mouth_aspect_ratio': mar,
            'yawning': mar > 0.7
        }
    
    def process_frame(self, frame):
        """Process a single frame and extract visual features"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Face detection with MediaPipe
        face_results = self.face_detection.process(rgb_frame)
        mesh_results = self.face_mesh.process(rgb_frame)
        
        if not face_results.detections or not mesh_results.multi_face_landmarks:
            return {'face_detected': False}
        
        landmarks = mesh_results.multi_face_landmarks[0].landmark
        
        # Analyze different aspects
        eye_state = self.analyze_eye_state(landmarks)
        head_pose = self.analyze_head_pose(landmarks)
        mouth_state = self.detect_yawn(landmarks)
        
        # Emotion analysis with DeepFace
        try:
            emotion_analysis = DeepFace.analyze(
                frame, 
                actions=['emotion'], 
                enforce_detection=False,
                detector_backend='opencv'
            )
            emotions = emotion_analysis[0]['emotion']
        except Exception as e:
            emotions = {
                'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0,
                'sad': 0, 'surprise': 0, 'neutral': 1.0
            }
        
        return self.calculate_visual_score(emotions, eye_state, head_pose, mouth_state)
    
    def calculate_visual_score(self, emotions, eye_state, head_pose, mouth_state):
        """Calculate visual state scores based on extracted features"""
        scores = {
            'alert': max(0, eye_state['avg_ear'] - 0.2) * 2,  # Higher EAR = more alert
            'drowsy': (1 - eye_state['avg_ear']) + (eye_state['perclos'] * 2),
            'distracted': abs(head_pose['head_tilt']) / 100,
            'angry': emotions['angry'],
            'happy': emotions['happy'],
            'ill': emotions['sad'] * 0.5 + (1 - eye_state['avg_ear']) * 0.5,
            'inconscious': 0,  # Will be calculated based on multiple factors
            'normal': emotions['neutral']
        }
        
        # Special case: unconscious (eyes closed for extended period + no head movement)
        if (eye_state['avg_ear'] < 0.1 and 
            abs(head_pose['head_tilt']) < 5 and 
            not mouth_state['yawning']):
            scores['inconscious'] = 0.8
        
        # Normalize scores to sum to 1
        total = sum(scores.values())
        if total > 0:
            scores = {k: v/total for k, v in scores.items()}
        
        return scores

