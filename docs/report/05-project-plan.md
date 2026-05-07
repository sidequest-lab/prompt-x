# CHAPTER 05: Project Plan

## 5.1 Project Estimate
### 5.1.1 Reconciled Estimates
**Table 5.1: Effort Estimate (Indicative)**

| Work Package | Estimated Effort (Person-Days) | Actualized Focus |
|---|---:|---|
| Requirements and Analysis | 8 | Domain definition, use-cases, constraints |
| Architecture and Design | 10 | API contracts, data model, module boundaries |
| Backend Development | 18 | Auth, prompt, review, ranking, recommendation |
| Frontend Development | 16 | UX pages, integration, reusable components |
| Testing and Stabilization | 10 | Unit/integration tests, regression checks |
| Documentation and Finalization | 8 | Report, diagrams, deployment and evidence |
| **Total** | **70** | - |

### 5.1.2 Project Resources
- Human resources: 3-4 student developers, 1 faculty guide.
- Software resources: Node.js, Next.js, MongoDB, Docker, Git.
- Infrastructure resources: local development machines and/or cloud VM.

## 5.2 Risk Management
### 5.2.1 Risk Identification
- External AI provider instability.
- Inconsistent prompt quality at scale.
- Ranking bias toward high-activity users.
- API misuse and unauthorized access attempts.
- Timeline compression near final submission window.

### 5.2.2 Risk Analysis
**Table 5.2: Risk Register**

| Risk ID | Risk | Probability | Impact | Priority |
|---|---|---|---|---|
| R1 | AI provider downtime | Medium | High | High |
| R2 | Security misconfiguration | Low-Medium | High | High |
| R3 | Performance degradation under load | Medium | Medium | Medium |
| R4 | Requirement drift | Medium | Medium | Medium |
| R5 | Documentation delay | Medium | Medium | Medium |

### 5.2.3 Risk Mitigation, Monitoring, Management
- R1: Heuristic fallback evaluation and retryable task model.
- R2: Route guards, validation, middleware hardening, secret management.
- R3: Index strategy, async processing, pagination, selective projections.
- R4: Iterative checkpoints and scope freeze before final testing.
- R5: Parallel documentation updates tied to implementation milestones.

## 5.3 Project Schedule
### 5.3.1 Project Task Set
**Table 5.3: Task Set**

| Task ID | Task | Dependency |
|---|---|---|
| T1 | Requirement analysis and scope lock | - |
| T2 | Architecture and schema design | T1 |
| T3 | Backend core modules | T2 |
| T4 | Frontend integration | T3 |
| T5 | Evaluation/ranking/recommendation refinement | T3 |
| T6 | Testing and bug fixing | T4, T5 |
| T7 | Documentation and final packaging | T6 |

### 5.3.2 Task Network
T1 -> T2 -> (T3 + T4 + T5 in controlled overlap) -> T6 -> T7

### 5.3.3 Timeline Chart
- Week 1-2: T1, T2
- Week 3-5: T3
- Week 4-6: T4, T5
- Week 7: T6
- Week 8: T7

## 5.4 Team Organization
### 5.4.1 Team Structure
- Project Lead: schedule ownership, integration control.
- Backend Lead: API/services/data models/testing.
- Frontend Lead: UX flows, state handling, integration.
- QA/Documentation Lead: test planning, traceability, report quality.

### 5.4.2 Management Reporting and Communication
- Weekly sprint review with guide.
- Issue tracking with priority labels.
- Daily async update log for blockers and decisions.
- Milestone-based demo checkpoints before final submission.
