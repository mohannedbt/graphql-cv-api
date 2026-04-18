import type { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

export async function validateUserExists(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new GraphQLError(`User with id ${userId} does not exist`, {
    extensions: { code: 'BAD_USER_INPUT' }
  });
  return user;
}

export async function validateSkillsExist(prisma: PrismaClient, skillIds: string[]) {
  const skills = await prisma.skill.findMany({ where: { id: { in: skillIds } } });
  if (skills.length !== skillIds.length) throw new GraphQLError('One or more skills do not exist', {
    extensions: { code: 'BAD_USER_INPUT' }
  });
  return skills;
}
