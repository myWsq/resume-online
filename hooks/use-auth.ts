import { AxiosError } from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authUserState } from "../atoms/auth-user";
import { ACCESS_TOKEN_KEY, githubAxios } from "../utils/github-client";

function getClientId() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "Environment variable 'NEXT_PUBLIC_GITHUB_CLIENT_ID' is required"
    );
  }
  return clientId;
}

function redirectToAuthPage() {
  const base = "https://github.com/login/oauth/authorize";
  const query = new URLSearchParams({
    client_id: getClientId(),
    scope: "read:user, gist",
  });

  location.href = base + "?" + query.toString();
}

async function requestAccessToken(code: string) {
  const { data } = await githubAxios.get<any>("/api/auth", {
    params: {
      code,
    },
  });
  return data.access_token as string;
}

async function requestAuthUser() {
  const { data: user } = await githubAxios.get<any>(
    "https://api.github.com/user"
  );
  return user;
}

export function useAuth() {
  const setAuthUser = useSetRecoilState(authUserState);

  async function init() {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    if (code && typeof code === "string") {
      const accessToken = await requestAccessToken(code);
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      location.replace("/");
    } else {
      try {
        const user = await requestAuthUser();
        setAuthUser({
          avatar: user.avatar_url,
          username: user.login,
          email: user.email,
        });
      } catch (error) {
        const { response } = error as AxiosError;
        // token 无效，需要登陆
        if (response?.status === 401) {
          redirectToAuthPage();
        } else {
          throw error;
        }
      }
    }
  }

  useEffect(() => {
    init();
  }, []);
}
