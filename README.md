# ReadyOps

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose plugin)
- Node.js 18+

## Setup

### 1. Configure environment
```bash
cp .env.example .env
# Edit .env and set OP_API_KEY to your OpenProject personal access token
```

### 2. Start the database
```bash
npm run db:up
```
This starts a PostgreSQL 16 container, automatically applies the schema, and seeds it with sample data. Data persists in a named Docker volume across restarts.

### 3. Install dependencies
```bash
npm install
```

### 4. Start the server
```bash
npm start
# or for auto-restart on file changes:
npm run dev
```

### 5. Open the app
Visit **http://localhost:3000**

---

## Database commands

| Command | Description |
|---------|-------------|
| `npm run db:up` | Start the DB container (creates + seeds on first run) |
| `npm run db:down` | Stop the DB container (data is preserved) |
| `npm run db:reset` | Wipe all data and reseed from scratch |
| `npm run db:logs` | Stream Postgres logs |

---

## OpenProject integration

When the app is running on the internal network where OpenProject is reachable:
- The **Create Request** form will show an **OpenProject Project** dropdown
- On the **Execution** stage, click **↻ Refresh** to pull live work packages from the linked project

Status mapping is configured via `OP_STATUS_MAP` in `.env`.
