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

const Home: NextPage<HomePageProps> = ({ user, config, error }) => {
  if (error) {
    return <ErrorPanel error={error}></ErrorPanel>;
  }

  return (
    <div className="max-w-full w-min mx-auto self-center px-3 print:px-0 pb-12 print:pb-0">
      <nav className="print:hidden flex justify-between py-5 px-1">
        <div className="flex">
          <h1 className="text-xl font-bold text-primary-500">Resume Online</h1>
        </div>
        <div>
          <Button
            color="primary"
            className="mr-3 hidden md:inline-block"
            onClick={() => window.print()}
          >
            Export
          </Button>
          <Button
            className="mr-3"
            onClick={() =>
              window.open(
                `https://gist.github.com/${user.username}/${config.id}`,
                "_blank"
              )
            }
          >
            Visit Gist
          </Button>
          <Avatar name={user.username} src={user.avatar}></Avatar>
        </div>
      </nav>
      <div className="border-2 border-gray-400 border-dashed print:border-0">
        <ResumeRenderer md={config.md}></ResumeRenderer>
      </div>
    </div>
  );
};

export default Home;
