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

export type VerifyForm = {
  code: string;
};

export type ResetPasswordForm = {
  email: string;
  code: string;
  password: string;
};
