from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import redis
from datetime import datetime
import json

app = FastAPI(title="MindLab Play API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    return psycopg2.connect(
        dbname="mindlab",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432",
        cursor_factory=RealDictCursor
    )

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

class SyncEvent(BaseModel):
    userId: str
    gameId: str
    sessionId: str
    timestamp: int
    type: str
    payload: dict
    clientSeq: int

class SyncRequest(BaseModel):
    events: List[SyncEvent]

@app.get("/")
async def root():
    return {"message": "MindLab Play API", "version": "1.0.0"}

@app.post("/sync")
async def sync_events(request: SyncRequest):
    conn = get_db()
    cursor = conn.cursor()
    try:
        synced_count = 0
        for event in request.events:
            cursor.execute("""
                INSERT INTO events (user_id, game_id, session_id, timestamp, type, payload, client_seq)
                VALUES (%s, %s, %s, to_timestamp(%s), %s, %s, %s)
                ON CONFLICT DO NOTHING
                RETURNING id
            """, (
                event.userId, event.gameId, event.sessionId,
                event.timestamp / 1000, event.type, json.dumps(event.payload), event.clientSeq
            ))
            if cursor.fetchone():
                synced_count += 1
        
        conn.commit()
        return {"synced": synced_count, "total": len(request.events)}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/leaderboards/{scope}/{period}")
async def get_leaderboard(
    scope: str, 
    period: str, 
    gameId: Optional[str] = None, 
    limit: int = 100
):
    conn = get_db()
    cursor = conn.cursor()
    try:
        if scope == "game" and gameId:
            cursor.execute("""
                SELECT u.username, gs.score, 
                       ROW_NUMBER() OVER (ORDER BY gs.score DESC) as rank
                FROM game_scores gs
                JOIN users u ON gs.user_id = u.id
                WHERE gs.game_id = %s AND gs.period = %s
                ORDER BY gs.score DESC
                LIMIT %s
            """, (gameId, period, limit))
        else:
            cursor.execute("""
                SELECT u.username, gs.score,
                       ROW_NUMBER() OVER (ORDER BY gs.score DESC) as rank
                FROM global_scores gs
                JOIN users u ON gs.user_id = u.id
                WHERE gs.period = %s
                ORDER BY gs.score DESC
                LIMIT %s
            """, (period, limit))
        
        results = cursor.fetchall()
        return [dict(row) for row in results]
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
