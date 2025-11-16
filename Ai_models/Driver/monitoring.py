class DriverMonitoringSystem:
    def __init__(self):
        print("Initializing Driver Monitoring System...")
        
        # Initialize all components
        self.visual_pipeline = VisualStateClassifier()
        self.audio_pipeline = AudioStateClassifier()
        self.driving_pipeline = DrivingBehaviorAnalyzer()
        self.fusion_gateway = DriverStateFusionGateway()
        
        # Processing queues
        self.video_queue = Queue(maxsize=5)
        self.audio_queue = Queue(maxsize=3)
        self.driving_queue = Queue(maxsize=10)
        self.result_queue = Queue(maxsize=10)
        
        # Control flags
        self.is_running = False
        self.processing_threads = []
        
        print("Driver Monitoring System ready!")
    
    def start_camera_capture(self, camera_id=0):
        """Start camera capture thread"""
        def camera_worker():
            cap = cv2.VideoCapture(camera_id)
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            
            while self.is_running:
                ret, frame = cap.read()
                if ret and not self.video_queue.full():
                    # Resize for faster processing
                    frame = cv2.resize(frame, (320, 240))
                    visual_scores = self.visual_pipeline.process_frame(frame)
                    self.video_queue.put(visual_scores)
                
                time.sleep(0.1)
            
            cap.release()
        
        thread = threading.Thread(target=camera_worker)
        thread.daemon = True
        thread.start()
        self.processing_threads.append(thread)
    
    def start_audio_capture(self):
        """Start audio capture thread (simulated)"""
        def audio_worker():
            while self.is_running:
                # Simulate audio processing
                audio_scores = self.audio_pipeline.process_audio_chunk(np.random.random(48000) * 0.1)
                if not self.audio_queue.full():
                    self.audio_queue.put(audio_scores)
                time.sleep(3)  # Process audio every 3 seconds
        
        thread = threading.Thread(target=audio_worker)
        thread.daemon = True
        thread.start()
        self.processing_threads.append(thread)
    
    def start_driving_data_capture(self):
        """Start driving data capture thread (simulated)"""
        def driving_worker():
            while self.is_running:
                can_data = self.driving_pipeline.simulate_can_data()
                driving_scores = self.driving_pipeline.process_driving_data(can_data)
                if not self.driving_queue.full():
                    self.driving_queue.put(driving_scores)
                time.sleep(0.5)  # Process driving data every 0.5 seconds
        
        thread = threading.Thread(target=driving_worker)
        thread.daemon = True
        thread.start()
        self.processing_threads.append(thread)
    
    def start_fusion_processing(self):
        """Start fusion processing thread"""
        def fusion_worker():
            while self.is_running:
                try:
                    # Get latest data from all queues
                    visual_scores = self.video_queue.get(timeout=1)
                    audio_scores = self.audio_queue.get(timeout=0.1) if not self.audio_queue.empty() else {}
                    driving_scores = self.driving_queue.get(timeout=0.1)
                    
                    # Fuse modalities
                    fused_scores = self.fusion_gateway.fuse_modalities(
                        visual_scores, audio_scores, driving_scores
                    )
                    
                    # Determine final state
                    driver_state = self.fusion_gateway.determine_final_state(fused_scores)
                    
                    # Put result in queue
                    if not self.result_queue.full():
                        self.result_queue.put(driver_state)
                    
                    # Print results
                    self.print_driver_state(driver_state)
                    
                except Empty:
                    continue
                except Exception as e:
                    print(f"Fusion processing error: {e}")
                    time.sleep(0.1)
        
        thread = threading.Thread(target=fusion_worker)
        thread.daemon = True
        thread.start()
        self.processing_threads.append(thread)
    
    def print_driver_state(self, driver_state):
        """Print driver state in a readable format"""
        state = driver_state['primary_state']
        confidence = driver_state['confidence']
        alert_level = driver_state['alert_level']
        
        print(f"\rDriver State: {state.upper()} ({confidence:.2f}) | Alert: {alert_level} | "
              f"Actions: {', '.join(driver_state['recommended_action'])}", end="")
    
    def start_monitoring(self):
        """Start the complete monitoring system"""
        print("Starting driver monitoring...")
        self.is_running = True
        
        # Start all capture threads
        self.start_camera_capture()
        self.start_audio_capture()
        self.start_driving_data_capture()
        self.start_fusion_processing()
        
        print("All systems running. Press Ctrl+C to stop.")
        
        try:
            while self.is_running:
                time.sleep(0.1)
        except KeyboardInterrupt:
            self.stop_monitoring()
    
    def stop_monitoring(self):
        """Stop the monitoring system"""
        print("\nStopping driver monitoring...")
        self.is_running = False
        
        for thread in self.processing_threads:
            thread.join(timeout=1)
        
        print("Driver monitoring stopped.")




# Main execution
if __name__ == "__main__":
    print("=== Driver State Monitoring System ===")
    print("Using pretrained models: MediaPipe, DeepFace, YOLOv8")
    
    monitoring_system = DriverMonitoringSystem()
    monitoring_system.start_monitoring()