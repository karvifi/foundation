---
name: stream-processing-patterns
description: Real-time stream processing — windowing, aggregations, stateful processing
triggers: [stream processing, real-time, windowing, kafka streams, event streaming, data streams]
---

# SKILL: Stream Processing Patterns

## Windowing Patterns

### Pattern 1: Tumbling Window
```python
# Fixed-size, non-overlapping windows
# Example: 5-minute windows
# [0-5min] [5-10min] [10-15min]

from datetime import timedelta

def tumbling_window_aggregate(events, window_size=timedelta(minutes=5)):
    windows = {}
    
    for event in events:
        # Determine window
        window_start = (event.timestamp // window_size) * window_size
        window_key = window_start
        
        # Aggregate
        if window_key not in windows:
            windows[window_key] = []
        windows[window_key].append(event)
    
    return windows

# Usage: Count events per 5-minute window
windows = tumbling_window_aggregate(events)
for window, events in windows.items():
    print(f"Window {window}: {len(events)} events")
```

### Pattern 2: Sliding Window
```python
# Overlapping windows
# Example: 10-minute window, sliding every 1 minute
# [0-10] [1-11] [2-12] [3-13]

from collections import deque

class SlidingWindow:
    def __init__(self, window_size_seconds=600, slide_interval=60):
        self.window_size = window_size_seconds
        self.slide_interval = slide_interval
        self.events = deque()
    
    def add_event(self, event):
        """Add event and remove expired events"""
        self.events.append(event)
        
        # Remove events outside window
        cutoff = event.timestamp - self.window_size
        while self.events and self.events[0].timestamp < cutoff:
            self.events.popleft()
    
    def get_aggregation(self):
        """Calculate metric over current window"""
        return {
            "count": len(self.events),
            "sum": sum(e.value for e in self.events),
            "avg": sum(e.value for e in self.events) / len(self.events)
        }
```

### Pattern 3: Session Window
```python
# Window based on inactivity gap
# Example: Session ends after 30 minutes of inactivity

class SessionWindow:
    def __init__(self, inactivity_gap=1800):  # 30 minutes
        self.gap = inactivity_gap
        self.sessions = {}
    
    def process_event(self, user_id, event):
        """Assign event to session"""
        if user_id not in self.sessions:
            # New session
            self.sessions[user_id] = {
                "start": event.timestamp,
                "end": event.timestamp,
                "events": [event]
            }
        else:
            session = self.sessions[user_id]
            gap = event.timestamp - session["end"]
            
            if gap > self.gap:
                # Session ended, start new one
                self.close_session(user_id)
                self.sessions[user_id] = {
                    "start": event.timestamp,
                    "end": event.timestamp,
                    "events": [event]
                }
            else:
                # Extend session
                session["end"] = event.timestamp
                session["events"].append(event)
```

## Stateful Processing

### Pattern 4: Aggregation State
```python
class AggregationState:
    """Maintain running aggregations"""
    def __init__(self):
        self.state = {}  # {key: {count, sum, min, max}}
    
    def update(self, key, value):
        """Update aggregation"""
        if key not in self.state:
            self.state[key] = {
                "count": 0,
                "sum": 0,
                "min": float('inf'),
                "max": float('-inf')
            }
        
        s = self.state[key]
        s["count"] += 1
        s["sum"] += value
        s["min"] = min(s["min"], value)
        s["max"] = max(s["max"], value)
    
    def get(self, key):
        """Get current aggregation"""
        s = self.state[key]
        return {
            **s,
            "avg": s["sum"] / s["count"]
        }

# Usage: Track metrics per user
state = AggregationState()

for event in stream:
    state.update(event.user_id, event.value)
    
    # Get current stats
    stats = state.get(event.user_id)
    print(f"User {event.user_id}: avg={stats['avg']}")
```

### Pattern 5: Join Streams
```python
class StreamJoin:
    """Join two streams with windowed buffer"""
    def __init__(self, window_size=300):  # 5 minutes
        self.left_buffer = {}
        self.right_buffer = {}
        self.window_size = window_size
    
    def process_left(self, event):
        """Process left stream event"""
        key = event.key
        
        # Check if matching right event exists
        if key in self.right_buffer:
            # Join found
            return self.join(event, self.right_buffer[key])
        else:
            # Buffer for later
            self.left_buffer[key] = event
    
    def process_right(self, event):
        """Process right stream event"""
        key = event.key
        
        if key in self.left_buffer:
            return self.join(self.left_buffer[key], event)
        else:
            self.right_buffer[key] = event
    
    def join(self, left, right):
        """Combine matching events"""
        return {
            "key": left.key,
            "left_data": left.data,
            "right_data": right.data,
            "timestamp": max(left.timestamp, right.timestamp)
        }
```

## Kafka Streams Example

```python
from kafka import KafkaConsumer, KafkaProducer
import json

# Consumer
consumer = KafkaConsumer(
    'events',
    bootstrap_servers=['localhost:9092'],
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

# Producer (for output)
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Process stream
window = SlidingWindow()

for message in consumer:
    event = message.value
    
    # Add to window
    window.add_event(event)
    
    # Calculate aggregation
    agg = window.get_aggregation()
    
    # Emit result
    producer.send('aggregated_events', agg)
```

## Quality Checks
- [ ] Windowing strategy defined (tumbling/sliding/session)
- [ ] State management implemented
- [ ] Late-arriving events handled
- [ ] Watermarks configured
- [ ] Exactly-once processing guaranteed
- [ ] Checkpointing enabled
- [ ] Backpressure handling
- [ ] Monitoring (lag, throughput)
