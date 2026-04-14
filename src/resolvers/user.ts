import type { Context } from "../server.js"

export const userResolvers = {

  // Handles Query.user and Query.users
  Query: {
    
    // When client asks: user(id: "1") { ... }
    // args = { id: "1" }
    // ctx.db.users = the array from db.ts
        user: (_: unknown, args: { id: string }, ctx: Context) => {
        console.log("Resolving user with id:", args.id)
        console.log("Current users in DB:", ctx.db.users)
    
        return ctx.db.users.find(u => u.id === args.id) ?? null
        },

        users: (_: unknown, __: unknown, ctx: Context) => {
        console.log("Resolving all users")
        return ctx.db.users
        },
  },

  // Handles the cvs field INSIDE a User
  User: {
    
    // When client asks: user(id:"1") { cvs { ... } }
    // GraphQL first resolves the User (parent = that user object)
    // then calls THIS to get their cvs
    cvs: (parent: { id: string }, _: unknown, ctx: Context) => {
      return ctx.db.cvs.filter(cv => cv.owner === parent.id)
    }
  }
}