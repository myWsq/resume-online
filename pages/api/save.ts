import { AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { saveGistConfig } from "../../services/gist";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  const accessToken = req.cookies["resume_online_access_token"];
  const gistId = req.body.gistId;
  const content = req.body.content;

  try {
    await saveGistConfig(gistId, accessToken, content);
    res.status(200).end();
  } catch (error: any) {
    const response: AxiosResponse = error.response;
    res.status(response.status).end(response.statusText);
  }
}
