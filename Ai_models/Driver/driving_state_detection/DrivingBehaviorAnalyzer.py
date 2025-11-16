class DrivingBehaviorAnalyzer:
    def __init__(self):
        # Simulated CAN bus parameters
        self.steering_history = deque(maxlen=50)
        self.speed_history = deque(maxlen=30)
        self.lane_position_history = deque(maxlen=40)
        
        # Thresholds for abnormal behavior
        self.steering_threshold = 0.3
        self.lane_deviation_threshold = 0.4
        self.braking_threshold = 0.5
        
        print("Driving Behavior Analyzer initialized!")
    
    def simulate_can_data(self):
        """Simulate CAN bus data for testing"""
        import random
        
        return {
            'steering_angle': random.uniform(-0.5, 0.5),
            'vehicle_speed': random.uniform(0, 120),
            'lane_position': random.uniform(-0.3, 0.3),
            'brake_pressure': random.uniform(0, 1),
            'acceleration': random.uniform(-0.5, 0.5),
            'throttle_position': random.uniform(0, 1),
            'yaw_rate': random.uniform(-0.2, 0.2)
        }
    
    def analyze_steering_pattern(self, steering_data):
        """Analyze steering patterns for abnormal behavior"""
        self.steering_history.append(steering_data)
        
        if len(self.steering_history) < 10:
            return 0
        
        # Calculate steering variance
        steering_variance = np.var(list(self.steering_history))
        
        # Detect oversteering or understeering
        oversteering = steering_variance > self.steering_threshold
        no_steering = steering_variance < 0.01  # Very little steering input
        
        return {
            'variance': steering_variance,
            'oversteering': oversteering,
            'no_steering': no_steering,
            'score': min(1.0, steering_variance / self.steering_threshold)
        }
    
    def analyze_lane_keeping(self, lane_position):
        """Analyze lane keeping ability"""
        self.lane_position_history.append(lane_position)
        
        if len(self.lane_position_history) < 10:
            return 0
        
        # Calculate lane deviation
        lane_deviation = np.std(list(self.lane_position_history))
        weaving = lane_deviation > self.lane_deviation_threshold
        
        return {
            'deviation': lane_deviation,
            'weaving': weaving,
            'score': min(1.0, lane_deviation / self.lane_deviation_threshold)
        }
    
    def analyze_speed_consistency(self, speed_data):
        """Analyze speed maintenance"""
        self.speed_history.append(speed_data)
        
        if len(self.speed_history) < 10:
            return 0
        
        speed_variance = np.var(list(self.speed_history))
        inconsistent_speed = speed_variance > 10  # km/h variance threshold
        
        return {
            'variance': speed_variance,
            'inconsistent': inconsistent_speed,
            'score': min(1.0, speed_variance / 20)  # Normalize to 0-1
        }
    
    def process_driving_data(self, can_data):
        """Process CAN bus data and return behavior scores"""
        steering_analysis = self.analyze_steering_pattern(can_data['steering_angle'])
        lane_analysis = self.analyze_lane_keeping(can_data['lane_position'])
        speed_analysis = self.analyze_speed_consistency(can_data['vehicle_speed'])
        
        return self.calculate_behavior_score(steering_analysis, lane_analysis, speed_analysis)
    
    def calculate_behavior_score(self, steering, lane, speed):
        """Calculate driver state scores from behavior analysis"""
        scores = {
            'alert': max(0, 1 - (steering['score'] + lane['score'] + speed['score']) / 3),
            'drowsy': (lane['score'] * 0.6 + steering['score'] * 0.4),
            'distracted': (steering['no_steering'] * 0.7 + lane['score'] * 0.3),
            'angry': (steering['oversteering'] * 0.8 + speed['inconsistent'] * 0.2),
            'happy': 0,  # Hard to detect from driving alone
            'ill': (lane['weaving'] * 0.5 + steering['no_steering'] * 0.5),
            'inconscious': (steering['no_steering'] * 0.8 + lane['weaving'] * 0.2),
            'normal': max(0, 1 - (steering['score'] + lane['score'] + speed['score']) / 3)
        }
        
        # Normalize
        total = sum(scores.values())
        if total > 0:
            scores = {k: v/total for k, v in scores.items()}
        
        return scores
