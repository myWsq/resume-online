import ReactMarkdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import yaml from "js-yaml";
import { AnchorHTMLAttributes } from "react";

function remarkTransform() {
  return (tree: any) => {
    visit(tree, ["yaml"], (node) => {
      const props: any = yaml.load(node.value);
      node.type = "containerDirective";
      node.name = "basic-info";
      node.attributes = props;
      return node;
    });
    visit(
      tree,
      ["textDirective", "leafDirective", "containerDirective"],
      (node) => {
        node.data = {
          hName: node.name,
          hProperties: node.attributes,
          ...node.data,
        };
        return node;
      }
    );
  };
}

const AutoLink: React.FunctionComponent = ({ children }) => {
  if (typeof children === "string" && /^http(s):\/\//.test(children)) {
    return (
      <Link href={children} rel="noreferrer" target="_blank">
        {children}
      </Link>
    );
  }
  return <>{children}</>;
};

const BasicInfo: React.FunctionComponent<{
  name: string;
  extra?: string;
  attrs?: Record<string, string>;
}> = ({ name, extra, attrs }) => {
  return (
    <div className="flex justify-between items-center text-gray-700 border-b pb-5 mb-5">
      <div>
        <h1 className="text-gray-900 font-semibold text-2xl">{name}</h1>
        {extra && (
          <p className="mt-1">
            <AutoLink>{extra}</AutoLink>
          </p>
        )}
      </div>
      <div>
        <table>
          <tbody>
            {attrs &&
              Object.entries(attrs).map((item) => (
                <tr key={item[0]}>
                  <td className="pr-3">{item[0]}:</td>
                  <td>
                    <AutoLink>{item[1]}</AutoLink>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Time: React.FunctionComponent = (props) => {
  return <span {...props} className="float-right inline-block"></span>;
};

const H2: React.FunctionComponent = (props) => {
  return (
    <h2
      {...props}
      className="text-gray-900 text-xl font-medium !mt-5 !mb-3"
    ></h2>
  );
};

const H3: React.FunctionComponent = (props) => {
  return <h3 {...props} className="text-gray-900 font-medium !mt-4 !mb-3"></h3>;
};

const Hr: React.FunctionComponent = (props) => {
  return <hr {...props} className="!my-5"></hr>;
};

const Ul: React.FunctionComponent = (props) => {
  return (
    <ul
      {...props}
      className="list-inside"
      style={{
        listStyleType: "'- '",
      }}
    ></ul>
  );
};

const Ol: React.FunctionComponent = (props) => {
  return <ol className="list-inside list-decimal">{props.children}</ol>;
};

const Li: React.FunctionComponent = (props) => {
  return (
    <li
      {...props}
      className="leading-6"
      style={{
        paddingInlineStart: "1em",
      }}
    ></li>
  );
};

const Link: React.FunctionComponent<AnchorHTMLAttributes<HTMLAnchorElement>> = (
  props
) => {
  return (
    <a className="text-blue-600" rel="noreferrer" target="_blank" {...props}>
      {props.children}
    </a>
  );
};

const components = {
  h2: H2,
  h3: H3,
  hr: Hr,
  ul: Ul,
  ol: Ol,
  li: Li,
  a: Link,
  time: Time,
  "basic-info": BasicInfo,
};

const ResumeMain: React.FunctionComponent<{ md: string }> = (props) => {
  return (
    <div className="w-[21cm] max-w-full relative overflow-hidden">
      <ReactMarkdown
        className="text-gray-800 p-8 space-y-3 text-sm"
        skipHtml
        remarkPlugins={[remarkFrontmatter, remarkDirective, remarkTransform]}
        // @ts-ignore
        components={components}
        allowedElements={[
          "basic-info",
          "h2",
          "h3",
          "time",
          "ul",
          "ol",
          "li",
          "p",
          "hr",
          "br",
          "strong",
          "i",
          "a",
        ]}
      >
        {props.md}
      </ReactMarkdown>

      {/* 分页提示 */}
      {[...new Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute border-b-2 border-dashed border-gray-400 w-full overflow-hidden print:hidden"
          style={{
            top: 29.6 * (i + 1) + "cm",
          }}
        ></div>
      ))}
    </div>
  );
};
export default ResumeMain;
