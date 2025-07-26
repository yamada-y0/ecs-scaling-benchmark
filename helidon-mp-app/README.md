# Helidon MP Application

A Helidon MicroProfile application that provides hash generation services using PBKDF2WithHmacSHA256 algorithm with PostgreSQL database integration.

## Features

- **Hash Generation API**: Creates secure password hashes using PBKDF2WithHmacSHA256
- **Database Integration**: Stores hash history in PostgreSQL database
- **Clean Architecture**: Implemented with domain-driven design patterns
- **Validation**: Request validation with Bean Validation
- **Logging**: Method execution logging with interceptors
- **Health Check**: Built-in health check endpoint

## Architecture

```
src/main/java/com/github/yamaday0/
├── application/           # Application layer (Use cases, Interfaces)
├── domain/model/         # Domain models
├── infrastructure/       # Infrastructure layer (JPA entities, Repositories)
├── web/                  # Web layer (Controllers, DTOs, Interceptors)
└── config/              # Configuration (Logger producer)
```

## Prerequisites

- Java 21+
- Maven 3.8+
- Docker (for PostgreSQL)

## Setup and Running

### 1. Start PostgreSQL Database

```bash
# Start PostgreSQL container
docker run --name postgres-local \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps | grep postgres
```

### 2. Build and Run Application

```bash
helidon dev
```

The application will start on `http://localhost:8080`

## API Endpoints

### Hash Generation

**POST** `/hash`

Creates a secure hash using PBKDF2WithHmacSHA256 algorithm.

**Request:**
```json
{
  "input": "your-text-to-hash",
  "iterations": 1000
}
```

**Response:**
```json
{
  "result": "base64-encoded-hash"
}
```

**Example:**
```bash
curl -X POST http://localhost:8080/hash \
  -H "Content-Type: application/json" \
  -d '{"input": "test", "iterations": 1000}'
```

### Health Check

**GET** `/health`

Returns the health status of the application.

**Response:**
```json
{
  "status": "UP",
  "checks": []
}
```

**Example:**
```bash
curl http://localhost:8080/health
```

## Database Configuration

The application connects to PostgreSQL with the following default configuration:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `postgres`
- **Username**: `postgres`
- **Password**: `postgres`

### Environment Variables

You can override database settings using environment variables:

```bash
export DB_HOST=your-db-host
export DB_PORT=5432
export DB_NAME=your-database
export DB_USERNAME=your-username
export DB_PASSWORD=your-password

java -jar target/helidon-mp-app.jar
```

### Database Schema

The application automatically creates the following tables:
- `hash_history` - Stores hash generation history

## Testing

### Unit Tests

```bash
mvn test
```

### Manual Testing

```bash
# Test hash generation
curl -X POST http://localhost:8080/hash \
  -H "Content-Type: application/json" \
  -d '{"input": "hello", "iterations": 2000}'

# Verify data in database
docker exec postgres-local psql -U postgres -d postgres -c "SELECT * FROM hash_history;"

# Test health endpoint
curl http://localhost:8080/health
```

## Database Management

### Connect to PostgreSQL

```bash
# Interactive connection
docker exec -it postgres-local psql -U postgres -d postgres

# Non-interactive queries
docker exec postgres-local psql -U postgres -d postgres -c "SELECT COUNT(*) FROM hash_history;"
```

### Common Commands

```sql
-- List all tables
\dt

-- View hash history
SELECT * FROM hash_history;

-- Count records
SELECT COUNT(*) FROM hash_history;

-- Exit psql
\q
```

### Stop/Start Database

```bash
# Stop container
docker stop postgres-local

# Start container
docker start postgres-local

# Remove container
docker rm postgres-local
```

## Configuration Files

- `src/main/resources/META-INF/microprofile-config.properties` - Application configuration
- `src/main/resources/META-INF/persistence.xml` - JPA configuration
- `src/main/resources/logging.properties` - Logging configuration

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL container is running: `docker ps`
2. Check database logs: `docker logs postgres-local`
3. Verify connection parameters in `microprofile-config.properties`

### Application Startup Issues

1. Check Java version: `java -version` (requires Java 21+)
2. Verify Maven build: `mvn clean compile`
3. Check application logs for specific error messages

### Performance Tuning

- Increase hash iterations for stronger security (but slower performance)
- Adjust database connection pool settings in configuration
- Monitor JVM memory usage for large-scale deployments

## Building the Docker Image

```bash
docker build -t helidon-mp-app .
```

## Running the Docker Image

```bash
docker run --rm -p 8080:8080 helidon-mp-app:latest
```

## Building a Native Image

The generation of native binaries requires an installation of GraalVM 22.1.0+.

```bash
mvn -Pnative-image install -DskipTests
```

## Building a Custom Runtime Image

```bash
mvn package -Pjlink-image
./target/helidon-mp-app-jri/bin/start
```
