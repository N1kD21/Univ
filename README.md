# Docker Compose Setup

This repository contains a `docker-compose.yml` file to help set up and run a set of microservices that include a **NATS** message broker, a **Postgres** database, a **gateway**, an **event publisher**, a **Facebook collector**, and an **NGINX** reverse proxy.

## Services Overview

### 1. **binfmt**
- **Purpose**: Used for setting up multi-architecture builds (e.g., ARM and x86).
- **Image**: `tonistiigi/binfmt`
- **Command**: Installs all supported architectures.
- **Ports**: No exposed ports.
- **Volumes**: Mounts Docker socket for accessing Docker daemon.
- **Privileges**: Runs with elevated privileges (`privileged: true`).

### 2. **NATS**
- **Purpose**: Message broker for communication between services.
- **Image**: `nats:latest`
- **Ports**: 
  - `4222:4222` - NATS client connection.
  - `8222:8222` - HTTP monitoring port.
- **Command**: `-js` to enable JetStream support.
- **Volumes**: Persists NATS data in a Docker volume.
- **Networks**: Connected to `app-network`.

### 3. **Gateway**
- **Purpose**: A microservice that interacts with NATS and provides an API endpoint.
- **Build Context**: The `./gateway` directory contains the source code.
- **Environment Variables**: 
  - `NATS_SERVER`: Address of the NATS server.
- **Ports**: Exposes the service on port `3000`.
- **Dependencies**: Depends on the `nats` service.
- **Scale**: Scales to 3 replicas.
- **Networks**: Connected to `app-network`.

### 4. **Publisher**
- **Purpose**: A microservice that publishes events.
- **Image**: `andriiuni/events:latest`
- **Platform**: Linux ARM64 architecture.
- **Environment Variables**: 
  - `EVENT_ENDPOINT`: Endpoint for publishing events.
- **Dependencies**: Depends on the `gateway` service.
- **Networks**: Connected to `app-network`.

### 5. **Postgres**
- **Purpose**: A Postgres database for persisting application data.
- **Image**: `postgres:13`
- **Environment Variables**: 
  - `POSTGRES_USER`: Username for the Postgres database.
  - `POSTGRES_PASSWORD`: Password for the Postgres user.
  - `POSTGRES_DB`: Name of the database to create.
- **Ports**: 
  - `5433:5432` - Exposes Postgres on port `5433`.
- **Volumes**: Persists Postgres data in a Docker volume.
- **Networks**: Connected to `app-network`.

### 6. **FB-Collector**
- **Purpose**: A service for collecting data from Facebook.
- **Build Context**: The `./fb-collector` directory contains the source code.
- **Environment Variables**: 
  - `DATABASE_URL`: Connection URL to the Postgres database.
- **Ports**: Exposes the service on port `4000`.
- **Dependencies**: Depends on the `postgres` service.
- **Networks**: Connected to `app-network`.

### 7. **NGINX**
- **Purpose**: Reverse proxy that forwards requests to the gateway.
- **Image**: `nginx:latest`
- **Ports**: Exposes the service on port `8080`.
- **Volumes**: Custom `nginx.conf` for configuration.
- **Dependencies**: Depends on the `gateway` service.
- **Networks**: Connected to `app-network`.

## Setup and Usage

### 1. **Start the services**

To start all services, including the **gateway** with 3 replicas, use the following command:

```bash
docker-compose up --scale gateway=3 --build

# .env file for quick variable replacement

Just an example, of course, I’m not going to upload it to GitHub.