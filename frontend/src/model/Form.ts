export type ContactForm = {
  firstName: string;
  surname: string;
  email: string;
  message: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type RegistrationForm = {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
};

export type ForgetPasswordForm = {
  email: string;
  code: string;
  password: string;
};

export type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

export type UploadTrackForm = {
  name: string;
  description: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
};

export type UploadLyricsForm = {
  name: string;
  description: string;
  lyrics: string;
  theme: string;
  genre: string;
  language: string;
  caption: string;
};
