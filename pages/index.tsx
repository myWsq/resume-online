import type { NextPage, GetServerSideProps } from "next";
import { Avatar, Button } from "@vechaiui/react";
import ResumeRenderer from "../components/ResumeRenderer";
import { AuthUser, getAuthUser } from "../services/get-auth";
import ErrorPanel from "../components/ErrorPanel";
import { getGistConfig, GistConfig } from "../services/get-gist-config";
import ResumeEditor from "../components/ResumeEditor";
import { useState } from "react";
import { useRecoilState } from "recoil";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const accessToken = req.cookies["resume_online_access_token"];

  try {
    const user = await getAuthUser(accessToken);
    const config = await getGistConfig(accessToken);
    return {
      props: {
        user,
        config,
      },
    };
  } catch (error: any) {
    if (error?.response.status === 401) {
      return {
        redirect: {
          destination: "/api/login",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          error: error.message,
        },
      };
    }
  }
};

interface HomePageProps {
  user: AuthUser;
  config: GistConfig;
  error?: string;
}

const ButtonGroup: React.FunctionComponent<{ gistUrl: string }> = ({
  gistUrl,
}) => {
  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-x-2 md:space-y-0">
      <Button color="primary" onClick={() => window.print()}>
        Export
      </Button>
      <Button onClick={() => window.open(gistUrl, "_blank")}>Visit Gist</Button>
    </div>
  );
};

const Home: NextPage<HomePageProps> = ({ user, config, error }) => {
  const [md, setMd] = useState(config.md);
  const gistUrl = `https://gist.github.com/${user.username}/${config.id}`;

  if (error) {
    return <ErrorPanel error={error}></ErrorPanel>;
  }

  return (
    <>
      <div className="hidden print:block">
        <ResumeRenderer md={md}></ResumeRenderer>
      </div>
      <div className="flex flex-col h-screen print:hidden">
        <nav className="border-b">
          <div className="py-5 md:px-12 px-2 flex justify-between mx-auto">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-500">
                Resume Online
              </h1>
              <a
                href="https://github.com/myWsq/resume-online/stargazers"
                className="ml-3"
              >
                <img
                  alt="GitHub stars"
                  src="https://img.shields.io/github/stars/myWsq/resume-online?style=social"
                />
              </a>
            </div>
            <div className="flex">
              <div className="hidden md:block">
                <ButtonGroup gistUrl={gistUrl}></ButtonGroup>
              </div>
              <Avatar
                className="ml-3"
                name={user.username}
                src={user.avatar}
              ></Avatar>
            </div>
          </div>
        </nav>
        <div className="md:hidden my-3 px-2">
          <ButtonGroup gistUrl={gistUrl}></ButtonGroup>
        </div>
        <div className="flex-grow flex flex-col min-h-0">
          <div>tab</div>
          <div className="flex-grow flex min-h-0">
            <div className="w-1/2">
              <ResumeEditor
                className="max-w-[21cm] ml-auto"
                value={md}
                onChange={(e) => setMd(e.target.value)}
              ></ResumeEditor>
            </div>
            <div className="w-1/2 overflow-y-scroll">
              <ResumeRenderer md={md}></ResumeRenderer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
