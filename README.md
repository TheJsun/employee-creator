# Employee Creator

A full-stack app for managing employees and departments: a Spring Boot REST API backed by MySQL, with a React frontend.

## Architecture

- **Backend** (repo root): Spring Boot 4.1.1 / Java 17, package-by-feature under `src/main/java/com/jason/employee_creator/` (`employee/`, `department/`, `common/` for shared exceptions and error handling, `config/` for security, CORS and ModelMapper setup, `user/` and `auth/` for authentication). Persistence via Spring Data JPA/Hibernate against MySQL (H2 in-memory for tests). REST endpoints are exposed at `/api/employees` and `/api/departments`.
- **Frontend** (`employee-creator-frontend/`): React 19 + TypeScript, built with Vite. Server state is managed with React Query, forms with react-hook-form + Zod, styling with CSS Modules/SCSS.

## Prerequisites

- Java 17
- Node.js (for the frontend)
- A running MySQL instance (or adjust `spring.datasource.url` in `src/main/resources/application.properties` to point at your own)

## Running the backend

```bash
./mvnw spring-boot:run
```

Required environment variables:

- `DB_USERNAME` — MySQL username (the schema `employee_creator` must already exist).
- `DB_PASSWORD` — MySQL password.

Neither is committed. Set them in your shell before starting the app:

```bash
export DB_USERNAME=root
export DB_PASSWORD=your-password
./mvnw spring-boot:run
```

Tests run with:

```bash
./mvnw test
```

## Authentication

Session-cookie authentication via Spring Security. Logging in returns a `JSESSIONID`
cookie that must be sent with every subsequent request; browsers only do this
cross-origin when the client sets `credentials: "include"` on its requests.

| Endpoint | Access |
| --- | --- |
| `POST /api/auth/login` | Public. Body `{ "email": "...", "password": "..." }`. Returns the current user; 401 on bad credentials. |
| `POST /api/auth/logout` | Invalidates the session. |
| `GET /api/me` | Any authenticated user. Returns `userId`, `email`, `role`, `employeeId`. |
| `GET /api/employees`, `GET /api/departments` (and `/{id}`) | Any authenticated user. |
| `POST`, `PUT`, `PATCH`, `DELETE` on employees and departments | `ADMIN` only. |

Roles are `ADMIN` and `EMPLOYEE`, enforced with `@PreAuthorize("hasRole('ADMIN')")`
on the service methods. Unauthenticated requests get 401, authenticated
non-admins get 403.

Deleting an employee also deletes their linked login account, since
`users.employee_id` is a foreign key. An admin cannot delete their own employee
record.

### Demo users

`DataSeeder` runs only under the `dev` profile (active by default locally) and
only when the `users` table is empty:

| Email | Password | Role |
| --- | --- | --- |
| `admin@demo.com` | `admin123` | `ADMIN` |
| `bob@demo.com` | `password123` | `EMPLOYEE` |
| `alice@demo.com` | `password123` | `EMPLOYEE` |

These are throwaway development credentials. Do not run the `dev` profile
against anything you care about.

### Known gap

CSRF protection is disabled (`SecurityConfig`). Combined with cookie sessions
and `allowCredentials(true)` CORS, that is a real exposure and is only
acceptable for local development. Before deploying, enable
`CookieCsrfTokenRepository.withHttpOnlyFalse()` and send the `XSRF-TOKEN`
cookie back as an `X-XSRF-TOKEN` header from the frontend.

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

## Continuous integration

[![CI](https://github.com/TheJsun/employee-creator/actions/workflows/ci.yml/badge.svg)](https://github.com/TheJsun/employee-creator/actions/workflows/ci.yml)

`.github/workflows/ci.yml` runs on every pull request into `main` and on pushes
to `main`. Two jobs run in parallel:

| Job | Runs |
| --- | --- |
| Backend (Java 17) | `./mvnw -B -ntp verify` — compiles, runs all tests, packages the jar |
| Frontend (Node 24) | `npm ci`, then `npm run lint` and `npm run build` (the build also type-checks via `tsc -b`) |

The backend job needs **no MySQL instance and no secrets**. `src/test/resources/application.properties`
shares its filename with the main config, so on the test classpath it replaces
it entirely — tests run against in-memory H2 with `ddl-auto=create-drop`. That
also means `spring.profiles.active=dev` is absent under test, so `DataSeeder`
does not run and cannot affect assertions.

To reproduce a CI failure locally, run the exact commands above. Note that CI
pins JDK 17 (matching `<java.version>` in `pom.xml`); if you have a newer JDK
installed locally, a green local build does not guarantee a green CI build.

Surefire reports are uploaded as a build artifact on every run, including
failures, so you can download them from the Actions tab instead of reproducing
locally.

### Not yet covered

- No frontend test runner (no Vitest/RTL, no test files) — the frontend job gates lint and types only
- No backend coverage reporting (no JaCoCo)
- No formatter check (no Prettier or `.editorconfig`)
- `strict` is not enabled in the TypeScript config, so `tsc -b` is a weaker gate than it appears
- No container build or deployment step
