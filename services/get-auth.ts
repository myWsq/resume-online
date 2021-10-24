import axios from "axios";

export interface AuthUser {
  username: string;
  email: string;
  avatar: string;
}

export async function getAuthUser(accessToken: string): Promise<AuthUser> {
  const { data: user } = await axios.get<any>("https://api.github.com/user", {
    headers: {
      Authorization: "token " + accessToken,
    },
  });

  return {
    avatar: user.avatar_url,
    username: user.login,
    email: user.email,
  };
}
