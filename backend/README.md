# Querify Backend Service

**Framework:** Spring Boot 3.3.4  
**Java Version:** Java 17 / 21 LTS (or Java 27)  
**Build Tool:** Apache Maven 3.9+  
**Port:** `8080`

---

## 1. Quick Start

Run the automated tests using the included Windows Maven wrapper:
```powershell
.\mvnw.cmd test
```

Start the Spring Boot backend server:
```powershell
.\mvnw.cmd spring-boot:run
```

Or pass custom environment variables:
```powershell
$env:DB_PASSWORD="your_password"
$env:AI_MODE="demo"
.\mvnw.cmd spring-boot:run
```

---

## 2. Configuration Properties

All properties are managed in `src/main/resources/application.properties` and can be overridden via environment variables:

| Property | Default Value | Environment Variable | Description |
| :--- | :--- | :--- | :--- |
| `server.port` | `8080` | `PORT` | HTTP port |
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/querify_db` | `DB_URL` | MySQL connection string |
| `spring.datasource.username` | `root` | `DB_USERNAME` | MySQL user |
| `spring.datasource.password` | `""` | `DB_PASSWORD` | MySQL password |
| `ai.mode` | `demo` | `AI_MODE` | `demo` (offline) or `live` |
| `ai.provider` | `gemini` | `AI_PROVIDER` | AI provider identifier |
| `ai.model` | `gemini-1.5-flash` | `AI_MODEL` | Gemini model name |
| `ai.apiKey` | `""` | `AI_API_KEY` | Secret API key |
| `querify.query.max-limit` | `100` | `QUERIFY_MAX_LIMIT` | Max row limit for SQL |
| `querify.query.timeout-seconds` | `5` | `QUERIFY_TIMEOUT_SECONDS` | Query execution timeout |

---

## 3. Automated Test Suite

The backend contains 23 unit and integration tests executing against an in-memory H2 database with MySQL compatibility mode:
- **`SqlValidatorTest`**: Verifies read-only SELECT constraints, table whitelist, and rejection of mutating operations.
- **`ClarificationEngineTest`**: Tests ambiguity recognition and multi-turn state resolution.
- **`DemoModeAiProviderTest`**: Tests deterministic SQL generation for 30+ domain questions.
- **`QuerifyIntegrationTest`**: Full end-to-end integration tests using MockMvc.
