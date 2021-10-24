import axios, { Axios } from "axios";
import defaultMd from "!!raw-loader!../resume.md";

export interface GistConfig {
  id: string;
  lastUpdatedAt: string;
  md: string;
}

const CONFIG_KEY = "Resume Online Configuration";
const META_FILE = "resume-online-meta.json";
const RESUME_FILE = "resume.md";

async function findGistId(client: Axios, page = 1): Promise<string | null> {
  const { data: gists } = await client.get<any>("/gists", {
    params: {
      per_page: 100,
      page,
    },
  });
  if (!gists.length) {
    return null;
  }

  const target = gists.find(
    (item: any) =>
      item.description === CONFIG_KEY &&
      item.files[META_FILE] &&
      item.files[RESUME_FILE]
  );
  if (target) {
    return target.id;
  } else {
    return await findGistId(client, page + 1);
  }
}

async function getGistDetail(client: Axios, id: string) {
  const { data: gist } = await client.get<any>(`/gists/${id}`);
  return gist;
}

async function createDefaultConfig(client: Axios) {
  const { data: gist } = await client.post<any>("/gists", {
    description: CONFIG_KEY,
    public: false,
    files: {
      [META_FILE]: {
        content: JSON.stringify({
          lastUpdatedAt: new Date(),
        }),
      },
      [RESUME_FILE]: {
        content: defaultMd,
      },
    },
  });
  return gist;
}

function transformGist(gist: any): GistConfig {
  return {
    id: gist.id,
    lastUpdatedAt: JSON.parse(gist.files[META_FILE].content).lastUpdatedAt,
    md: gist.files[RESUME_FILE].content,
  };
}

export async function getGistConfig(accessToken: string) {
  // common axios client
  const client = axios.create({
    baseURL: "https://api.github.com",
    headers: {
      accept: "application/vnd.github.v3+json",
      Authorization: "token " + accessToken,
    },
  });

  // get existing gist or create new one
  const id = await findGistId(client);
  let gist;
  if (id) {
    gist = await getGistDetail(client, id);
  } else {
    gist = await createDefaultConfig(client);
  }

  // transform the gist into a JSON object
  return transformGist(gist);
}
