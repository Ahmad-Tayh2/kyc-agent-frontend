export type CustomerFormSubmissionResponse = {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
  errors: null | Record<string, string[]>;
};
