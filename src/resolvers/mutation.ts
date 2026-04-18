
import type { Context } from "../server.js";
import { GraphQLError } from "graphql";

import type { AddCvArgs, UpdateCvArgs, DeleteCvArgs } from "../types/cvMutationArgs.js";

export const mutationResolvers = {
  Mutation: {
    // Add a new CV after validating user and skills
    addCv: async (_: unknown, args: AddCvArgs, ctx: Context) => {
      const { input } = args;
      // Check for duplicate CV id
      if (await ctx.prisma.cv.findUnique({ where: { id: input.id } })) {
        throw new GraphQLError(`CV with id ${input.id} already exists`);
      }
      // Validate owner exists
      if (!await ctx.prisma.user.findUnique({ where: { id: input.owner } })) {
        throw new GraphQLError(`Owner with id ${input.owner} does not exist`);
      }
      // Validate all skills exist
      for (const skillId of input.skillIds) {
        if (!await ctx.prisma.skill.findUnique({ where: { id: skillId } })) {
          throw new GraphQLError(`Skill with id ${skillId} does not exist`);
        }
      }
      // Add CV to db
      // TODO: haffouz, mohanned, elyess help plz T-T
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
      // Publish CV update event
      const cvWithRelations = await ctx.prisma.cv.findUnique({
        where: { id: cv.id },
        include: { skills: true, owner: true }
      });
      ctx.pubsub.publish("CV_UPDATED", {
        cvUpdated: {
          cv: cvWithRelations,
          operation: "ADD"
        }
      });

      // Return the newly added CV object
      return cvWithRelations;
    },

    // Update an existing CV by id
    updateCv: async (_: unknown, args: UpdateCvArgs, ctx: Context) => {
      const { input } = args;
      const cvToUpdate = await ctx.prisma.cv.findUnique({ where: { id: input.id } });
      if (!cvToUpdate) {
        throw new GraphQLError(`CV with id ${input.id} not found`);
      }
      // If updating owner, validate user exists
      if (input.owner && !await ctx.prisma.user.findUnique({ where: { id: input.owner } })) {
        throw new GraphQLError(`Owner with id ${input.owner} does not exist`);
      }
      // If updating skills, validate all exist
      if (input.skillIds) {
        for (const skillId of input.skillIds) {
          if (!await ctx.prisma.skill.findUnique({ where: { id: skillId } })) {
            throw new GraphQLError(`Skill with id ${skillId} does not exist`);
          }
        }
      }
      // Update fields
      // TODO: haffouz, mohanned, elyess help plz T-T
      const cv = await ctx.prisma.cv.update({
        where: { id: input.id },
        data: {
        ...(input.name && { name: input.name }),
        ...(input.age && { age: input.age }),
        ...(input.job && { job: input.job }),
        ...(input.owner && { ownerId: input.owner }),
        ...(input.skillIds && {
          skills: { set: input.skillIds.map((id: string) => ({ id })) }
    })
  }
      });
      // Publish CV update event
      const cvWithRelations = await ctx.prisma.cv.findUnique({
        where: { id: cv.id },
        include: { skills: true, owner: true } 
      });
      ctx.pubsub.publish("CV_UPDATED", {
        cvUpdated: {
          cv: cvWithRelations,
          operation: "UPDATE"
        }
      });
      return cvWithRelations;
    },

    // Delete a CV by id
    deleteCv: async (_: unknown, args: DeleteCvArgs, ctx: Context) => {
      const { id } = args;
      
      const cv = await ctx.prisma.cv.findUnique({ where: { id } });
      if (!cv) {
        throw new GraphQLError(`CV with id ${id} not found`);
      }
      await ctx.prisma.cv.delete({ where: { id } });
      // Publish CV update event
      ctx.pubsub.publish("CV_UPDATED", {
        cvUpdated: {
          cv: null,
          operation: "DELETE"
        }
      });
      // Return true for success
      return true;
    }
  }
};
