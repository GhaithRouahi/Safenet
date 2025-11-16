class AudioStateClassifier:
    def __init__(self, sample_rate=16000, chunk_duration=3):
        self.sample_rate = sample_rate
        self.chunk_duration = chunk_duration
        self.chunk_size = sample_rate * chunk_duration
        self.audio_buffer = deque(maxlen=self.chunk_size * 2)
        
        # Voice activity detection parameters
        self.energy_threshold = 1000
        self.silence_frames = 0
        
        print("Audio State Classifier initialized!")
    
    def calculate_audio_features(self, audio_data):
        """Extract audio features for emotion classification"""
        if len(audio_data) == 0:
            return None
        
        # Basic audio features
        features = {}
        
        # Energy and volume
        features['rms_energy'] = np.sqrt(np.mean(audio_data**2))
        features['max_amplitude'] = np.max(np.abs(audio_data))
        
        # Pitch features using librosa
        try:
            pitches, magnitudes = librosa.piptrack(
                y=audio_data, 
                sr=self.sample_rate,
                hop_length=512
            )
            pitch = pitches[pitches > 0]
            if len(pitch) > 0:
                features['pitch_mean'] = np.mean(pitch)
                features['pitch_std'] = np.std(pitch)
                features['pitch_range'] = np.max(pitch) - np.min(pitch)
            else:
                features.update({'pitch_mean': 0, 'pitch_std': 0, 'pitch_range': 0})
        except:
            features.update({'pitch_mean': 0, 'pitch_std': 0, 'pitch_range': 0})
        
        # Spectral features
        spectral_centroid = librosa.feature.spectral_centroid(
            y=audio_data, sr=self.sample_rate
        )
        features['spectral_centroid'] = np.mean(spectral_centroid)
        
        # Zero crossing rate
        features['zcr'] = np.mean(librosa.feature.zero_crossing_rate(audio_data))
        
        # MFCCs (simplified)
        mfccs = librosa.feature.mfcc(y=audio_data, sr=self.sample_rate, n_mfcc=5)
        features['mfcc_mean'] = np.mean(mfccs, axis=1)
        
        return features
    
    def detect_voice_activity(self, audio_data):
        """Simple voice activity detection"""
        rms_energy = np.sqrt(np.mean(audio_data**2))
        return rms_energy > self.energy_threshold
    
    def classify_emotion_from_audio(self, features):
        """Classify emotion based on audio features (rule-based)"""
        if features is None:
            return {'silent': 1.0}
        
        scores = {
            'angry': 0, 'happy': 0, 'stressed': 0, 'tired': 0, 'normal': 0, 'silent': 0
        }
        
        # Rule-based emotion classification
        if features['rms_energy'] < self.energy_threshold:
            scores['silent'] = 1.0
            return scores
        
        # Angry: high energy, high pitch variance
        if features['rms_energy'] > 0.1 and features['pitch_std'] > 100:
            scores['angry'] = min(1.0, features['rms_energy'] * 5 + features['pitch_std'] / 200)
        
        # Happy: moderate energy, medium-high pitch
        if features['rms_energy'] > 0.05 and features['pitch_mean'] > 150:
            scores['happy'] = min(1.0, features['rms_energy'] * 4)
        
        # Stressed: high pitch, high spectral centroid
        if features['pitch_mean'] > 200 and features['spectral_centroid'] > 2000:
            scores['stressed'] = min(1.0, features['pitch_mean'] / 300)
        
        # Tired: low energy, low pitch
        if features['rms_energy'] < 0.03 and features['pitch_mean'] < 100:
            scores['tired'] = min(1.0, (0.03 - features['rms_energy']) * 20)
        
        # Normal: default state
        if max(scores.values()) < 0.3:
            scores['normal'] = 0.7
        
        # Normalize
        total = sum(scores.values())
        if total > 0:
            scores = {k: v/total for k, v in scores.items()}
        
        return scores
    
    def process_audio_chunk(self, audio_data):
        """Process audio chunk and return emotion scores"""
        features = self.calculate_audio_features(audio_data)
        emotion_scores = self.classify_emotion_from_audio(features)
        
        # Map to driver states
        return self.map_audio_to_driver_state(emotion_scores)
    
    def map_audio_to_driver_state(self, audio_emotions):
        """Map audio emotions to driver states"""
        return {
            'alert': audio_emotions.get('normal', 0),
            'drowsy': audio_emotions.get('tired', 0),
            'distracted': audio_emotions.get('silent', 0),  # Not talking
            'angry': audio_emotions.get('angry', 0),
            'happy': audio_emotions.get('happy', 0),
            'ill': audio_emotions.get('tired', 0) * 0.5,  # Could indicate illness
            'inconscious': 0,  # Audio alone can't detect unconsciousness
            'normal': audio_emotions.get('normal', 0)
        }
