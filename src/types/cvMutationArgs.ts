// Types for CV mutation arguments
export type AddCvArgs = {
  input: {
    id: string;
    name: string;
    age: number;
    job: string;
    owner: string;
    skillIds: string[];
  };
};

export type UpdateCvArgs = {
  input: {
    id: string;
    name?: string;
    age?: number;
    job?: string;
    owner?: string;
    skillIds?: string[];
  };
};

export type DeleteCvArgs = {
  id: string;
};
