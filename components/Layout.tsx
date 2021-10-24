import Head from "next/head";

const Layout: React.FunctionComponent = (props) => {
  return (
    <>
      <Head>
        <title>Resume Online</title>
        <meta name="description" content="Generate your brilliant resume" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      {props.children}
    </>
  );
};

export default Layout;
