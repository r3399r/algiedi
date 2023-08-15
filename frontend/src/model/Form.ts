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
};

export type UploadLyricsForm = {
  name: string;
  description: string;
  lyrics: string;
};

export type UpdateLyricsForm = {
  lyrics: string;
};

export type MessageForm = {
  content: string;
};
