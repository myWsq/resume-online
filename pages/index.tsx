import type { NextPage } from "next";
import { Avatar } from "@vechaiui/react";
import { useRecoilValue } from "recoil";
import { authUserState } from "../atoms/auth-user";
import ResumeMain from "../components/ResumeMain";
import fs from "fs";

export async function getStaticProps() {
  return {
    props: {
      initialMarkdown: fs.readFileSync("resume.md").toString(),
    },
  };
}

const Home: NextPage<{ initialMarkdown: string }> = (props) => {
  const authUser = useRecoilValue(authUserState);

  if (!authUser) {
    return null;
  }

  return (
    <div className="max-w-full self-center px-5 print:px-0 pb-12 print:pb-0">
      <nav className="print:hidden flex justify-between py-5">
        <h1 className="text-xl font-bold text-primary-500">Resume Online</h1>
        <Avatar name={authUser.username} src={authUser.avatar}></Avatar>
      </nav>
      <div className="border-2 border-gray-400 border-dashed print:border-0">
        {/* <div className="no-print inset-0 absolute border-2 border-gray-400 border-dashed pointer-events-none"></div> */}
        <ResumeMain md={props.initialMarkdown}></ResumeMain>
      </div>
    </div>
  );
};

export default Home;
