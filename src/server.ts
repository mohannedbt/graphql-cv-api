import { createServer } from "node:http";
import { createYoga, createPubSub, createSchema } from "graphql-yoga";
// import { db } from "./db.js";
import fs from "fs";
import path from "path";
import { userResolvers } from "./resolvers/user.js";
import { cvResolvers } from "./resolvers/cv.js";
import { mutationResolvers } from "./resolvers/mutation.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db"
});

export const prisma = new PrismaClient({ adapter });

const pubsub = createPubSub();

export interface Context {
  prisma: typeof prisma;
  pubsub: typeof pubsub;
}

const typeDefs = fs.readFileSync(
  path.resolve(process.cwd(), "src/schema.graphql"),
  "utf-8"
);
const resolvers = {
  Query: {
    _empty: () => "Server is running", // add resolvers here
    ...userResolvers.Query,        // ← spreads your user/users queries in
    ...cvResolvers.Query           // ← spreads your cv queries in
  },
  User: userResolvers.User,        // ← adds User.cvs resolver
  Cv: cvResolvers.Cv,              // ← adds Cv skillIds resolver

  Subscription: {
    cvUpdated: {
      subscribe: (_: any, __: any, ctx: Context) =>
        ctx.pubsub.subscribe("CV_UPDATED")
    }
  },

  Mutation: {
    ...mutationResolvers.Mutation
  }
};

const schema = createSchema({
  typeDefs,
  resolvers
});

const yoga = createYoga<Context>({
  schema,
  context: () => ({
    prisma,
    pubsub
  })
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log("GraphQL server running: http://localhost:4000/graphql");
});