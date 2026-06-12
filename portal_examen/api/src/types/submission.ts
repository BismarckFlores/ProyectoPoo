export type Submission = {
  id: number;
  name: string;
  score: number;
  created_at: string;
};

export type SubmitBody = {
  name?: string;
  score?: number;
};

