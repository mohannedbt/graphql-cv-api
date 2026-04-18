import type { PrismaClient } from '@prisma/client';
import type { PubSub } from 'graphql-yoga';
import type { Cv } from './cv.ts';

// Define your event channels and payloads
export type PubSubChannels = {
  CV_UPDATED: [{ cv: Cv; operation: string }];
};

export type Context = {
  prisma: PrismaClient;
  pubsub: PubSub<PubSubChannels>;
};