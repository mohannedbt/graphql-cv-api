import type { Context } from "../server.js"

export const cvResolvers = {

  // Handles Query.cv and Query.cvs
  Query: {
    // When client asks: cv(id: "1") { ... }
    // args = { id: "1" }
    // ctx.db.cvs = the array from db.ts
    cv: async (_: unknown, args: { id: string }, ctx: Context) => {
      const cv = await ctx.prisma.cv.findUnique({
        where: { id: args.id },
        include: { skills: true, owner: true }
      })
      return cv
    },
    cvs: async (_: unknown, __: unknown, ctx: Context) => {
      const cvs = await ctx.prisma.cv.findMany({
        include: { skills: true, owner: true }
      })
      return cvs ?? [];
    }
  },

  // Handles the skillIds field INSIDE a Cv
  Cv: {
    // When client asks: cv(id:"1") { skillIds }
    // GraphQL first resolves the Cv (parent = that cv object)
    // then calls THIS to get its skillIds
    skills: (parent: { skills : string[] }, _: unknown, ctx: Context) => {
      return parent.skills;
    },
    owner: async (parent: { owner: { id: string } }, _: unknown, ctx: Context) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: parent.owner.id },
        include: { cvs: true }
      });
      return user;
    }
  }
};