# SmartGrow AI — Technical Blueprint

## 1. Product definition

**SmartGrow AI** is a learning and digital-wellbeing companion for children aged **5–8**, with a parent-facing area for oversight and controls. It turns a short, intentional digital session into a connected learning journey: learn something, practice it, try an offline activity, and then take a break.

The product should support healthy use rather than maximize time in the app. It is an educational prototype, not a medical product or a treatment for smartphone addiction.

### MVP outcomes

1. A parent can create and manage a child profile.
2. A child can use age-appropriate stories, quizzes, games, and offline activities.
3. Activities can connect around a shared topic and produce a simple progress summary.
4. A parent can set a session limit and review activity.
5. A session can end with a positive break prompt and an offline suggestion.

### MVP boundaries

- Start with one child profile per parent account if that keeps the first release smaller; support multiple profiles in the data model.
- Target ages 5–8. Do not design independent use for children under two.
- The first release may use curated templates or a replaceable LLM provider. Do not imply content is AI-generated unless it is.
- Use browser text-to-speech and speech recognition only where supported and with clear user-initiated controls.
- Defer image uploads, facial recognition, continuous camera/microphone access, and automated evaluation of child-submitted photos.
- Do not collect precise location, contacts, advertising identifiers, or behavioral data for ad targeting.

## 2. System architecture

### MVP deployment topology

```text
Child / Parent browser
        |
        | HTTPS, JSON REST
        v
FastAPI application
  |-- authentication and authorization
  |-- profiles and parent controls
  |-- learning content and activities
  |-- session and progress tracking
  |-- AI provider adapters
        |
        +---- MySQL
        |
        +---- LLM provider (server-side only; optional for MVP)
```

The current static HTML/CSS/JavaScript client and FastAPI backend are a suitable prototype foundation. Keep the frontend as a static client for the first MVP, but move data and business rules into typed backend services as features are added. The backend must be the authority for account permissions, limits, and stored progress.

### Backend components

- **API layer:** FastAPI routers, request/response validation, versioned under `/api/v1`.
- **Identity and authorization:** parent authentication; child profiles are resources owned by a parent, not independent logins in the MVP.
- **Profile service:** age band, language, interests, and parent-configured preferences.
- **Learning service:** content catalog, quizzes, games, offline activities, and topic journeys.
- **AI gateway:** provider-neutral interfaces for text generation and (later) speech/image services. Keep provider keys on the server.
- **Wellbeing service:** server-tracked sessions, configured limits, break prompts, and parent-visible activity summaries.
- **Persistence:** MySQL with migrations. Store timestamps in UTC.
- **Operations:** structured logs without child story transcripts, voice recordings, or unnecessary personal data; health endpoint and error monitoring.

### Recommended project structure

```text
backend/
  app/
    api/v1/
    core/              # settings, auth, logging
    models/            # ORM models
    schemas/           # request/response schemas
    services/          # learning, AI, wellbeing, parent
    providers/         # LLM/TTS adapters
    db/                # connection and migrations
    main.py
  tests/
frontend/
  index.html
  styles.css
  script.js
```

This is a target structure, not a requirement to reorganize the prototype immediately. Add it incrementally when backend functionality grows.

## 3. Data and database design

Use **MySQL 8** with InnoDB, foreign keys, `utf8mb4`, parameterized queries, and a migration tool such as Alembic if SQLAlchemy is adopted. Use UUIDs for public identifiers and avoid exposing sequential database IDs in API URLs. The outline below describes logical fields; exact SQL types should be finalized alongside implementation.

### Entity relationships

```text
Parent 1 --- N ChildProfile
Parent 1 --- N ParentSettings
ChildProfile 1 --- N LearningSession
ChildProfile 1 --- N ActivityCompletion
LearningActivity 1 --- N ActivityCompletion
LearningActivity 1 --- N GeneratedContent
LearningSession 1 --- N ActivityCompletion
```

### Core tables

| Table | Important fields | Purpose |
|---|---|---|
| `parents` | `id`, `email` (unique), `password_hash`, `created_at`, `updated_at`, `status` | Parent account and authentication. Never store plaintext passwords. |
| `child_profiles` | `id`, `parent_id`, `display_name`, `birth_year` or age band, `age_band`, `preferred_language`, `interests_json`, `created_at`, `updated_at`, `is_active` | Minimal child profile. Prefer age band over full birth date unless a precise date is truly needed. |
| `parent_settings` | `id`, `parent_id`, `child_id` (nullable for account defaults), `daily_limit_minutes`, `session_limit_minutes`, `allowed_content_json`, `voice_enabled`, `updated_at` | Parent-controlled limits and permissions. |
| `learning_activities` | `id`, `activity_type`, `title`, `topic`, `age_min`, `age_max`, `language`, `content_json`, `source`, `published_at`, `is_active` | Curated or generated stories, games, quizzes, and offline challenges. |
| `learning_sessions` | `id`, `child_id`, `started_at`, `ended_at`, `duration_seconds`, `end_reason`, `created_at` | Session accounting for wellbeing and reports. |
| `activity_completions` | `id`, `child_id`, `session_id`, `activity_id`, `activity_type`, `score` (nullable), `result_json` (minimal), `completed_at` | Activity-level progress without retaining unnecessary raw answers. |
| `generated_content` | `id`, `child_id`, `session_id`, `content_type`, `topic`, `language`, `age_band`, `content_json`, `provider`, `safety_status`, `created_at`, `expires_at` | Optional generated output. Define retention and deletion behavior before enabling production generation. |
| `consent_records` | `id`, `parent_id`, `child_id`, `purpose`, `policy_version`, `granted_at`, `revoked_at` | Auditable parent consent for optional capabilities. |

### Data rules

- Use foreign keys with intentional deletion behavior. Deleting a parent should delete or irreversibly anonymize the parent's child profiles and associated records according to the retention policy.
- Index `child_profiles.parent_id`, `learning_sessions(child_id, started_at)`, `activity_completions(child_id, completed_at)`, and `learning_activities(activity_type, topic, is_active)`.
- Validate every child ID against the authenticated parent on every parent-scoped operation.
- Keep analytics aggregated where possible. Do not store raw microphone audio or camera images in the MVP.
- Set explicit retention periods for generated text and activity records; provide parent-requested export/deletion paths before a public launch.
- Treat child names, age information, interests, activity history, voice, and images as sensitive data. Minimize collection and access.

## 4. API outline

All endpoints use JSON, return consistent validation/error responses, and require HTTPS outside local development. Authenticated endpoints require a parent session/token. Add rate limits to authentication and generation routes.

### Account and profiles

| Method and path | Purpose |
|---|---|
| `POST /api/v1/auth/register` | Create parent account; validate consent and password requirements. |
| `POST /api/v1/auth/login` | Authenticate parent. Prefer secure, HttpOnly, SameSite cookies for a browser client. |
| `POST /api/v1/auth/logout` | Revoke/clear the parent session. |
| `GET /api/v1/children` | List profiles belonging to the authenticated parent. |
| `POST /api/v1/children` | Create a child profile with minimal age and preference data. |
| `GET /api/v1/children/{child_id}` | Read an owned profile. |
| `PATCH /api/v1/children/{child_id}` | Update profile preferences. |
| `DELETE /api/v1/children/{child_id}` | Delete profile and apply retention/deletion policy. |

### Learning and AI

| Method and path | Purpose |
|---|---|
| `GET /api/v1/activities` | Browse age-, language-, and topic-appropriate activities. |
| `GET /api/v1/activities/{activity_id}` | Retrieve a published activity. |
| `POST /api/v1/content/generate` | Generate a story, quiz, or offline challenge using validated age band, topic, and language. |
| `POST /api/v1/buddy/turns` | Submit a child question and receive one age-appropriate response; no open-ended session persistence by default. |
| `POST /api/v1/games/{game_id}/attempts` | Submit a game attempt and return feedback/adaptive next difficulty. |
| `POST /api/v1/activities/{activity_id}/complete` | Record completion and minimal progress. |

### Wellbeing and parent dashboard

| Method and path | Purpose |
|---|---|
| `POST /api/v1/sessions` | Start an app session for a child profile. |
| `POST /api/v1/sessions/{session_id}/end` | End a session and return remaining-time/break guidance. |
| `GET /api/v1/parent/children/{child_id}/summary` | Return an activity and learning summary over a date range. |
| `GET /api/v1/parent/children/{child_id}/settings` | Read parent controls. |
| `PATCH /api/v1/parent/children/{child_id}/settings` | Update limits, content permissions, and voice settings. |

### API conventions

- Validate IDs, enums, maximum text lengths, age bands, languages, and content types at the API boundary.
- Use a stable error shape, for example `{"error":{"code":"validation_error","message":"...","request_id":"..."}}`.
- Never trust a client-supplied parent or child relationship, age eligibility, session duration, or permission.
- Return only fields needed by the screen. Avoid including internal provider prompts or safety metadata in child-facing responses.
- Use idempotency keys for operations where retries could create duplicate completions or sessions.

## 5. AI, voice, vision, and personalization

### Generative AI

For the first release, curated templates provide predictable behavior and work without external AI credentials. Add an LLM through a server-side provider adapter once safety, privacy, cost, and fallback behavior are tested.

Generation flow:

1. Authenticate the parent-owned child profile and load permitted age/language preferences.
2. Validate topic and input length; do not send account identifiers or unnecessary profile details to a provider.
3. Construct a constrained prompt with age band, length limits, educational objective, and disallowed content.
4. Request structured output (title, body, learning point, quiz, offline suggestion).
5. Validate structure and length; run safety checks before showing output.
6. If generation fails or output is unsafe/invalid, show a clear retry message or curated activity—not a success-shaped empty response.
7. Store only what is needed and apply the configured retention policy.

Use a provider interface so models can be changed without coupling product logic to one vendor. Keep model names, costs, and quality evaluations in configuration and operational documentation, not child-facing promises.

### Voice

- MVP: browser speech synthesis for narration, activated by a child or parent.
- Later: speech recognition for a single question at a time, with visible microphone state and explicit permission.
- Prefer on-device/browser processing where it meets quality needs. If a cloud provider is used, disclose the data flow to parents and avoid retaining recordings.
- Provide text input and captions as alternatives; voice must not be required to use core features.

### Computer vision

Defer computer vision in the MVP. For a later camera activity:

- Require parent enablement and a clear, one-time camera action for a specific activity.
- Process locally where practical; do not perform face recognition or identity inference.
- Avoid uploading images by default. If server processing is necessary, obtain appropriate consent, strip metadata, set short retention, and give the parent deletion controls.
- Evaluate only task-relevant objects (for example, shapes), and provide a non-camera alternative.

### Recommendation and adaptive learning

Start with transparent rules, not a trained recommender: age band, chosen interests, activity type, and recent completion can select the next activity. Make recommendations explainable and parent-adjustable. Avoid optimizing for session length, streak pressure, or compulsive return behavior.

## 6. Module scope and integration

| Module | MVP implementation | Connected outcome |
|---|---|---|
| Smart Storyteller | Curated/template stories, read-aloud, short quiz | Topic and quiz completion inform a related game or activity. |
| Play & Learn | Five small, deterministic games across numbers, letters, shapes/colors, memory, and animal identification | Record completion and a simple result; adjust difficulty with transparent rules. |
| Talking Buddy | Bounded question-and-answer experience; curated responses first, optional guarded LLM later | Can ask a follow-up quiz question or suggest a related story. |
| Screen-to-Real-World | Curated offline challenges, with optional generated suggestions | A completed screen activity ends with an offline challenge and break prompt. |
| Parent Dashboard | Child profile, limits, recent activity, simple strengths/interests summary | Parent settings govern module permissions and session behavior. |

Shared journey example: a child reads a space story, answers a short quiz, plays a planet-matching game, receives a drawing challenge, and then sees a break prompt. The parent sees the activities and topic learned, not a misleading diagnosis or unvalidated AI assessment.

## 7. Digital wellbeing behavior

- Parent-configured daily and per-session limits are enforced by the backend and reflected in the interface.
- Show remaining time and give a gentle warning near the configured limit.
- At the limit, stop offering new in-app activities and present a positive offline next step. Do not use punitive language.
- Do not add infinite scroll, autoplay, loot mechanics, manipulative streaks, or notifications designed to increase usage.
- Be honest about limitations: a web app cannot reliably enforce device-wide screen time or prevent a child from switching applications.
- Include a parent pause/override flow and record the reason when a parent changes a limit.

## 8. Security, child safety, and privacy baseline

- Parent-only account creation and parent-scoped child profiles.
- Secure password hashing, session expiry/revocation, CSRF protection when cookie auth is used, and rate limiting.
- Authorization checks on every child-specific route; test cross-parent access denial.
- Input validation, output encoding, dependency updates, secret management, and HTTPS.
- No public child profiles, direct messaging, ads, public sharing, or user-generated image uploads in the MVP.
- AI output is not trusted by default. Validate, moderate, and provide a curated fallback.
- Provide parent-facing privacy information, consent, data export/deletion, and retention controls before public release.
- Conduct child-safety, accessibility, and privacy reviews before deployment. Consult applicable legal requirements for the launch jurisdiction; this blueprint is not legal advice.

## 9. Development sequence

### Phase 0 — Product and safety foundation

- Confirm target age, language scope, deployment jurisdiction, parent consent flow, and retention policy.
- Define acceptance criteria for session limits and account deletion.
- Keep the existing prototype running while agreeing the MVP scope.

### Phase 1 — Foundation

- Establish backend settings, database connection, migrations, typed schemas, and test setup.
- Implement parent registration/login and child profile CRUD.
- Add authorization tests, including cross-parent access attempts.
- Create the initial parent and child navigation/experience.

### Phase 2 — Learning journey

- Add activity catalog and story/poem generation endpoint using curated templates.
- Add narration, quiz completion, and learning activity records.
- Implement the five small games and offline challenge flow.
- Connect topics across story, quiz, game, and offline challenge.

### Phase 3 — Wellbeing and parent dashboard

- Implement session tracking, server-validated limits, break prompts, and parent settings.
- Build daily/weekly summaries from recorded activities.
- Add profile deletion and data export/deletion workflow.

### Phase 4 — Guarded AI and voice

- Add provider-neutral LLM integration behind a feature flag.
- Test safety, age appropriateness, invalid output, provider outage, rate limits, and cost controls.
- Add bounded speech input only after consent, privacy, and browser support behavior are verified.

### Phase 5 — Vision, deployment, and evaluation

- Reassess camera use against privacy and learning value before implementation.
- Add deployment automation, HTTPS, backups, monitoring, and recovery procedures.
- Run usability testing with parent oversight, accessibility testing, security review, and privacy review.
- Measure learning-task completion and successful breaks, not time spent in the app.

## 10. MVP acceptance checklist

- [ ] Parent can register, log in, log out, and manage a child profile.
- [ ] Parent can set and change a child session limit.
- [ ] Child can complete a story, quiz, at least five mini-games, and an offline challenge.
- [ ] The chosen topic carries through to at least one related activity.
- [ ] Session end/limit produces a clear, encouraging break experience.
- [ ] Parent summary reflects stored activity accurately.
- [ ] Unauthorized cross-parent profile access is rejected and covered by tests.
- [ ] No raw audio or camera image is stored in the MVP.
- [ ] AI/provider failures are visible and safely fall back to curated content.
- [ ] Parent can request deletion of a child profile and its associated data.
- [ ] The README describes actual implemented features separately from planned features.

## 11. Immediate next engineering steps

1. Treat the current story UI and FastAPI templates as a prototype, not a completed AI system.
2. Decide the MVP database/authentication approach and parent consent requirements.
3. Add backend tests and typed request/response models before expanding the API.
4. Implement parent-owned child profiles and persistence.
5. Build the first connected journey (story → quiz → game → offline challenge → break) end to end.
6. Add parent reporting and session controls before integrating external AI services.
