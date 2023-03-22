export type ContactForm = {
  firstName: string;
  surname: string;
  email: string;
  message: string;
};

export type RegistrationForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ConfirmationForm = {
  code: string;
};
