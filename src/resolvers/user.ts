import type { Context } from "../server.js"

export const userResolvers = {

  // Handles Query.user and Query.users
  Query: {
    
    // When client asks: user(id: "1") { ... }
    // args = { id: "1" }
    // ctx.db.users = the array from db.ts
        user: async (_: unknown, args: { id: string }, ctx: Context) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: args.id },
          include: { cvs: true }
        })
        return user
        },

        users: async (_: unknown, __: unknown, ctx: Context) => {
        const users = await ctx.prisma.user.findMany({
          include: { cvs: true }
        })
        return users 
        },
  },

  // Handles the cvs field INSIDE a User
  User: {
    
    
    cvs: (parent: { cvs: string[] }, _: unknown, ctx: Context) => {
      return parent.cvs;
    }
  }
}