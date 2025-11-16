from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Device(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: str
    config: Optional[str] = None
    model_version: Optional[str] = None


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: Optional[str] = None
    device_id: str
    timestamp: datetime
    payload: Optional[str] = None
    thumbnail_path: Optional[str] = None


class Incident(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: str
    timestamp: datetime
    score: float
    severity: str
    thumbnail_path: Optional[str] = None
    payload: Optional[str] = None
