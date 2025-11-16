from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select
from typing import Optional, List
from datetime import datetime
import uuid
import json
from models import Device, Event, Incident
from rules import compute_risk, severity_from_score
from storage import save_thumbnail

DB_FILE = "sqlite:///./fastapi_prototype.db"
engine = create_engine(DB_FILE, echo=False)

app = FastAPI(title="Driving Risk Prototype API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.post("/api/v1/snapshots")
async def upload_snapshot(device_id: str = Form(...), timestamp: str = Form(...), file: UploadFile = File(...)):
    # save file
    filename = f"{device_id}_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:8]}_{file.filename}"
    relpath, size = await save_thumbnail(file, filename)
    return {"path": relpath, "size": size}


@app.post("/api/v1/events")
async def post_event(background_tasks: BackgroundTasks, event: dict):
    # Validate minimal fields
    device_id = event.get("device_id")
    ts_raw = event.get("timestamp")
    if not device_id or not ts_raw:
        raise HTTPException(status_code=400, detail="device_id and timestamp required")

    try:
        ts = datetime.fromisoformat(ts_raw.replace("Z", "+00:00"))
    except Exception:
        ts = datetime.utcnow()

    # compute risk
    score = compute_risk(event)
    severity = severity_from_score(score)

    # store event and maybe incident
    with Session(engine) as session:
        ev = Event(event_id=str(uuid.uuid4()), device_id=device_id, timestamp=ts, payload=json.dumps(event))
        session.add(ev)
        session.commit()
        session.refresh(ev)

        incident_id = None
        if severity in ("moderate", "high"):
            inc = Incident(device_id=device_id, timestamp=ts, score=score, severity=severity, payload=json.dumps(event))
            session.add(inc)
            session.commit()
            session.refresh(inc)
            incident_id = inc.id

    return {"risk_score": score, "severity": severity, "incident_id": incident_id}


@app.get("/api/v1/incidents")
def list_incidents(from_ts: Optional[str] = Query(None), to_ts: Optional[str] = Query(None), severity: Optional[str] = Query(None)):
    with Session(engine) as session:
        q = select(Incident)
        if from_ts:
            try:
                fdt = datetime.fromisoformat(from_ts.replace("Z", "+00:00"))
                q = q.where(Incident.timestamp >= fdt)
            except Exception:
                pass
        if to_ts:
            try:
                tdt = datetime.fromisoformat(to_ts.replace("Z", "+00:00"))
                q = q.where(Incident.timestamp <= tdt)
            except Exception:
                pass
        if severity:
            q = q.where(Incident.severity == severity)
        rows = session.exec(q).all()
        out = []
        for r in rows:
            out.append({
                "id": r.id,
                "device_id": r.device_id,
                "timestamp": r.timestamp.isoformat(),
                "score": r.score,
                "severity": r.severity,
                "thumbnail": r.thumbnail_path,
            })
        return out


@app.post("/api/v1/devices/{device_id}/config")
def update_device_config(device_id: str, config: dict):
    with Session(engine) as session:
        q = select(Device).where(Device.device_id == device_id)
        dev = session.exec(q).first()
        if not dev:
            dev = Device(device_id=device_id, config=json.dumps(config))
            session.add(dev)
        else:
            dev.config = json.dumps(config)
            session.add(dev)
        session.commit()
        return {"device_id": device_id, "config": config}


class Ack(BaseException):
    pass


@app.post("/api/v1/alerts/ack")
def ack_alert(payload: dict):
    # minimal ack processing
    alert_id = payload.get("alert_id")
    who = payload.get("ack_by")
    if not alert_id or not who:
        raise HTTPException(status_code=400, detail="alert_id and ack_by required")
    # In a full system we'd mark incident/alert as acknowledged.
    return {"alert_id": alert_id, "ack_by": who, "status": "acknowledged"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
