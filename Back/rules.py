from typing import Dict


def compute_risk(event: Dict) -> float:
    """Compute a simple risk score (0-100) from event payload.

    This is a toy rules engine: weights are illustrative.
    - driver_state (eye_closed, distracted) -> up to 50
    - vehicle_model_score -> up to 30
    - telemetry (speed) -> up to 20
    """
    score = 0.0
    driver_state = event.get("driver_state", {}) or {}
    eye_closed = float(driver_state.get("eye_closed", 0))
    distracted = float(driver_state.get("distracted", 0))

    # driver contribution (50% max)
    driver_score = min(1.0, eye_closed * 0.7 + distracted * 0.8) * 50.0

    # vehicle model contribution (given as a score 0-100 interpreted as safety gap)
    vehicle_model_score = float(event.get("vehicle_model_score", 0))
    vehicle_score = min(100.0, vehicle_model_score) / 100.0 * 30.0

    # telemetry contribution: speed over a threshold
    telemetry = event.get("telemetry", {}) or {}
    speed = float(telemetry.get("speed", 0))
    if speed <= 60:
        speed_score = 0.0
    else:
        # linearly scale 60->100 to 0->20
        speed_score = min(20.0, (speed - 60) / 40.0 * 20.0)

    score = driver_score + vehicle_score + speed_score
    # clamp
    score = max(0.0, min(100.0, score))
    return score


def severity_from_score(score: float) -> str:
    if score < 30:
        return "none"
    if score < 70:
        return "moderate"
    return "high"
