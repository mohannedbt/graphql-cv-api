import type { Skill as PrismaSkill } from '@prisma/client';

export type Skill = PrismaSkill & {
  cvs?: Cv[];
};

import type { Cv } from './cv.ts';
