// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import nookies from "nookies";

const clientID = process.env.GITHUB_ID as string;
const clientSecret = process.env.GITHUB_SECRET as string;

function genAuthUrl() {
  const base = "https://github.com/login/oauth/authorize";
  const query = new URLSearchParams({
    client_id: clientID,
    scope: "read:user, gist",
  });
  return base + "?" + query.toString();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code;

  // No code, redirect to auth page
  if (!code || typeof code !== "string") {
    res.redirect(genAuthUrl());
    return;
  }

  // get access token and write to cookie
  const { data } = await axios.post<any>(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientID,
      client_secret: clientSecret,
      code,
    },
    {
      headers: { accept: "application/json" },
    }
  );

  nookies.set({ res }, "resume_online_access_token", data.access_token, {
    path: "/",
  });

  res.redirect(302, "/");
}
