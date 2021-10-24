import fs from "fs";
import ResumeRenderer from "../components/ResumeRenderer";

export async function getStaticProps() {
  return {
    props: {
      md: fs.readFileSync("resume.md").toString(),
    },
  };
}

export function Preview(props: any) {
  return <ResumeRenderer md={props.md}></ResumeRenderer>;
}

export default Preview;
