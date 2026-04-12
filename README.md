===============================
GRAPHQL CV PROJECT — RUN GUIDE
===============================

1) INSTALL DEPENDENCIES
-----------------------
Run this first:

npm install


2) START THE SERVER (RECOMMENDED)
---------------------------------
This project uses TypeScript (ESM), so the best runner is tsx.

Install tsx (first time only):

npm install -D tsx

Run the server:

npx tsx src/server.ts


3) OPEN GRAPHQL IN BROWSER
--------------------------
Once the server is running:

http://localhost:4000/graphql

You will see GraphiQL interface.


4) TEST QUERY
-------------
Run this inside GraphiQL:

query {
  _empty
}

Expected response:

{
  "data": {
    "_empty": "Server is running"
  }
}


===============================
COMMON ERRORS & FIXES
===============================

1) ERROR: Unknown file extension ".ts"
--------------------------------------
Cause:
- Using ts-node in ESM project

Fix:
Use tsx instead:

npx tsx src/server.ts


2) ERROR: Cannot find module 'tsx'
-----------------------------------
Fix:

npm install -D tsx


3) ERROR: ENOENT schema.graphql
-------------------------------
Cause:
- Wrong file path

Fix:
Make sure file exists:

src/schema.graphql

And load it like:

fs.readFileSync("./src/schema.graphql", "utf-8")


4) ERROR: Subscription defined but not in schema
------------------------------------------------
Fix:
Add this to schema.graphql:

type Subscription {
  cvUpdated: String
}


5) SERVER NOT STARTING / PORT ERROR
-----------------------------------
Fix:
Change port:

server.listen(4001)


===============================
RECOMMENDED STACK
===============================

- tsx (TypeScript runner)
- GraphQL Yoga (server)
- SDL schema (.graphql file)

===============================
WORKFLOW SUMMARY
===============================

npm install
npm install -D tsx
npx tsx src/server.ts
open http://localhost:4000/graphql
```