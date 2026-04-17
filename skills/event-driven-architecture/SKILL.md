---
name: event-driven-architecture
description: Event-driven systems — event sourcing, message queues, pub/sub, saga patterns
triggers: [event-driven, event sourcing, message queue, pub/sub, kafka, rabbitmq, event bus]
---

# SKILL: Event-Driven Architecture

## Core Patterns

### Pattern 1: Event Sourcing
```python
from dataclasses import dataclass
from datetime import datetime
from typing import List

@dataclass
class Event:
    event_type: str
    data: dict
    timestamp: datetime
    aggregate_id: str

# Event store
events_db = []

# Events (immutable facts)
class OrderPlaced(Event):
    pass

class OrderShipped(Event):
    pass

class OrderCancelled(Event):
    pass

# Aggregate (current state from events)
class Order:
    def __init__(self, order_id: str):
        self.order_id = order_id
        self.status = "pending"
        self.items = []
        self.total = 0
    
    def apply_event(self, event: Event):
        """Rebuild state from events"""
        if isinstance(event, OrderPlaced):
            self.items = event.data["items"]
            self.total = event.data["total"]
            self.status = "placed"
        elif isinstance(event, OrderShipped):
            self.status = "shipped"
        elif isinstance(event, OrderCancelled):
            self.status = "cancelled"
    
    @classmethod
    def from_events(cls, order_id: str, events: List[Event]):
        """Reconstruct from event history"""
        order = cls(order_id)
        for event in events:
            order.apply_event(event)
        return order

# Usage
def place_order(order_id: str, items: List[dict]):
    event = OrderPlaced(
        event_type="OrderPlaced",
        data={"items": items, "total": sum(i["price"] for i in items)},
        timestamp=datetime.now(),
        aggregate_id=order_id
    )
    events_db.append(event)  # Store event
    
# Rebuild current state
order_events = [e for e in events_db if e.aggregate_id == "order-123"]
order = Order.from_events("order-123", order_events)
```

### Pattern 2: Pub/Sub (Event Bus)
```python
from typing import Callable, Dict, List

class EventBus:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
    
    def subscribe(self, event_type: str, handler: Callable):
        """Subscribe to event type"""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(handler)
    
    def publish(self, event_type: str, data: dict):
        """Publish event to all subscribers"""
        if event_type in self.subscribers:
            for handler in self.subscribers[event_type]:
                handler(data)

# Usage
bus = EventBus()

# Subscribers
def send_confirmation_email(data):
    print(f"Sending email to {data['email']}")

def update_inventory(data):
    print(f"Updating inventory for {data['items']}")

def notify_shipping(data):
    print(f"Notifying shipping dept")

# Subscribe
bus.subscribe("OrderPlaced", send_confirmation_email)
bus.subscribe("OrderPlaced", update_inventory)
bus.subscribe("OrderPlaced", notify_shipping)

# Publish
bus.publish("OrderPlaced", {
    "order_id": "123",
    "email": "user@example.com",
    "items": ["product-1", "product-2"]
})
# All 3 handlers execute
```

### Pattern 3: Saga Pattern (Distributed Transactions)
```python
class BookingSaga:
    """Coordinate multi-service transaction with rollback"""
    
    def __init__(self):
        self.completed_steps = []
    
    async def execute(self, booking_data):
        try:
            # Step 1: Reserve flight
            flight = await flight_service.reserve(booking_data["flight_id"])
            self.completed_steps.append(("flight", flight["id"]))
            
            # Step 2: Reserve hotel
            hotel = await hotel_service.reserve(booking_data["hotel_id"])
            self.completed_steps.append(("hotel", hotel["id"]))
            
            # Step 3: Charge payment
            payment = await payment_service.charge(booking_data["amount"])
            self.completed_steps.append(("payment", payment["id"]))
            
            # All succeeded - commit
            await self.commit()
            
        except Exception as e:
            # Any step failed - rollback
            await self.rollback()
            raise
    
    async def rollback(self):
        """Undo completed steps in reverse order"""
        for step_type, step_id in reversed(self.completed_steps):
            if step_type == "flight":
                await flight_service.cancel(step_id)
            elif step_type == "hotel":
                await hotel_service.cancel(step_id)
            elif step_type == "payment":
                await payment_service.refund(step_id)
    
    async def commit(self):
        """Confirm all reservations"""
        for step_type, step_id in self.completed_steps:
            if step_type == "flight":
                await flight_service.confirm(step_id)
            elif step_type == "hotel":
                await hotel_service.confirm(step_id)
```

### Pattern 4: Message Queue (RabbitMQ)
```python
import pika

# Publisher
def publish_event(event_type: str, data: dict):
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    
    # Declare queue
    channel.queue_declare(queue='order_events', durable=True)
    
    # Publish message
    channel.basic_publish(
        exchange='',
        routing_key='order_events',
        body=json.dumps({"type": event_type, "data": data}),
        properties=pika.BasicProperties(delivery_mode=2)  # Persistent
    )
    
    connection.close()

# Consumer
def consume_events():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    
    channel.queue_declare(queue='order_events', durable=True)
    
    def callback(ch, method, properties, body):
        event = json.loads(body)
        print(f"Processing: {event['type']}")
        
        # Process event
        if event["type"] == "OrderPlaced":
            process_order(event["data"])
        
        # Acknowledge
        ch.basic_ack(delivery_tag=method.delivery_tag)
    
    channel.basic_consume(queue='order_events', on_message_callback=callback)
    channel.start_consuming()
```

### Pattern 5: CQRS (Command Query Responsibility Segregation)
```python
# Write model (commands)
class OrderWriteModel:
    def place_order(self, order_data):
        event = OrderPlaced(**order_data)
        event_store.append(event)
        
        # Update write DB
        orders_db.insert(order_data)

# Read model (queries, optimized)
class OrderReadModel:
    def get_order(self, order_id):
        # Fast read from denormalized view
        return orders_view.find_one({"id": order_id})
    
    def get_orders_by_customer(self, customer_id):
        # Optimized query
        return orders_view.find({"customer_id": customer_id})

# Event handler updates read model
def update_read_model(event):
    if isinstance(event, OrderPlaced):
        orders_view.insert({
            "id": event.order_id,
            "customer_id": event.customer_id,
            "status": "placed",
            "total": event.total
        })
```

## Quality Checks
- [ ] Events are immutable (append-only)
- [ ] Event schema versioned
- [ ] Idempotent consumers (handle duplicates)
- [ ] Dead letter queue for failed messages
- [ ] Event replay capability
- [ ] Saga compensation logic tested
- [ ] Message persistence enabled
- [ ] Consumer retry logic implemented
