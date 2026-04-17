---
name: websocket-patterns
description: Real-time WebSocket patterns — connection management, broadcasting, presence, reconnection
triggers: [WebSocket, real-time, Socket.IO, bidirectional, real-time updates, live data]
---

# SKILL: WebSocket Patterns

## Connection Management

```python
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Message: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

## Client Reconnection

```typescript
class WebSocketClient {
  private ws: WebSocket
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  
  connect() {
    this.ws = new WebSocket('ws://localhost:8000/ws')
    
    this.ws.onopen = () => {
      console.log('Connected')
      this.reconnectAttempts = 0
    }
    
    this.ws.onclose = () => {
      this.reconnect()
    }
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      setTimeout(() => this.connect(), delay)
    }
  }
}
```

## Room-Based Broadcasting

```python
class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}
    
    async def join_room(self, room_id: str, websocket: WebSocket):
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)
    
    async def broadcast_to_room(self, room_id: str, message: str):
        if room_id in self.rooms:
            for connection in self.rooms[room_id]:
                await connection.send_text(message)
```

## Quality Checks
- [ ] Reconnection logic implemented
- [ ] Heartbeat/ping-pong for connection health
- [ ] Authentication on connection
- [ ] Rate limiting on messages
- [ ] Error handling and logging
- [ ] Room-based broadcasting
- [ ] Message queuing for offline users
- [ ] Horizontal scaling (Redis pub/sub)
