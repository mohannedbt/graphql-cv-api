import { createServer } from "node:http";
import { createYoga, createPubSub, createSchema } from "graphql-yoga";
import { db } from "./db.js";
import fs from "fs";
import path from "path";
const pubsub = createPubSub();

export interface Context {
  db: typeof db;
  pubsub: typeof pubsub;
}

const typeDefs = fs.readFileSync(
  path.resolve(process.cwd(), "src/schema.graphql"),
  "utf-8"
);
const resolvers = {
  Query: {
    _empty: () => "Server is running"
  },

  Subscription: {
    cvUpdated: {
      subscribe: (_: any, __: any, ctx: Context) =>
        ctx.pubsub.subscribe("CV_UPDATED")
    }
  }
};

const schema = createSchema({
  typeDefs,
  resolvers
});

const yoga = createYoga<Context>({
  schema,
  context: () => ({
    db,
    pubsub
  })
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log("GraphQL server running: http://localhost:4000/graphql");
});