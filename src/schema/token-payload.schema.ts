export type AdminUserPayload = {
  id: string;
  email: string;
};

export type AppUserPayload = {
  id: string;
  phoneNumber: string | null;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};
