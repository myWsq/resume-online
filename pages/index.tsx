import type { NextPage, GetServerSideProps } from "next";
import {
  Avatar,
  Button,
  cx,
  Spinner,
  useMessage,
  useNotification,
} from "@vechaiui/react";
import ResumeRenderer from "../components/ResumeRenderer";
import { AuthUser, getAuthUser } from "../services/get-auth";
import ErrorPanel from "../components/ErrorPanel";
import { getGistConfig, GistConfig } from "../services/gist";
import ResumeEditor from "../components/ResumeEditor";
import { useEffect, useRef, useState } from "react";
import { useEvent, useMedia, useDebounce, useAsyncFn } from "react-use";
import axios from "axios";

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

const Tabs: React.FunctionComponent<{
  names: string[];
  value: string;
  onChange?: (val: string) => void;
  className?: string;
}> = ({ names, value, onChange, ...props }) => {
  return (
    <div {...props}>
      <div className="flex space-x-1 border-b font-medium text-gray-500 px-2">
        {names.map((name) => (
          <span
            key={name}
            onClick={() => onChange?.(name)}
            className={cx(
              "capitalize px-3 py-2 text-sm block",
              name === value &&
                "border-b-2 border-primary-500 -mb-0.5 text-gray-900"
            )}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

const SavingSpan: React.FunctionComponent<{
  loading: boolean;
  className?: string;
}> = (props) => {
  return (
    <div className={props.className}>
      <div
        className={cx(
          "text-gray-400 flex text-sm items-center",
          props.loading ? "flex" : "hidden"
        )}
      >
        <Spinner className="mr-2 text-primary-400" />
        <span className="hidden md:inline">Saving to gist...</span>
      </div>
    </div>
  );
};

const Home: NextPage<HomePageProps> = ({ user, config, error }) => {
  const [md, setMd] = useState(config.md);
  const [lastSavedMd, setLastSavedMd] = useState(md);
  const gistUrl = `https://gist.github.com/${user.username}/${config.id}`;
  const printContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const message = useMessage();
  const notification = useNotification();

  // generate a snapshot of the renderer before print
  useEvent("beforeprint", () => {
    const content = contentRef.current;
    const target = printContainerRef.current;
    if (target && content) {
      target.innerHTML = content.innerHTML;
    }
  });

  const isWide = useMedia("(min-width: 768px)");
  const [tabActive, setTabActive] = useState<string>("preview");
  const showEditor = isWide || tabActive === "editor";
  const showPreview = isWide || tabActive === "preview";

  const [saveState, save] = useAsyncFn((content: string) =>
    axios.post("/api/save", {
      gistId: config.id,
      content,
    })
  );

  useDebounce(
    async () => {
      if (md !== lastSavedMd) {
        await save(md);
        setLastSavedMd(md);
      }
    },
    500,
    [md]
  );

  useEffect(() => {
    if (saveState.error) {
      message({
        message: saveState.error.message,
        status: "error",
        position: "top",
      });
    }
  }, [saveState.error]);

  useEffect(() => {
    if (lastSavedMd !== md) {
      window.onbeforeunload = () => {
        return "Your changes have not been saved yet.";
      };
    } else {
      window.onbeforeunload = null;
    }
  }, [lastSavedMd, md]);

  useEffect(() => {
    const isFirstView = localStorage.getItem("resume-online-view");
    if (!isFirstView) {
      const handler = notification({
        title: "🖐 Hi there!",
        status: "info",
        description:
          "Your changes will be save to gist automatically. Just enjoy it.",
        position: "top-right",
      });
      localStorage.setItem("resume-online-view", "1");
    }
  }, []);

  if (error) {
    return <ErrorPanel error={error}></ErrorPanel>;
  }

  return (
    <>
      {/* print only */}
      <div className="hidden print:block" ref={printContainerRef}></div>

      {/* user interface */}
      <div className="flex flex-col h-screen overflow-hidden print:hidden">
        <nav className="border-b">
          <div className="py-3 md:py-5 md:px-12 px-5 flex justify-between mx-auto">
            <div className="flex items-center">
              <h1 className="text-lg md:text-xl font-bold">
                <span className="text-primary-500">Resume</span> Online
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
              <SavingSpan className="ml-3" loading={saveState.loading} />
            </div>
            <div className="flex">
              <div className="hidden md:block space-x-2">
                <Button
                  color="primary"
                  variant="solid"
                  onClick={() => window.print()}
                >
                  Export
                </Button>
                <Button onClick={() => window.open(gistUrl, "_blank")}>
                  Visit Gist
                </Button>
              </div>
              <Avatar
                className="ml-3"
                name={user.username}
                src={user.avatar}
              ></Avatar>
            </div>
          </div>
        </nav>

        {/* mobile button group */}
        {/* <div className="md:hidden my-3 px-2">
          <ButtonGroup gistUrl={gistUrl}></ButtonGroup>
        </div> */}

        <Tabs
          className="md:hidden"
          names={["preview", "editor"]}
          value={tabActive}
          onChange={setTabActive}
        />

        {/* main */}
        <div className="flex-grow flex flex-col min-h-0">
          <div className="flex-grow flex min-h-0">
            {process.browser && (
              <div
                className={cx(
                  "w-full md:w-1/2 flex flex-col",
                  showEditor ? "relative" : "hidden"
                )}
              >
                <ResumeEditor
                  className="absolute inset-0"
                  defaultValue={config.md}
                  onChange={setMd}
                ></ResumeEditor>
              </div>
            )}
            <section
              className={cx(
                "md:w-1/2 overflow-y-scroll",
                showPreview ? "block" : "hidden"
              )}
            >
              <ResumeRenderer md={md} contentRef={contentRef}></ResumeRenderer>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
