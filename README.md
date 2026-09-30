# Employee Creator

A full-stack app for managing employees and departments: a Spring Boot REST API backed by MySQL, with a React frontend.

## Architecture

- **Backend** (repo root): Spring Boot 4.1.1 / Java 17, package-by-feature under `src/main/java/com/jason/employee_creator/` (`employee/`, `department/`, `common/` for shared exceptions and error handling, `config/` for CORS and ModelMapper setup). Persistence via Spring Data JPA/Hibernate against MySQL (H2 in-memory for tests). REST endpoints are exposed at `/api/employees` and `/api/departments`.
- **Frontend** (`employee-creator-frontend/`): React 19 + TypeScript, built with Vite. Server state is managed with React Query, forms with react-hook-form + Zod, styling with CSS Modules/SCSS.

## Prerequisites

- Java 17
- Node.js (for the frontend)
- A running MySQL instance (or adjust `spring.datasource.url` in `src/main/resources/application.properties` to point at your own)

## Running the backend

```bash
./mvnw spring-boot:run
```

Required environment variable:

- `DB_USERNAME` — MySQL username (the schema `employee_creator` must already exist).

**Note:** `src/main/resources/application.properties` currently has the database password hardcoded rather than read from an environment variable. Before using this against any real database, replace it with your own credential and externalize it (e.g. a `DB_PASSWORD` environment variable) rather than committing it to source control.

Tests run with:

```bash
./mvnw test
```

## Running the frontend

```bash
cd employee-creator-frontend
npm install
npm run dev
```

Configure the API base URL in `employee-creator-frontend/.env`:

```
VITE_API_URL=http://localhost:8080/api
```

Other useful scripts (run from `employee-creator-frontend/`):

```bash
npm run build   # type-check and build for production
npm run lint    # run ESLint
```
