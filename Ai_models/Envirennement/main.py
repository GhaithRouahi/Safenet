import cv2
import torch
import numpy as np
from ultralytics import YOLO
import tensorflow as tf
from collections import deque
import threading
import time
from queue import Queue

class BlindSpotDetector:
    def __init__(self, camera_id=1):  # Back camera usually ID 1
        print("Initializing Blind Spot Detection System...")
        
        # Load YOLOv8 model (pretrained on COCO, can be fine-tuned for vehicles)
        self.model = YOLO('yolov8n.pt')  # Using nano for speed
        # For better accuracy: YOLO('yolov8s.pt') or YOLO('yolov8m.pt')
        
        # Vehicle classes in COCO dataset
        self.vehicle_classes = {
            2: 'car', 3: 'motorcycle', 5: 'bus', 7: 'truck', 
            1: 'bicycle', 0: 'person'  # Adding relevant classes
        }
        
        # Special vehicle types for classification
        self.special_vehicle_mapping = {
            'taxi': ['car'],  # Would need additional classifier for taxi
            'semi': ['truck'],  # Semi-truck
            'emergency': ['car', 'bus']  # Police, ambulance
        }
        
        # Camera setup
        self.camera_id = camera_id
        self.cap = None
        
        # Blind spot regions (normalized coordinates)
        self.blind_spot_regions = {
            'left': [(0.6, 0.4), (1.0, 0.4), (1.0, 0.8), (0.6, 0.8)],  # Left blind spot
            'right': [(0.0, 0.4), (0.4, 0.4), (0.4, 0.8), (0.0, 0.8)]   # Right blind spot
        }
        
        # Detection parameters
        self.detection_threshold = 0.5
        self.proximity_threshold = 0.3  # Distance threshold for alerts
        self.min_vehicle_size = 0.02    # Minimum relative size of vehicle
        
        # Alert system
        self.alert_history = deque(maxlen=10)
        self.current_alerts = set()
        
        # Performance optimization
        self.frame_skip = 2  # Process every 3rd frame
        self.frame_counter = 0
        
        print("Blind Spot Detector initialized!")
    
    def setup_camera(self):
        """Initialize back camera"""
        self.cap = cv2.VideoCapture(self.camera_id)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        
        # Test camera
        ret, frame = self.cap.read()
        if not ret:
            print(f"Warning: Cannot access camera {self.camera_id}")
            return False
        return True
    
    def estimate_distance(self, bbox, frame_shape):
        """Estimate relative distance based on bounding box size and position"""
        x1, y1, x2, y2 = bbox
        bbox_width = (x2 - x1) / frame_shape[1]  # Normalized width
        bbox_height = (y2 - y1) / frame_shape[0]  # Normalized height
        
        # Simple distance estimation: larger objects are closer
        bbox_area = bbox_width * bbox_height
        
        # Distance is inversely proportional to size
        # This is a simplified model - could be calibrated with actual depth data
        if bbox_area > 0:
            distance = 1.0 / (bbox_area * 10)  # Normalized distance
        else:
            distance = 1.0
        
        return min(distance, 1.0)  # Cap at 1.0
    
    def is_in_blind_spot(self, bbox_center, blind_spot_region):
        """Check if object center is in blind spot region"""
        x_center, y_center = bbox_center
        
        # Simple point-in-polygon test for blind spot regions
        points = blind_spot_region
        inside = False
        
        j = len(points) - 1
        for i in range(len(points)):
            if ((points[i][1] > y_center) != (points[j][1] > y_center)) and \
               (x_center < (points[j][0] - points[i][0]) * (y_center - points[i][1]) / 
                (points[j][1] - points[i][1]) + points[i][0]):
                inside = not inside
            j = i
        
        return inside
    
    def classify_vehicle_type(self, class_id, bbox, confidence):
        """Classify vehicle type with additional logic for special vehicles"""
        base_type = self.vehicle_classes.get(class_id, 'unknown')
        
        # Additional classification logic could be added here
        # For taxi detection: color analysis, roof sign detection, etc.
        # For semi-truck: aspect ratio analysis
        
        # Simple aspect ratio based classification
        x1, y1, x2, y2 = bbox
        width = x2 - x1
        height = y2 - y1
        
        aspect_ratio = width / height if height > 0 else 0
        
        if base_type == 'truck' and aspect_ratio > 2.5:
            vehicle_type = 'semi'
        elif base_type == 'car' and aspect_ratio < 1.2:
            # Could be taxi, bus, etc. - need additional classifiers
            vehicle_type = base_type
        else:
            vehicle_type = base_type
        
        return vehicle_type
    
    def process_frame(self, frame):
        """Process a single frame for blind spot detection"""
        self.frame_counter += 1
        if self.frame_counter % self.frame_skip != 0:
            return []  # Skip frame for performance
        
        results = self.model(frame, verbose=False)
        detections = []
        frame_height, frame_width = frame.shape[:2]
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    
                    # Only process vehicles
                    if class_id in self.vehicle_classes and confidence > self.detection_threshold:
                        # Get bounding box coordinates
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        
                        # Convert to normalized coordinates
                        x1_norm, y1_norm = x1 / frame_width, y1 / frame_height
                        x2_norm, y2_norm = x2 / frame_width, y2 / frame_height
                        bbox_norm = (x1_norm, y1_norm, x2_norm, y2_norm)
                        
                        # Calculate center point
                        center_x = (x1_norm + x2_norm) / 2
                        center_y = (y1_norm + y2_norm) / 2
                        
                        # Estimate distance
                        distance = self.estimate_distance(bbox_norm, frame.shape)
                        
                        # Classify vehicle type
                        vehicle_type = self.classify_vehicle_type(class_id, bbox_norm, confidence)
                        
                        # Check blind spots
                        blind_spot = None
                        for spot_name, region in self.blind_spot_regions.items():
                            if self.is_in_blind_spot((center_x, center_y), region):
                                blind_spot = spot_name
                                break
                        
                        detection = {
                            'type': vehicle_type,
                            'bbox': bbox_norm,
                            'bbox_pixel': (int(x1), int(y1), int(x2), int(y2)),
                            'confidence': confidence,
                            'distance_est': distance,
                            'blind_spot': blind_spot,
                            'center': (center_x, center_y)
                        }
                        
                        detections.append(detection)
        
        return detections
    
    def evaluate_threat_level(self, detection):
        """Evaluate threat level based on distance and position"""
        threat_score = 0.0
        
        # Distance factor (closer = higher threat)
        distance_factor = 1.0 - detection['distance_est']
        
        # Confidence factor
        confidence_factor = detection['confidence']
        
        # Size factor (larger vehicles = higher threat)
        bbox = detection['bbox']
        bbox_area = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
        size_factor = min(bbox_area * 10, 1.0)
        
        # Vehicle type factor
        type_weights = {
            'semi': 1.0, 'truck': 0.9, 'bus': 0.8, 
            'car': 0.7, 'motorcycle': 0.6, 'bicycle': 0.5
        }
        type_factor = type_weights.get(detection['type'], 0.5)
        
        # Blind spot presence
        blind_spot_factor = 1.0 if detection['blind_spot'] else 0.3
        
        # Calculate overall threat score
        threat_score = (
            distance_factor * 0.4 +
            confidence_factor * 0.2 +
            size_factor * 0.2 +
            type_factor * 0.1 +
            blind_spot_factor * 0.1
        )
        
        return threat_score
    
    def generate_alert(self, detection, threat_score):
        """Generate appropriate alert based on detection"""
        alert_level = "LOW"
        
        if threat_score > 0.7:
            alert_level = "HIGH"
        elif threat_score > 0.4:
            alert_level = "MEDIUM"
        
        alert_types = {
            'HIGH': "IMMEDIATE_ACTION",
            'MEDIUM': "WARNING", 
            'LOW': "INFORMATIONAL"
        }
        
        alert = {
            'timestamp': time.time(),
            'vehicle_type': detection['type'],
            'blind_spot': detection['blind_spot'],
            'distance': detection['distance_est'],
            'threat_score': threat_score,
            'alert_level': alert_level,
            'alert_type': alert_types[alert_level],
            'message': self.generate_alert_message(detection, alert_level)
        }
        
        return alert
    
    def generate_alert_message(self, detection, alert_level):
        """Generate human-readable alert message"""
        spot_name = detection['blind_spot'].upper() if detection['blind_spot'] else "UNKNOWN"
        vehicle_type = detection['type'].upper()
        
        if alert_level == "HIGH":
            return f"⚠️ {vehicle_type} IN {spot_name} BLIND SPOT! CHECK MIRROR!"
        elif alert_level == "MEDIUM":
            return f"⚠️ {vehicle_type} approaching {spot_name} blind spot"
        else:
            return f"ℹ️ {vehicle_type} detected in vicinity"
    
    def should_alert(self, detection):
        """Determine if alert should be triggered"""
        # Only alert for objects in blind spots
        if not detection['blind_spot']:
            return False
        
        # Minimum confidence
        if detection['confidence'] < self.detection_threshold:
            return False
        
        # Maximum distance
        if detection['distance_est'] > self.proximity_threshold:
            return False
        
        # Minimum size
        bbox = detection['bbox']
        bbox_area = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
        if bbox_area < self.min_vehicle_size:
            return False
        
        return True
    
    def draw_detections(self, frame, detections):
        """Draw detections and alerts on frame for visualization"""
        frame_height, frame_width = frame.shape[:2]
        
        # Draw blind spot regions
        for spot_name, region in self.blind_spot_regions.items():
            points = [(int(x * frame_width), int(y * frame_height)) for x, y in region]
            cv2.polylines(frame, [np.array(points)], True, (0, 0, 255), 2)
            cv2.putText(frame, f'{spot_name} blind spot', 
                       (points[0][0], points[0][1] - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        
        # Draw detections
        for detection in detections:
            x1, y1, x2, y2 = detection['bbox_pixel']
            vehicle_type = detection['type']
            confidence = detection['confidence']
            distance = detection['distance_est']
            blind_spot = detection['blind_spot']
            
            # Color coding based on threat
            threat_score = self.evaluate_threat_level(detection)
            if threat_score > 0.7:
                color = (0, 0, 255)  # Red - high threat
            elif threat_score > 0.4:
                color = (0, 165, 255)  # Orange - medium threat
            else:
                color = (0, 255, 0)  # Green - low threat
            
            # Draw bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            # Draw label
            label = f"{vehicle_type} {confidence:.2f} dist:{distance:.2f}"
            if blind_spot:
                label += f" {blind_spot.upper()}!"
            
            cv2.putText(frame, label, (x1, y1 - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            # Draw center point
            center_x = int(detection['center'][0] * frame_width)
            center_y = int(detection['center'][1] * frame_height)
            cv2.circle(frame, (center_x, center_y), 5, color, -1)
        
        return frame

class BlindSpotMonitoringSystem:
    def __init__(self, camera_id=1):
        self.detector = BlindSpotDetector(camera_id)
        self.is_running = False
        self.processing_thread = None
        self.alert_callback = None
        
        # Real-time monitoring
        self.current_detections = []
        self.current_alerts = []
        
        print("Blind Spot Monitoring System initialized!")
    
    def set_alert_callback(self, callback):
        """Set callback function for alerts"""
        self.alert_callback = callback
    
    def start_monitoring(self):
        """Start blind spot monitoring"""
        if not self.detector.setup_camera():
            print("Failed to initialize camera")
            return False
        
        self.is_running = True
        self.processing_thread = threading.Thread(target=self._monitoring_loop)
        self.processing_thread.daemon = True
        self.processing_thread.start()
        
        print("Blind spot monitoring started!")
        return True
    
    def _monitoring_loop(self):
        """Main monitoring loop"""
        while self.is_running:
            ret, frame = self.detector.cap.read()
            if not ret:
                print("Failed to capture frame")
                time.sleep(0.1)
                continue
            
            # Process frame for detections
            detections = self.detector.process_frame(frame)
            self.current_detections = detections
            
            # Check for alerts
            new_alerts = []
            for detection in detections:
                if self.detector.should_alert(detection):
                    threat_score = self.detector.evaluate_threat_level(detection)
                    alert = self.detector.generate_alert(detection, threat_score)
                    new_alerts.append(alert)
            
            # Update current alerts
            self.current_alerts = new_alerts
            
            # Trigger callback if new alerts
            if new_alerts and self.alert_callback:
                for alert in new_alerts:
                    self.alert_callback(alert)
            
            # Visualization (optional)
            if self.detector.frame_counter % 5 == 0:  # Update display every 5 processed frames
                display_frame = self.detector.draw_detections(frame.copy(), detections)
                cv2.imshow('Blind Spot Detection', display_frame)
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            
            time.sleep(0.01)  # Small delay to prevent excessive CPU usage
        
        self.detector.cap.release()
        cv2.destroyAllWindows()
    
    def stop_monitoring(self):
        """Stop blind spot monitoring"""
        self.is_running = False
        if self.processing_thread:
            self.processing_thread.join(timeout=2)
        print("Blind spot monitoring stopped!")
    
    def get_system_status(self):
        """Get current system status"""
        return {
            'running': self.is_running,
            'detections_count': len(self.current_detections),
            'active_alerts': len(self.current_alerts),
            'alerts': self.current_alerts
        }

# Integration with main driver monitoring system
class IntegratedSafetySystem:
    def __init__(self):
        print("Initializing Integrated Safety System...")
        
        # Existing driver monitoring
        self.driver_monitor = None  # Your existing driver monitoring system
        
        # New blind spot monitoring
        self.blind_spot_monitor = BlindSpotMonitoringSystem(camera_id=1)
        
        # Set alert callback
        self.blind_spot_monitor.set_alert_callback(self.handle_blind_spot_alert)
        
        print("Integrated Safety System initialized!")
    
    def handle_blind_spot_alert(self, alert):
        """Handle blind spot alerts and integrate with driver state"""
        print(f"\n🚨 BLIND SPOT ALERT: {alert['message']}")
        
        # Integrate with driver state for contextual alerts
        if self.driver_monitor:
            driver_state = self.driver_monitor.get_current_state()
            
            # If driver is distracted or drowsy, escalate alert
            if driver_state.get('primary_state') in ['distracted', 'drowsy']:
                print("⚠️ ESCALATING ALERT - Driver is inattentive!")
                # Trigger stronger warnings (haptic, audio, visual)
                self.trigger_escalated_warning(alert)
    
    def trigger_escalated_warning(self, alert):
        """Trigger escalated warning based on driver state"""
        # Implement haptic feedback, louder audio alerts, etc.
        if alert['alert_level'] == 'HIGH':
            print("🔊 ACTIVATING EMERGENCY HAPTIC AND AUDIO ALERTS!")
            # Code to control vehicle haptic systems
            # Code to play emergency audio alerts
    
    def start_complete_system(self):
        """Start both driver monitoring and blind spot detection"""
        print("Starting complete safety system...")
        
        # Start blind spot monitoring
        if not self.blind_spot_monitor.start_monitoring():
            print("Failed to start blind spot monitoring")
            return False
        
        # Start driver monitoring (your existing system)
        # self.driver_monitor.start_monitoring()
        
        print("Complete safety system running!")
        return True
    
    def stop_complete_system(self):
        """Stop all monitoring systems"""
        self.blind_spot_monitor.stop_monitoring()
        # self.driver_monitor.stop_monitoring()
        print("Safety system stopped!")

# Example usage and testing
def test_blind_spot_detection():
    """Test function for blind spot detection"""
    system = BlindSpotMonitoringSystem(camera_id=1)
    
    def alert_handler(alert):
        print(f"ALERT: {alert['message']} (Score: {alert['threat_score']:.2f})")
    
    system.set_alert_callback(alert_handler)
    
    if system.start_monitoring():
        try:
            # Run for 30 seconds for testing
            time.sleep(30)
        except KeyboardInterrupt:
            print("Stopping test...")
        finally:
            system.stop_monitoring()

if __name__ == "__main__":
    print("=== Blind Spot Detection System ===")
    print("Model: YOLOv8n (Vehicle Detection)")
    print("Features: Blind spot monitoring, distance estimation, threat assessment")
    
    # Test the system
    test_blind_spot_detection()