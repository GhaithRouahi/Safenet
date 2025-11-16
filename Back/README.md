# Prototype Backend - FastAPI

Small prototype backend for the driving/driver risk system. Provides simple endpoints to receive events and snapshots, compute a risk score with a tiny rules engine, and store incidents in a local SQLite database. Thumbnails are stored in the local `storage/` folder (simulates S3).

Run (from project folder):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Endpoints:
- `POST /api/v1/events` — JSON event payload (device_id, timestamp, driver_state, telemetry, location). Returns computed risk and incident id if created.
- `POST /api/v1/snapshots` — multipart upload for small thumbnails (file field `file`, form fields `device_id`, `timestamp`).
- `GET /api/v1/incidents` — query incidents (from, to, severity).
- `POST /api/v1/devices/{id}/config` — update device config (JSON).
- `POST /api/v1/alerts/ack` — acknowledge alerts.

Example event payload:

```json
{
  "device_id": "device-123",
  "timestamp": "2025-11-16T12:34:56Z",
  "driver_state": {"eye_closed": 0.6, "distracted": 0.2},
  "vehicle_model_score": 20,
  "telemetry": {"speed": 95, "acceleration": 2.3},
  "location": {"lat": 48.8566, "lon": 2.3522}
}
```

This is a minimal prototype to iterate quickly. Next steps: add Redis queue, Postgres persistence, S3 integration, authentication and a more advanced rules engine.
