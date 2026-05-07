# CHAPTER 04: System Design

## 4.1 System Architecture
**Figure 4.1: High-Level System Architecture**

```mermaid
flowchart LR
    U[End Users] --> F[Next.js Frontend]
    F -->|REST API| B[Express Backend]
    B --> DB[(MongoDB)]
    B --> EV[Evaluation Service]
    EV --> EXT[External AI Provider]
    EV --> HEU[Heuristic Fallback Engine]
    B --> RK[Ranking Service]
    B --> RC[Recommendation Service]
```

### Architecture Notes
- Frontend and backend are independently deployable services.
- Backend is the sole data access layer to MongoDB.
- Evaluation and ranking pipelines are asynchronous to protect request latency.

## 4.2 Data Flow Diagrams
**Figure 4.2: Context Diagram (DFD Level 0)**

```mermaid
flowchart TB
    User[User/Creator] -->|Register/Login, Browse, Submit| System[PromptX System]
    Admin[Administrator] -->|Moderation/Evaluation Trigger| System
    System -->|Prompt Listings, Recommendations, Workspace| User
    System -->|Status/Logs| Admin
    System <-->|Data Persist/Fetch| DB[(MongoDB)]
    System <-->|Score Request/Response| AI[AI Evaluation Provider]
```

**Figure 4.3: DFD Level 1**

```mermaid
flowchart LR
    U[User] --> P1[Auth Process]
    U --> P2[Prompt Management]
    U --> P3[Engagement Process]
    U --> P4[Discovery Process]

    P1 --> D1[(User Data)]
    P2 --> D2[(Prompt Data)]
    P3 --> D3[(Engagement Data)]
    P3 --> D4[(Review Data)]
    P2 --> P5[Evaluation Queue]
    P5 --> P6[Scoring Engine]
    P6 --> D5[(Evaluation Task Data)]
    P6 --> D2
    P4 --> P7[Ranking + Recommendation]
    P7 --> D2
    P7 --> D3
    P7 --> U
```

## 4.3 Entity Relationship Diagram
**Figure 4.4: ER Diagram**

```mermaid
erDiagram
    USER ||--o{ PROMPT : creates
    USER ||--o{ REVIEW : writes
    USER ||--o{ LIKE : performs
    USER ||--o{ FAVORITE : performs
    USER ||--o{ USER_ACTIVITY : generates
    PROMPT ||--o{ REVIEW : receives
    PROMPT ||--o{ LIKE : receives
    PROMPT ||--o{ FAVORITE : receives
    PROMPT ||--|| EVALUATION_TASK : has

    USER {
      string id
      string name
      string email
      string role
      string bio
      string avatarUrl
      string[] favoriteTags
    }

    PROMPT {
      string id
      string title
      string slug
      string category
      string[] tags
      number rankingScore
      number ratingAverage
      number views
      string evaluationStatus
      object aiScore
      string evaluationSource
    }

    REVIEW {
      string id
      string userId
      string promptId
      number rating
      string comment
    }

    LIKE {
      string id
      string userId
      string promptId
    }

    FAVORITE {
      string id
      string userId
      string promptId
    }

    USER_ACTIVITY {
      string id
      string userId
      string promptId
      string action
      string[] tags
      datetime createdAt
    }

    EVALUATION_TASK {
      string id
      string promptId
      string status
      number attempts
      datetime availableAt
      string lastError
    }
```

## 4.4 UML Diagrams
**Figure 4.5: UML Use Case Diagram**

```mermaid
flowchart LR
    A[Anonymous Visitor] --> UC1[View Landing and Browse]
    U[Authenticated User] --> UC2[Create Prompt]
    U --> UC3[Like/Favorite Prompt]
    U --> UC4[Submit Review]
    U --> UC5[Manage Profile]
    U --> UC6[View Recommendations]
    AD[Admin] --> UC7[Trigger Evaluation]
    AD --> UC8[Monitor Platform Stats]
```

**Figure 4.6: UML Class Diagram (Conceptual)**

```mermaid
classDiagram
    class User {
      +id
      +name
      +email
      +role
      +favoriteTags
      +comparePassword()
    }

    class Prompt {
      +id
      +title
      +slug
      +content
      +category
      +aiScore
      +rankingScore
    }

    class Review {
      +id
      +rating
      +comment
    }

    class EvaluationTask {
      +status
      +attempts
      +availableAt
    }

    class RankingService {
      +recalculatePromptRanking()
    }

    class RecommendationService {
      +getRecommendedPrompts()
    }

    User "1" --> "many" Prompt : creates
    User "1" --> "many" Review : writes
    Prompt "1" --> "many" Review : has
    Prompt "1" --> "1" EvaluationTask : queues
    RankingService --> Prompt : updates score
    RecommendationService --> User : reads preferences
```

**Figure 4.7: UML Sequence Diagram - Prompt Submission and Evaluation**

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API as Backend API
    participant DB as MongoDB
    participant Queue as Evaluation Queue
    participant Eval as Evaluation Service

    User->>Frontend: Submit Prompt Form
    Frontend->>API: POST /prompts
    API->>DB: Save prompt (status: pending eval)
    API->>Queue: Create evaluation task
    API-->>Frontend: Prompt created response
    Queue->>Eval: Process pending task
    Eval->>DB: Update aiScore/evaluation summary
    Eval->>API: Trigger ranking recalculation
    API->>DB: Persist rankingScore
```

**Figure 4.8: UML Activity Diagram - Prompt Lifecycle**

```mermaid
flowchart TD
    S[Start] --> A[User Creates Prompt]
    A --> B[Prompt Stored]
    B --> C[Evaluation Task Queued]
    C --> D{AI Service Available?}
    D -- Yes --> E[AI Evaluation]
    D -- No --> F[Heuristic Evaluation]
    E --> G[Update Scores]
    F --> G
    G --> H[Recalculate Ranking]
    H --> I[Visible in Browse/Recommended]
    I --> J[User Engagement Events]
    J --> H
    H --> K[End]
```

**Figure 4.9: UML Deployment Diagram**

```mermaid
flowchart LR
    subgraph Client
      B1[Web Browser]
    end

    subgraph AppHost[Application Host]
      F1[Frontend Container\nNext.js]
      B2[Backend Container\nNode.js/Express]
    end

    subgraph DataHost[Data Host]
      M1[(MongoDB Container)]
    end

    subgraph External
      A1[AI Evaluation API]
    end

    B1 --> F1
    F1 --> B2
    B2 --> M1
    B2 --> A1
```
