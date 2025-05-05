
# 📝 Task List: Drug Indication Mapping Microservice (NestJS + Turbo + Puppeteer)

## 🚀 Objective
We are building a microservice to:
- Extract drug indications from DailyMed using **Puppeteer**
- Map them to ICD-10 codes using AI/LLM (OpenAI API)
- Expose a **NestJS** REST API (following hexagonal architecture)
- Secure with JWT Auth + Role-Based Access
- Containerized with Docker
- Managed with **TurboRepo** for monorepo handling

---

## 🏗️ **Project Setup Tasks**

### 1️⃣ **Monorepo Setup (TurboRepo)**
- [x] Initialize TurboRepo monorepo
- [x] Create `apps/api` folder for NestJS API
- [x] Create `packages/scraper` for Puppeteer scraper module
- [x] Create `packages/ai-mapper` for AI/LLM mapping service
- [x] Configure shared ESLint/Prettier configs in `/packages/config`
- [x] Add basic `tsconfig.base.json` for workspace inheritance
- [x] Setup common build/serve/test pipelines in `turbo.json`

✅ Output: working monorepo structure with build pipelines

---

## ⚙️ **API Development Tasks (NestJS)**

### 2️⃣ **NestJS API Scaffolding**
- [x] Scaffold NestJS app in `apps/api`
- [x] Install modules: `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`, `class-validator`, `swagger-ui-express`
- [x] Setup Swagger at `/api/docs`
- [x] Implement global validation pipe

✅ Output: bootstrapped API with validation & docs

### 3️⃣ **Domain Layer**
- [x] Define `Drug` entity (id, name, labelUrl)
- [x] Define `Indication` entity (id, description, icd10Code, drugId, sourceText, mappingConfidence)
- [x] Define `User` entity (id, username, passwordHash, role)

✅ Output: all entities + validation decorators

### 4️⃣ **Application Services**
- [x] Service: `DrugService` for CRUD on drugs
- [x] Service: `IndicationService` for CRUD on indications
- [ ] Service: `ScraperService` (inject scraper package)
- [ ] Service: `AiMapperService` (inject AI mapper package)

✅ Output: core application services wired

### 5️⃣ **Controllers (REST Endpoints)**
- [ ] `/api/drugs` → GET, POST, PUT, DELETE
- [ ] `/api/drugs/:id/indications` → GET, POST
- [ ] `/api/indications/:id` → GET, PUT, DELETE
- [ ] `/api/programs/:programId` → GET (structured JSON)
- [ ] `/api/auth/login` → POST
- [ ] `/api/auth/register` → POST

✅ Output: all endpoints implemented

### 6️⃣ **Auth & Security**
- [x] Implement JWT auth guard
- [x] Implement roles guard
- [x] Hash passwords with bcrypt
- [x] Secure Swagger with auth token support
- [x] Add CORS + rate limiting

✅ Output: secure API

---

## 🧪 **Testing Tasks**

### 7️⃣ **Unit Tests**
- [ ] Write unit tests for:
  - ScraperService (mock Puppeteer)
  - AiMapperService (mock OpenAI API)
  - DrugService
  - IndicationService
  - AuthService

✅ Output: >80% unit test coverage

### 8️⃣ **Integration Tests**
- [ ] Use `supertest` to test API endpoints
- [ ] Test full flow: scrape → map → save → query

✅ Output: integration coverage

---

## 🕸️ **Scraper Package (Puppeteer)**

### 9️⃣ **Scraper Implementation**
- [ ] Write `extractIndicationsFromDailyMed(url: string): string[]`
- [ ] Use Puppeteer to navigate, wait for selector, scrape content
- [ ] Target `"Indications and Usage"` section
- [ ] Handle missing/alternate labels
- [ ] Export as ES module for API consumption

✅ Output: tested, reusable scraper function

### 🔬 **Scraper Tests**
- [ ] Mock Puppeteer in unit tests
- [ ] Include fallback/alternate label formats in test fixtures

✅ Output: robust scraper test coverage

---

## 🤖 **AI Mapper Package (OpenAI API)**

### 10️⃣ **AI Mapper Implementation**
- [ ] Load ICD-10 code dataset (CSV or JSON)
- [ ] Write `mapToIcd10(indication: string): { code: string, confidence: number }`
- [ ] Build prompt: "Given this condition: [x], pick closest code from [icd10 codes]"
- [ ] Call OpenAI API with prompt
- [ ] Parse LLM response
- [ ] Implement fallback for unmapped

✅ Output: AI mapper with test cases

### 11️⃣ **AI Mapper Tests**
- [ ] Mock OpenAI API responses
- [ ] Test common synonyms (e.g. "hypertension" → "I10")
- [ ] Test unmappable conditions return null

✅ Output: AI mapper coverage

---

## 🐳 **Docker & Deployment Tasks**

### 12️⃣ **Dockerization**
- [ ] Write `Dockerfile` for API app
- [ ] Write `docker-compose.yml` (API + Postgres + optional pgAdmin)
- [ ] Define `.env` for config
- [ ] Ensure API runs & connects to DB with `docker-compose up`

✅ Output: full Dockerized app

---

## 📖 **Documentation Tasks**

### 13️⃣ **README**
- [ ] Include project overview
- [ ] Add architecture mermaid diagrams
- [ ] Add setup/run/test instructions
- [ ] Add API docs sample output
- [ ] Describe scalability & gaps

✅ Output: complete README

### 14️⃣ **API Docs**
- [ ] Document all endpoints in Swagger
- [ ] Include example requests & responses
- [ ] Explain auth/roles in docs

✅ Output: API fully documented

---

## 🎥 **Demo & Presentation Tasks**

### 15️⃣ **Demo Preparation**
- [ ] Prepare Postman collection (or Swagger UI demo)
- [ ] Script scraping → mapping → query flow
- [ ] Prepare Zoom slides explaining:
    - Problem → Solution
    - Architecture
    - Tradeoffs/gaps
    - Team leadership approach

✅ Output: ready to present & defend

---

## 📅 **Suggested Timeline (Optional)**

| Week | Focus                                    |
|------|-----------------------------------------|
| 1    | Monorepo + API scaffold + Scraper       |
| 2    | AI mapper + Services + Controllers      |
| 3    | Auth + Tests + Docker                   |
| 4    | Docs + Demo prep + Polish               |

---

# ✅ Let's execute! 🚀
