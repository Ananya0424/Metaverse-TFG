import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routers import health, text, voice, dashboard
from backend.config import get_settings

app = FastAPI(title="V-Guard Fan Assistant API", version="1.0.0")

# CORS — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routers
app.include_router(health.router, prefix="/api")
app.include_router(text.router, prefix="/api")
app.include_router(voice.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

# Static files (TTS audio)
_static_audio = os.path.join(os.path.dirname(__file__), "..", "frontend", "static", "audio")
os.makedirs(_static_audio, exist_ok=True)
app.mount("/static/audio", StaticFiles(directory=_static_audio), name="audio")

# Frontend static files
_frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.isdir(_frontend_dir):
    app.mount("/static", StaticFiles(directory=os.path.join(_frontend_dir, "static")), name="static_root")
    app.mount("/css", StaticFiles(directory=os.path.join(_frontend_dir, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(_frontend_dir, "js")), name="js")
    app.mount("/models", StaticFiles(directory=os.path.join(_frontend_dir, "models")), name="models")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(_frontend_dir, "index.html"))

    @app.get("/dashboard")
    async def serve_dashboard():
        return FileResponse(os.path.join(_frontend_dir, "dashboard.html"))


if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run("backend.app:app", host=settings.host, port=settings.port, reload=True)
