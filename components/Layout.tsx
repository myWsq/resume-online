import { Spinner } from "@vechaiui/spinner";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import { authUserState } from "../atoms/auth-user";
import { useAuth } from "../hooks/use-auth";

const Layout: React.FunctionComponent = (props) => {
  const authUser = useRecoilValue(authUserState);

  useAuth();

  return (
    <>
      <Head>
        <title>Resume Online</title>
        <meta name="description" content="Generate your brilliant resume" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>

      <main className="min-h-screen flex flex-col relative">
        {props.children}
        {!authUser && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <h1 className="text-3xl font-bold mb-1 text-primary-500">
              Resume Online
            </h1>
            <p className="mb-8 text-gray-400">Login and loading...</p>
            <Spinner size="lg" className="text-primary-500"></Spinner>
          </div>
        )}
      </main>
    </>
  );
};

export default Layout;
