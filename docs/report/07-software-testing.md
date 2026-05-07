# CHAPTER 07: Software Testing

## 7.1 Type of Testing
PromptX testing strategy includes:
- Unit-level checks for utility and scoring logic.
- API integration tests for route/controller/service interaction.
- Functional testing for critical user flows (auth, CRUD, interactions).
- Regression testing for ranking/evaluation side effects.
- Basic security validation through negative request scenarios.

## 7.2 Test Cases and Test Results
**Table 7.1: Representative Test Cases**

| Test ID | Scenario | Expected Result | Status |
|---|---|---|---|
| TC-AUTH-01 | Register with valid payload | User created, auth tokens/session generated | Pass |
| TC-AUTH-02 | Login with invalid password | Unauthorized response, no session issuance | Pass |
| TC-PROMPT-01 | Create prompt as authenticated user | Prompt persisted, evaluation task created | Pass |
| TC-PROMPT-02 | Create prompt with invalid content length | Validation error response | Pass |
| TC-REV-01 | Submit first review for prompt | Review stored, aggregates updated | Pass |
| TC-REV-02 | Duplicate review by same user | Duplicate prevented by unique constraint | Pass |
| TC-INT-01 | Like prompt then unlike | Counts update correctly in both operations | Pass |
| TC-RANK-01 | Score recalculation after new engagement | rankingScore updated and reflected in listing | Pass |
| TC-EVAL-01 | AI service unavailable | Heuristic fallback updates evaluation fields | Pass |
| TC-SEC-01 | Access protected endpoint without token | 401/forbidden behavior enforced | Pass |

## 7.3 Testing Evidence Traceability
Implemented backend test suite includes health checks and logic validation tests (for example ranking and heuristic evaluation behaviors). Additional project-level manual verification should be attached in the final submission bundle:
- Request/response captures,
- UI workflow evidence,
- Defect and fix log snapshots.

## 7.4 Defect Handling Approach
- Reproduce and isolate by module.
- Add or extend test before fix when feasible.
- Validate regression impact on adjacent modules.
- Track closure with commit references and test rerun summary.
