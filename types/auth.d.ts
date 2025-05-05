export type MFAFormData = MFAToken & {
  code: string;
};

export type SignInMFAAPIRes = {
  status: "SUCCESS";
  message: string;
  token: string;
};

export type SignInFormData = {
  email: string;
  password: string;
};

export type MFAToken = Pick<SignInFormData, "email"> & {
  token: string;
};

export type SignInAPIRes = SignInMFAAPIRes & {
  status: "SUCCESS" | "MFA_REQUIRED" | "ACTIVATE_REQUIRED";
};
export type SignInActionRes =
  | SignInAPIRes
  | { status: "ERROR"; message: string; token: null };

export type SignUpFormData = SignInFormData & {
  username: string;
  confirmPassword: string;
};
