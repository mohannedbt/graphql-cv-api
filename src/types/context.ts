import type { PrismaClient } from '@prisma/client';
import type { PubSub } from 'graphql-subscriptions';

export type Context = {
  prisma: PrismaClient;
  pubsub: PubSub;
};
