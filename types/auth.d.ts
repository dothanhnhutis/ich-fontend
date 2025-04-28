export type SignIn = {
  email: string;
  password: string;
};

export type TokenData = {
  sessionType: string;
  userId: string;
  disableAt: null | Date;
};

export type SignUp = SignIn & {
  username: string;
  confirmPassword: string;
};
