import type { NextPage, GetServerSideProps } from "next";
import { Avatar, Button } from "@vechaiui/react";
import ResumeRenderer from "../components/ResumeRenderer";
import { AuthUser, getAuthUser } from "../services/get-auth";
import ErrorPanel from "../components/ErrorPanel";
import { getGistConfig, GistConfig } from "../services/get-gist-config";

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
  if (error) {
    return <ErrorPanel error={error}></ErrorPanel>;
  }

  const gistUrl = `https://gist.github.com/${user.username}/${config.id}`;

  return (
    <div className="max-w-full w-min mx-auto self-center px-3 print:px-0 pb-12 print:pb-0">
      <nav className="print:hidden flex justify-between py-5 px-1">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary-500">Resume Online</h1>
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
      </nav>
      <div className="md:hidden mb-3 print:hidden">
        <ButtonGroup gistUrl={gistUrl}></ButtonGroup>
      </div>
      <div className="border-2 border-gray-400 border-dashed print:border-0 rounded">
        <ResumeRenderer md={config.md}></ResumeRenderer>
      </div>
    </div>
  );
};

export default Home;
