


import type { Context } from "../types/context.js";
import { GraphQLError } from "graphql";
import type { AddCvArgs, UpdateCvArgs, DeleteCvArgs } from "../types/cvMutationArgs.js";
import type { Cv } from "../types/cv.js";
import { validateUserExists, validateSkillsExist } from "../utils/validation.js";

/**
 * Logs GraphQL resolver events and errors.
 * @param message - The message to log
 * @param meta - Optional metadata
 */
function log(message: string, meta?: any) {
  if (meta) {
    console.log(`[mutation] ${message}`, meta);
  } else {
    console.log(`[mutation] ${message}`);
  }
}

export const mutationResolvers = {
  Mutation: {
    /**
     * Adds a new CV after validating user and skills.
     * Throws BAD_USER_INPUT if validation fails.
     */
    addCv: async (_: unknown, args: AddCvArgs, ctx: Context): Promise<Cv> => {
      const { input } = args;
      try {
        if (await ctx.prisma.cv.findUnique({ where: { id: input.id } })) {
          log('Attempt to add duplicate CV', { id: input.id });
          throw new GraphQLError(`CV with id ${input.id} already exists`, {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }
        await validateUserExists(ctx.prisma, input.owner);
        await validateSkillsExist(ctx.prisma, input.skillIds);
        const cv = await ctx.prisma.cv.create({
          data: {
            id: input.id,
            name: input.name,
            age: input.age,
            job: input.job,
            ownerId: input.owner,
            skills: {
              connect: input.skillIds.map((id: string) => ({ id }))
            }
          }
        });
        const cvWithRelations = await ctx.prisma.cv.findUnique({
          where: { id: cv.id },
          include: { skills: true, owner: true }
        });
        ctx.pubsub.publish("CV_UPDATED", {
          cv: cvWithRelations,
          operation: "ADD"
        });
        log('CV added', { id: input.id });
        return cvWithRelations as Cv;
      } catch (err: any) {
        log('Error adding CV', err);
        if (err instanceof GraphQLError) throw err;
        throw new GraphQLError('Unexpected error while adding CV', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    /**
     * Updates an existing CV by id. Throws NOT_FOUND or BAD_USER_INPUT.
     */
    updateCv: async (_: unknown, args: UpdateCvArgs, ctx: Context): Promise<Cv> => {
      const { input } = args;
      try {
        const cvToUpdate = await ctx.prisma.cv.findUnique({ where: { id: input.id } });
        if (!cvToUpdate) {
          log('CV not found for update', { id: input.id });
          throw new GraphQLError(`CV with id ${input.id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        if (input.owner) await validateUserExists(ctx.prisma, input.owner);
        if (input.skillIds) await validateSkillsExist(ctx.prisma, input.skillIds);
        const cv = await ctx.prisma.cv.update({
          where: { id: input.id },
          data: {
            ...(input.name !== undefined && { name: input.name }),
            ...(input.age !== undefined && { age: input.age }),
            ...(input.job !== undefined && { job: input.job }),
            ...(input.owner !== undefined && { ownerId: input.owner }),
            ...(input.skillIds !== undefined && {
              skills: { set: input.skillIds.map((id: string) => ({ id })) }
            })
          }
        });
        const cvWithRelations = await ctx.prisma.cv.findUnique({
          where: { id: cv.id },
          include: { skills: true, owner: true }
        });
        ctx.pubsub.publish("CV_UPDATED", {
          cv: cvWithRelations,
          operation: "UPDATE"
        });
        log('CV updated', { id: input.id });
        return cvWithRelations as Cv;
      } catch (err: any) {
        log('Error updating CV', err);
        if (err instanceof GraphQLError) throw err;
        throw new GraphQLError('Unexpected error while updating CV', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    /**
     * Deletes a CV by id. Throws NOT_FOUND if not found.
     */
    deleteCv: async (_: unknown, args: DeleteCvArgs, ctx: Context): Promise<boolean> => {
      const { id } = args;
      try {
        const cv = await ctx.prisma.cv.findUnique({ where: { id } });
        if (!cv) {
          log('CV not found for delete', { id });
          throw new GraphQLError(`CV with id ${id} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        await ctx.prisma.cv.delete({ where: { id } });
        ctx.pubsub.publish("CV_UPDATED", {
          cv: null,
          operation: "DELETE"
        });
        log('CV deleted', { id });
        return true;
      } catch (err: any) {
        log('Error deleting CV', err);
        if (err instanceof GraphQLError) throw err;
        throw new GraphQLError('Unexpected error while deleting CV', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }
};
