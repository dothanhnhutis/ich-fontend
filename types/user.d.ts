export type MFA = {
  userId: string;
  deviceName: string;
  secretKey: string;
  backupCode: string[];
  count: number;
  expiredBackupCodes: string[];
  backupCodeCreatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id: string;
  provider: string;
  providerId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TOTP = {
  ascii: string;
  hex: string;
  base32: string;
  oauthUrl: string;
  deviceName: string;
  qrCodeUrl: string;
  createdAt: Date;
};

type Avatar = {
  id: string;
  url: string;
  fileName: string;
  originalname: string;
  width: number | null;
  height: number | null;
};

export type Session = {
  id: string;
  userId: string;
  cookie: CookieOpt;
  ip: string;
  userAgent: {
    ua: string;
    browser: Record<string, string>;
    cpu: Record<string, string>;
    device: Record<string, string>;
    engine: Record<string, string>;
    os: Record<string, string>;
  };
  lastAccess: Date;
  createAt: Date;
};

type Role = {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  emailVerified: Date | null;
  password: string;
  username: string;
  avatar: Avatar | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  session: Session;
  roles: Role[];
  hasPassword: boolean;
};

type CurrentUserResponse = DefaultResponseData & {
  data: CurrentUser | null;
};
type SetupMFA = DefaultResponseData & { data: TOTP | null };
type MFAResponseData = DefaultResponseData & { data: MFA | null };

export type UpdatePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  isSignOut: boolean;
};

// ----------------

export type UpdateEmailByOTPFormData = {
  email: string;
  otp: string;
};
