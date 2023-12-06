export type PatchUserRequest = {
  age: string;
  region: string;
  role: string;
  language: string;
  instrument: string;
  favoriate: string;
};

export type PutUserAvatarRequest = {
  file: string;
};
