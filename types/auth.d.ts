export type SignInFormData = {
  email: string;
  password: string;
};

export type SignInAPIRes = {
  status: "SUCCESS" | "MFA_REQUIRED" | "ACTIVATE_REQUIRED";
  message: string;
  token: string;
};

export type MFAToken = Pick<SignInFormData, "email"> & {
  token: string;
};

export type SignInActionRes =
  | SignInAPIRes
  | { status: "ERROR"; message: string; token: null };

export type MFAFormData = MFAToken & {
  code: string;
};

export type SignInMFAAPIRes = {
  status: "SUCCESS";
  message: string;
  token: string;
};

export type SignUpFormData = SignInFormData & {
  username: string;
  confirmPassword: string;
};
