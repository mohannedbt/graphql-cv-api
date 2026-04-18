import type { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser & {
  cvs?: Cv[];
};

import type { Cv } from './cv.ts';
