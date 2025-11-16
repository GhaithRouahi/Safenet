class DriverStateFusionGateway:
    def __init__(self):
        self.temporal_buffer = deque(maxlen=15)  # 15-frame buffer
        self.confidence_thresholds = {
            'critical': 0.7,
            'warning': 0.5,
            'notice': 0.3
        }
        
        # Modality reliability weights (can be adaptive)
        self.modality_weights = {
            'visual': 0.5,
            'audio': 0.2,
            'driving': 0.3
        }
        
        print("Driver State Fusion Gateway initialized!")
    
    def fuse_modalities(self, visual_scores, audio_scores, driving_scores):
        """Fuse scores from all three modalities"""
        if not visual_scores.get('face_detected', True):
            # If no face detected, rely more on driving behavior
            temp_weights = {'visual': 0.1, 'audio': 0.2, 'driving': 0.7}
        else:
            temp_weights = self.modality_weights
        
        # Fuse scores with weights
        fused_scores = {}
        states = ['alert', 'drowsy', 'distracted', 'angry', 'happy', 'ill', 'inconscious', 'normal']
        
        for state in states:
            fused_scores[state] = (
                temp_weights['visual'] * visual_scores.get(state, 0) +
                temp_weights['audio'] * audio_scores.get(state, 0) +
                temp_weights['driving'] * driving_scores.get(state, 0)
            )
        
        # Apply temporal smoothing
        self.temporal_buffer.append(fused_scores)
        smoothed_scores = self.apply_temporal_smoothing()
        
        return smoothed_scores
    
    def apply_temporal_smoothing(self):
        """Apply temporal smoothing to reduce noise"""
        if not self.temporal_buffer:
            return {}
        
        smoothed = {}
        states = self.temporal_buffer[0].keys()
        
        for state in states:
            state_values = [frame_scores[state] for frame_scores in self.temporal_buffer]
            # Use exponential moving average
            weights = np.exp(np.linspace(-1, 0, len(state_values)))
            weights /= weights.sum()
            smoothed[state] = np.average(state_values, weights=weights)
        
        return smoothed
    
    def determine_final_state(self, fused_scores):
        """Determine the final driver state and alert level"""
        if not fused_scores:
            return {'primary_state': 'unknown', 'confidence': 0, 'alert_level': 'NORMAL'}
        
        primary_state = max(fused_scores.items(), key=lambda x: x[1])
        
        if primary_state[1] >= self.confidence_thresholds['critical']:
            alert_level = 'CRITICAL'
        elif primary_state[1] >= self.confidence_thresholds['warning']:
            alert_level = 'WARNING'
        elif primary_state[1] >= self.confidence_thresholds['notice']:
            alert_level = 'NOTICE'
        else:
            alert_level = 'NORMAL'
        
        return {
            'primary_state': primary_state[0],
            'confidence': float(primary_state[1]),
            'alert_level': alert_level,
            'timestamp': time.time(),
            'all_scores': fused_scores,
            'recommended_action': self.get_recommended_action(primary_state[0], alert_level)
        }
    
    def get_recommended_action(self, state, alert_level):
        """Get recommended actions based on state and alert level"""
        action_map = {
            'inconscious': {
                'CRITICAL': ['AUTONOMOUS_PULLOVER', 'EMERGENCY_SERVICES', 'HAZARD_LIGHTS'],
                'WARNING': ['LOUD_ALERT', 'SEAT_VIBRATION', 'SUGGEST_BREAK']
            },
            'drowsy': {
                'CRITICAL': ['LOUD_ALERT', 'SEAT_VIBRATION', 'SUGGEST_BREAK_NOW'],
                'WARNING': ['VISUAL_WARNING', 'SUGGEST_BREAK_SOON'],
                'NOTICE': ['GENTLE_REMINDER']
            },
            'angry': {
                'WARNING': ['CALM_MUSIC', 'BREATHING_EXERCISES', 'SUGGEST_PULLOVER'],
                'NOTICE': ['COMFORT_MESSAGE']
            },
            'distracted': {
                'WARNING': ['VISUAL_WARNING', 'AUDIO_REMINDER'],
                'NOTICE': ['GENTLE_ALERT']
            },
            'ill': {
                'CRITICAL': ['MEDICAL_ALERT', 'SUGGEST_STOP', 'CONTACT_HELP'],
                'WARNING': ['SUGGEST_REST', 'MONITOR_CONDITION']
            }
        }
        
        return action_map.get(state, {}).get(alert_level, ['CONTINUE_MONITORING'])
