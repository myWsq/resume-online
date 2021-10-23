// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Readable } from "stream";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code;
  if (!code || typeof code !== "string") {
    res.status(400).end("Invalid code");
    return;
  }
  const { data } = await axios.post<Readable>(
    "https://github.com/login/oauth/access_token",
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    },
    {
      headers: { accept: "application/json" },
      responseType: "stream",
    }
  );
  data.pipe(res);
}
