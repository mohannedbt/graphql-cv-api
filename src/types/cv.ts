import { Cv as PrismaCv } from '@prisma/client';

export type Cv = PrismaCv & {
  skills: Skill[];
  owner: User;
};

import type { Skill } from './skill';
import type { User } from './user';
