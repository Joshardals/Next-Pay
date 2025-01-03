export interface User {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  verificationCode?: {
    code: string;
    expiresAt: string;
  };
}
