import { atom } from "recoil";

export interface AuthUserState {
  username: string;
  email: string;
  avatar: string;
}

export const authUserState = atom<AuthUserState | null>({
  key: "authUserState",
  default: null,
});
