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
      },
      {
        id: "cv2",
        name: "Design CV",
        age: 25,
        job: "UI/UX Designer",
        owner: "2",
        skillIds: ["s2", "s3"]
      },
      {
        id: "cv3",
        name: "Data CV",
        age: 28,
        job: "Data Analyst",
        owner: "1",
        skillIds: ["s1", "s3"]
      },
      {
        id: "cv4",
        name: "PM CV",
        age: 30,
        job: "Product Manager",
        owner: "3",
        skillIds: ["s1", "s2", "s3"]
      },
      {
        id: "cv5",
        name: "DevOps CV",
        age: 24,
        job: "DevOps Engineer",
        owner: "2",
        skillIds: ["s3"]
      },
      {
        id: "cv6",
        name: "QA CV",
        age: 26,
        job: "QA Engineer",
        owner: "3",
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