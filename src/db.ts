export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
export const db = {
  users: [
    { id: "1", name: "Mohanned", email: "Mohanned@mail.com", role: Role.USER },
    { id: "2", name: "Bob", email: "bob@mail.com", role: Role.ADMIN },
    { id: "3", name: "Charlie", email: "charlie@mail.com", role: Role.USER }
  ],

  cvs: [
    {
      id: "cv1",
      name: "Dev CV",
      age: 22,
      job: "Developer",
      owner: "1",
      skillIds: ["s1", "s2"]
    }

  ],

  skills: [
    { id: "s1", name: "TypeScript" },
    { id: "s2", name: "GraphQL" },
    { id: "s3", name: "Docker" }
  ]
};
//========= Notes ======================
// une autre façon de le faire c'est faire une tablea UserCV as linking each cv to user
// but risks to make redundancy in the data and 