# Order & Product Microservices – Notes & Design Decisions

This repository contains a simplified **event-driven microservices system** composed of:

- **product-service** – manages product types and stock
- **order-service** – manages orders, pricing, and order lifecycle
- **Kafka** – asynchronous communication
- **MongoDB** – persistence layer

The implementation focuses on **CQRS**, **event-driven consistency**, and **explicit business rules** rather than infrastructure completeness.

---

## 1. Assumptions & Simplifications

### 1.1 Key assumptions

- **Single currency system**  
  Prices are treated as normalized numeric values. Currency conversion is intentionally omitted.

- **At-least-once event delivery**  
  Kafka consumers are idempotent. Duplicate events do not corrupt state.

- **Immutable orders after creation**  
  Orders transition only via Kafka events (`PENDING → APPROVED / REJECTED`).

- **Stock represented as individual units**  
  Each product unit is stored as a MongoDB document to ensure atomic stock operations.

### 1.2 Intentionally omitted elements

- Authentication / authorization
- Distributed tracing
- Kafka retries & DLQ
- Currency conversion
- External holiday APIs

These were excluded to keep focus on core business logic.

### 1.3 Interpretation of ambiguous requirements

- **Discounts cannot be combined** – highest discount wins
- **Location pricing applied before discounts**
- **Polish holidays** implemented via static + Easter-based rules

---

## 2. Technical Decisions

### 2.1 Database choice – MongoDB

Chosen for:
- Flexible schema
- Transactions
- Aggregation for stock availability

### 2.2 Project structure

Feature-oriented layout:

```
src/
 ├── commands/
 ├── queries/
 ├── consumers/
 ├── domain/
 ├── controllers/
 ├── models/
```

This improves traceability of business flows.

### 2.3 CQRS approach

- **Commands** mutate state and emit events
- **Queries** are read-only

CQRS is enforced by module boundaries, not frameworks.

---

## 3. Business Logic

### 3.1 Pricing & discounts

Execution order:
1. Base price calculation
2. Location pricing (US / EU / ASIA)
3. Discount evaluation
4. Highest discount applied

### 3.2 Stock consistency

- Availability checked before deduction
- Deduction performed transactionally
- Insufficient stock triggers `order.rejected` event

No negative stock is possible.

### 3.3 Edge cases handled

- Empty orders
- Invalid quantities
- Insufficient stock
- Concurrent orders
- Duplicate Kafka events

---

## 4. Testing

### 4.1 Covered

- Pricing engine
- API endpoints
- Kafka consumers

Kafka is mocked to ensure deterministic tests.

### 4.2 Not covered

- Kafka rebalancing
- Crash recovery
- Load testing
- Observability

---

## 5. Trade-offs & Alternatives

### 5.1 Decision to revisit

**Stock as individual documents**

Pros:
- Simple
- Safe concurrency

Cons:
- Storage-heavy
- Slower at scale

Would replace with counters or reservations.

### 5.2 Alternative rejected

**Synchronous stock validation**

Rejected due to tight coupling and reduced resilience.

### 5.3 Why event-driven

Pros:
- Loose coupling
- Scalability

Cons:
- Eventual consistency
- Harder debugging


