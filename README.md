# GraphQL CV Project — Run Guide

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Step-by-Step Setup](#step-by-step-setup)
- [Testing Your Server](#testing-your-server)
- [Troubleshooting](#troubleshooting)
- [Recommended Stack](#recommended-stack)

---

## 🚀 Quick Start

```bash
npm install
npm start
```

Then open: **http://localhost:4000/graphql**

---

## 📖 Step-by-Step Setup

### Step 1: Install Dependencies

Install all required packages:

```bash
npm install
```

**Installed packages:**
- `graphql-yoga` — GraphQL server
- `graphql` — Core GraphQL library
- `graphql-subscriptions` — Real-time subscriptions
- `@graphql-tools/schema` — Schema builder
- `typescript` — Type safety
- `ts-node` — TypeScript executor

---

### Step 2: Start the Server

This project uses **TypeScript (ESM)**, so we use the standard ts-node loader:

```bash
npm start
```

**Expected Output:**
```
╔═══════════════════════════════════════════╗
║   GraphQL Server Running - Step 1 ✅      ║
╠═══════════════════════════════════════════╣
║   Server:   http://localhost:4000         ║
║   Yoga:     http://localhost:4000/graphql ║
║   Status:   Ready for queries             ║
╚═══════════════════════════════════════════╝
```

---

### Step 3: Open GraphQL IDE

Navigate to your browser:

```
http://localhost:4000/graphql
```

You will see the **GraphiQL interface** with:
- Query editor (left panel)
- Results viewer (right panel)
- Documentation explorer (right sidebar)

---

### Step 4: Test with a Query

Copy & paste into GraphiQL:

```graphql
query {
  hello
}
```

**Expected Response:**
```json
{
  "data": {
    "hello": "👋 GraphQL server is running! Step 1 ✅"
  }
}
```

✅ **If you see this, your server is working!**

---

## 🧪 Testing Your Server

### Query: Hello World
```graphql
query {
  hello
}
```

### Expected Files Structure
```
graphql-team-project/
├── db.ts                  ← Mock database (Users, CVs, Skills)
├── server.ts              ← GraphQL Yoga server
├── package.json           ← Dependencies
├── tsconfig.json          ← TypeScript config
├── node_modules/          ← (auto-generated)
└── README.md              ← This file
```

---

## ⚠️ Troubleshooting

### Error 1: "Unknown file extension '.ts'"

**Cause:** Incorrect TypeScript loader

**Fix:** Use the proper start script:
```bash
npm start
```

---

### Error 2: "Cannot find module 'graphql-yoga'"

**Cause:** Dependencies not installed

**Fix:**
```bash
npm install
```

---

### Error 3: "EADDRINUSE: address already in use :::4000"

**Cause:** Port 4000 is already in use (another server running)

**Fix:** Change the port in `server.ts`:
```typescript
const PORT = process.env.PORT || 4001; // Change to 4001
```

Then restart:
```bash
npm start
```

---

### Error 4: "Cannot find module './db'"

**Cause:** Wrong import path or missing db.ts file

**Fix:** Verify files exist:
```bash
ls -la db.ts server.ts
```

If missing, re-create them from the project setup.

---

### Error 5: "Schema must contain Query type"

**Cause:** TypeDefs are malformed

**Fix:** Ensure `server.ts` has a valid Query type:
```graphql
type Query {
  hello: String!
}
```

---

## 🛠️ Recommended Stack

| Component | Tool | Why |
|-----------|------|-----|
| **Server** | GraphQL Yoga | Fast, supports subscriptions, websockets |
| **Language** | TypeScript | Type-safe resolvers, better DX |
| **Runner** | ts-node | Native ESM support |
| **Schema** | SDL (string in server.ts) | Easy to version, readable |
| **Real-time** | graphql-subscriptions (PubSub) | Event-driven architecture |

---

## 📝 Development Workflow

### Start Development (With Watch Mode)
```bash
npm run dev
```

### Stop Server
```
Press Ctrl + C
```

### Check Server Status
```bash
curl http://localhost:4000/graphql
```

---



## ✅ Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm start`)
- [ ] GraphiQL opens at http://localhost:4000/graphql
- [ ] `hello` query returns success message
- [ ] No TypeScript errors in terminal


---

*Last Updated: April 12, 2026*