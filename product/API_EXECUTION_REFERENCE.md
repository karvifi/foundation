# Software Synthesis OS - Execution Engine API Reference

## Overview
Complete REST API for graph execution, operation tracking, and multi-engine coordination. Built on Hono.js with TypeScript strict mode, running on port 3001.

---

## 🎯 Core Execution Endpoints

### POST `/workspace/sessions/:id/select`
**Trigger multi-engine context propagation and operation execution**

```http
POST /workspace/sessions/sess_demo/select
Content-Type: application/json
X-User-ID: usr_demo
X-User-Role: owner

{
  "sourceEngineId": "crm",
  "entityType": "Account",
  "entityId": "account_12345",
  "selectedLabel": "Acme Corp"
}
```

**Response (200)**
```json
{
  "event": {
    "id": "event_1704067200000",
    "workspaceId": "ws_demo",
    "sessionId": "sess_demo",
    "sourceEngineId": "crm",
    "type": "record.selected",
    "payload": {
      "entityType": "Account",
      "entityId": "account_12345",
      "selectedLabel": "Acme Corp"
    },
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "reactions": [
    { "engineId": "email", "action": "filter", "summary": "Load relevant emails" },
    { "engineId": "calendar", "action": "filter", "summary": "Show account meetings" },
    { "engineId": "document", "action": "hydrate", "summary": "Load related docs" },
    { "engineId": "dashboard", "action": "focus", "summary": "Highlight account metrics" }
  ],
  "operations": [
    {
      "id": "op_1704067200000_email",
      "sessionId": "sess_demo",
      "engineId": "email",
      "operation": "inbox.load",
      "input": { "entityId": "account_12345", "label": "Acme Corp" },
      "output": {
        "inboxCount": 24,
        "recentMessages": [
          {
            "id": "msg_001",
            "from": "acme@example.com",
            "subject": "Q1 Planning Discussion",
            "date": "2024-01-01T10:30:00Z"
          }
        ],
        "templates": ["follow_up", "proposal", "status_update"]
      },
      "status": "success",
      "startedAt": "2024-01-01T12:00:00.000Z",
      "finishedAt": "2024-01-01T12:00:01.234Z",
      "durationMs": 1234
    },
    {
      "id": "op_1704067200001_calendar",
      "sessionId": "sess_demo",
      "engineId": "calendar",
      "operation": "events.filter",
      "input": { "entityId": "account_12345", "label": "Acme Corp" },
      "output": {
        "events": [
          {
            "id": "evt_001",
            "title": "Acme Quarterly Review",
            "start": "2024-01-05T14:00:00Z",
            "end": "2024-01-05T15:00:00Z",
            "attendees": 6
          }
        ],
        "nextMeeting": "2024-01-05T14:00:00Z",
        "suggestedTimes": ["2024-01-02T15:00:00Z", "2024-01-03T10:00:00Z"]
      },
      "status": "success",
      "startedAt": "2024-01-01T12:00:00.500Z",
      "finishedAt": "2024-01-01T12:00:01.678Z",
      "durationMs": 1178
    }
  ],
  "layoutMutations": [
    { "panelId": "email_panel", "action": "show", "ratio": 0.3 },
    { "panelId": "calendar_panel", "action": "focus" },
    { "panelId": "metrics_panel", "action": "resize", "ratio": 0.25 }
  ]
}
```

---

### POST `/graphs/:id/execute`
**Execute a synthesized graph with full operation tracking**

```http
POST /graphs/graph_revenue_os_001/execute
Content-Type: application/json
X-User-ID: usr_demo
X-User-Role: owner

{
  "workspaceId": "ws_demo"
}
```

**Response (200)**
```json
{
  "graphId": "graph_revenue_os_001",
  "nodeCount": 8,
  "status": "success",
  "startedAt": "2024-01-01T12:00:00.000Z",
  "finishedAt": "2024-01-01T12:00:05.234Z",
  "durationMs": 5234,
  "operations": [
    {
      "id": "op_node_001_crm",
      "sessionId": "sess_exec_001",
      "engineId": "crm",
      "operation": "contacts.load",
      "input": { "filter": "status:active" },
      "output": { "contacts": [...], "totalCount": 1247 },
      "status": "success",
      "startedAt": "2024-01-01T12:00:00.000Z",
      "finishedAt": "2024-01-01T12:00:01.234Z",
      "durationMs": 1234
    },
    {
      "id": "op_node_002_email",
      "sessionId": "sess_exec_001",
      "engineId": "email",
      "operation": "inbox.load",
      "input": { "filter": "is:unread" },
      "output": { "messages": [...], "unreadCount": 42 },
      "status": "success",
      "startedAt": "2024-01-01T12:00:01.250Z",
      "finishedAt": "2024-01-01T12:00:02.891Z",
      "durationMs": 1641
    }
  ],
  "nodeResults": [
    {
      "nodeId": "node_001",
      "connector": "crm",
      "status": "success",
      "output": { "recordCount": 1247 }
    },
    {
      "nodeId": "node_002",
      "connector": "email",
      "status": "success",
      "output": { "messageCount": 42 }
    }
  ]
}
```

---

### GET `/operations/:id`
**Retrieve a specific operation record**

```http
GET /operations/op_1704067200000_email
X-User-ID: usr_demo
```

**Response (200)**
```json
{
  "id": "op_1704067200000_email",
  "sessionId": "sess_demo",
  "engineId": "email",
  "operation": "inbox.load",
  "input": {
    "entityId": "account_12345",
    "label": "Acme Corp"
  },
  "output": {
    "inboxCount": 24,
    "recentMessages": [
      {
        "id": "msg_001",
        "from": "acme@example.com",
        "subject": "Q1 Planning Discussion",
        "date": "2024-01-01T10:30:00Z"
      }
    ],
    "templates": ["follow_up", "proposal", "status_update"]
  },
  "status": "success",
  "startedAt": "2024-01-01T12:00:00.000Z",
  "finishedAt": "2024-01-01T12:00:01.234Z",
  "durationMs": 1234
}
```

**Response (404)**
```json
{
  "error": "operation not found"
}
```

---

### GET `/operations`
**List operations for a workspace session**

```http
GET /operations?sessionId=sess_demo&limit=20
X-User-ID: usr_demo
```

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sessionId` | string | Yes | - | Filter by session ID |
| `workspaceId` | string | No | ws_demo | Filter by workspace |
| `limit` | number | No | 50 | Maximum results |

**Response (200)**
```json
{
  "items": [
    {
      "id": "op_1704067200000_crm",
      "sessionId": "sess_demo",
      "engineId": "crm",
      "operation": "contact.selected",
      "status": "success",
      "durationMs": 156
    },
    {
      "id": "op_1704067200000_email",
      "sessionId": "sess_demo",
      "engineId": "email",
      "operation": "inbox.load",
      "status": "success",
      "durationMs": 1234
    },
    {
      "id": "op_1704067200001_calendar",
      "sessionId": "sess_demo",
      "engineId": "calendar",
      "operation": "events.filter",
      "status": "success",
      "durationMs": 1178
    }
  ]
}
```

---

## 📊 Supported Engine Operations

### CRM Engine
```typescript
executeEngineOperation(sessionId, "crm", entityId, label)
// Returns:
{
  contact: { id, name, email, phone, status },
  recentDeals: [{ id, name, stage, value }],
  contactHistory: [{ date, action, subject }]
}
```

### Email Engine
```typescript
executeEngineOperation(sessionId, "email", entityId, label)
// Returns:
{
  inboxCount: number,
  recentMessages: [{ id, from, subject, date }],
  templates: string[]
}
```

### Calendar Engine
```typescript
executeEngineOperation(sessionId, "calendar", entityId, label)
// Returns:
{
  events: [{ id, title, start, end, attendees }],
  nextMeeting: ISO8601,
  suggestedTimes: ISO8601[]
}
```

### Document Engine
```typescript
executeEngineOperation(sessionId, "document", entityId, label)
// Returns:
{
  content: string,
  relatedDocs: [{ id, title, relevance }],
  editSuggestions: [{ type, line, suggestion }]
}
```

### Dashboard Engine
```typescript
executeEngineOperation(sessionId, "dashboard", entityId, label)
// Returns:
{
  metrics: { health: number, renewalDate: ISO8601, arr: number, churnRisk: number },
  trends: [{ metric, value, change }]
}
```

### Additional Engines (15 total)
- **Issues**: list, filter, assign operations
- **Code IDE**: files.load, symbols.list, execute
- **Terminal**: commands.list, output.stream
- **Research**: search.execute, sources.list, synthesis
- **Sheet**: cells.load, formulas.list, updates
- **Invoice**: list, totals.compute, status
- **Support**: tickets.list, route.assign
- **Health**: score.compute, sla.check, risk
- **Chat**: messages.list, context.hydrate, response
- **Video**: sessions.list, participants.load, recording

---

## 🔐 Authentication & Authorization

All execution endpoints require:
```http
X-User-ID: usr_<id>         # Required: User identifier
X-User-Role: owner|member   # Required: Role for policy evaluation
X-Org-ID: org_<id>          # Optional: Organization context
```

Permission matrix:
| Endpoint | Permission | Role |
|----------|-----------|------|
| POST /workspace/sessions/:id/select | run.trigger | owner, member |
| POST /graphs/:id/execute | run.trigger | owner, member |
| GET /operations/:id | run.read | owner, member, viewer |
| GET /operations | run.read | owner, member, viewer |

---

## ⚡ Operation Record Structure

```typescript
interface OperationRecord {
  // Identification
  id: string;              // Unique operation ID (op_${timestamp}_${engineId})
  sessionId: string;       // Session context
  engineId: EngineId;      // Target engine (crm|email|calendar|...)
  
  // Execution Metadata
  operation: string;       // Operation key (e.g., "contact.selected")
  status: "pending" | "executing" | "success" | "failed";
  
  // Data Flow
  input: Record<string, unknown>;    // Input parameters
  output: Record<string, unknown>;   // Result data
  
  // Timing & Diagnostics
  startedAt: ISO8601;      // Execution start time
  finishedAt?: ISO8601;    // Execution end time
  durationMs?: number;     // Total execution time
  error?: string;          // Error message (if failed)
}
```

---

## 📈 Error Handling

All execution endpoints return standard error responses:

```json
{
  "error": "error message",
  "statusCode": 400
}
```

Common error codes:
| Code | Message | Cause |
|------|---------|-------|
| 400 | Missing required parameter | Invalid request body |
| 401 | Unauthorized | Missing or invalid auth headers |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not found | Resource doesn't exist |
| 500 | Internal error | Execution engine failure |

---

## 🔄 Execution Flow Diagram

```
User Request
    ↓
POST /workspace/sessions/:id/select
    ↓
publishRecordSelected(sessionId, sourceEngine, entity, label)
    ↓
Create ContextBusEvent(type="record.selected")
    ↓
Calculate EngineReaction[] (which engines react?)
    ↓
For each reaction:
    executeEngineOperation(sessionId, engineId, entityId, label)
    ↓
Each engine executor runs asynchronously:
    CRM        → createOperationRecord() → operationStore.set()
    Email      → createOperationRecord() → operationStore.set()
    Calendar   → createOperationRecord() → operationStore.set()
    Document   → createOperationRecord() → operationStore.set()
    Dashboard  → createOperationRecord() → operationStore.set()
    ↓
OperationRecord[] returned to client
    ↓
Client receives:
    - event (ContextBusEvent)
    - reactions (EngineReaction[])
    - operations (OperationRecord[])
    - layoutMutations (LayoutMutation[])
    ↓
Spatial renderer displays results in real-time
```

---

## 💾 Data Persistence (Phase 3)

Current implementation:
- Operations stored in-memory: `Map<operationId, OperationRecord>`
- Survives within current API process lifetime
- Lost on server restart

Phase 3 will add:
- PostgreSQL persistence via Drizzle ORM
- Operation history API
- Session state recovery
- Audit trail storage

---

## 📝 Examples

### Example 1: Select Account in CRM → Multi-Engine Sync

```bash
curl -X POST http://localhost:3001/workspace/sessions/sess_demo/select \
  -H "Content-Type: application/json" \
  -H "X-User-ID: usr_demo" \
  -d '{
    "sourceEngineId": "crm",
    "entityType": "Account",
    "entityId": "account_12345",
    "selectedLabel": "Acme Corp"
  }'
```

Result: CRM triggers email, calendar, document, and dashboard to load related data in parallel. All operations tracked with timing and results.

### Example 2: Execute Complete Graph

```bash
curl -X POST http://localhost:3001/graphs/graph_revenue_os/execute \
  -H "Content-Type: application/json" \
  -H "X-User-ID: usr_demo" \
  -d '{"workspaceId": "ws_demo"}'
```

Result: All graph nodes execute with operations tracked per engine, layout mutations coordinated, full execution trace available via GET /operations.

### Example 3: Retrieve Operation History

```bash
curl http://localhost:3001/operations?sessionId=sess_demo&limit=10 \
  -H "X-User-ID: usr_demo"
```

Result: Last 10 operations in session with execution times, status, and results.

---

## 🎯 Next Steps

Phase 3 (Database Persistence):
- [ ] Add operations table to schema
- [ ] Persist OperationRecord to database
- [ ] Add session recovery API
- [ ] Implement operation aggregation queries

Phase 4 (Production Hardening):
- [ ] Add rate limiting
- [ ] Implement caching
- [ ] Performance optimization
- [ ] Security audit

---

**Last Updated**: 2024-01-01  
**API Version**: 1.0.0  
**Status**: ✅ Phase 2 Complete - Ready for Phase 3
