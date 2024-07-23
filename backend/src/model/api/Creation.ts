export type PostCreationIdCommentRequest = {
  comment: string;
};

export type PostCreationIdEditRequest = {
  name?: string;
  description?: string;
  theme?: string;
  genre?: string;
  language?: string;
  caption?: string[];
};
