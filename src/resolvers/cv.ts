import type { Context } from "../server.js"

export const cvResolvers = {

  // Handles Query.cv and Query.cvs
  Query: {
    // When client asks: cv(id: "1") { ... }
    // args = { id: "1" }
    // ctx.db.cvs = the array from db.ts
    cv: (_: unknown, args: { id: string }, ctx: Context) => {
      console.log("Resolving cv with id:", args.id)
      console.log("Current cvs in DB:", ctx.db.cvs)
      return ctx.db.cvs.find(cv => cv.id === args.id)
    },
    cvs: (_: unknown, __: unknown, ctx: Context) => {
      console.log("Resolving all cvs")
      console.log("Current cvs in DB:", ctx.db.cvs)
      return ctx.db.cvs
    }
  },

  // Handles the skillIds field INSIDE a Cv
  Cv: {
    // When client asks: cv(id:"1") { skillIds }
    // GraphQL first resolves the Cv (parent = that cv object)
    // then calls THIS to get its skillIds
    skills: (parent: { id: string; skillIds: string[] }, _: unknown, ctx: Context) => {
      console.log("Resolving skills for cv with id:", parent.id)
      console.log("Current cvs in DB:", ctx.db.cvs)
      return parent.skillIds.map((skillId: string) => ctx.db.skills.find(s => s.id === skillId)) ?? []
    },
    owner: (parent: { owner: string }, _: unknown, ctx: Context) => {
      return ctx.db.users.find(u => u.id === parent.owner) ?? null
    }
  }
}