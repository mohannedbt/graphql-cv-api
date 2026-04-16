
import type { Context } from "../server.js";
import { GraphQLError } from "graphql";

import type { AddCvArgs, UpdateCvArgs, DeleteCvArgs } from "../types/cvMutationArgs.js";

export const mutationResolvers = {
  Mutation: {
    // Add a new CV after validating user and skills
    addCv: (_: unknown, args: AddCvArgs, ctx: Context) => {
      const { input } = args;
      // Check for duplicate CV id
      if (ctx.db.cvs.some(cv => cv.id === input.id)) {
        throw new GraphQLError(`CV with id ${input.id} already exists`);
      }
      // Validate owner exists
      if (!ctx.db.users.some(u => u.id === input.owner)) {
        throw new GraphQLError(`Owner with id ${input.owner} does not exist`);
      }
      // Validate all skills exist
      for (const skillId of input.skillIds) {
        if (!ctx.db.skills.some(s => s.id === skillId)) {
          throw new GraphQLError(`Skill with id ${skillId} does not exist`);
        }
      }
      // Add CV to db
      ctx.db.cvs.push({ ...input });
      // Return the newly added CV object
      return ctx.db.cvs.find(cv => cv.id === input.id);
    },

    // Update an existing CV by id
    updateCv: (_: unknown, args: UpdateCvArgs, ctx: Context) => {
      const { input } = args;
      const cvToUpdate = ctx.db.cvs.find(cv => cv.id === input.id);
      if (!cvToUpdate) {
        throw new GraphQLError(`CV with id ${input.id} not found`);
      }
      // If updating owner, validate user exists
      if (input.owner && !ctx.db.users.some(u => u.id === input.owner)) {
        throw new GraphQLError(`Owner with id ${input.owner} does not exist`);
      }
      // If updating skills, validate all exist
      if (input.skillIds) {
        for (const skillId of input.skillIds) {
          if (!ctx.db.skills.some(s => s.id === skillId)) {
            throw new GraphQLError(`Skill with id ${skillId} does not exist`);
          }
        }
      }
      // Update fields
      Object.assign(cvToUpdate, input);
      return cvToUpdate;
    },

    // Delete a CV by id
    deleteCv: (_: unknown, args: DeleteCvArgs, ctx: Context) => {
      const { id } = args;
      const cvIndex = ctx.db.cvs.findIndex(cv => cv.id === id);
      if (cvIndex === -1) {
        throw new GraphQLError(`CV with id ${id} not found`);
      }
      ctx.db.cvs.splice(cvIndex, 1);
      // Return true for success
      return true;
    }
  }
};
