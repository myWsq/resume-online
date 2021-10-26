import Editor from "@monaco-editor/react";
import useResizeObserver from "@react-hook/resize-observer";
import React, { useEffect, useRef, useState } from "react";
import type * as Monaco from "monaco-editor";
import { format } from "prettier/standalone";
import parserMarkdown from "prettier/parser-markdown";

export interface ResumeEditorProps {
  defaultValue: string;
  onChange?: (val: string) => void;
  className?: string;
}

const ResumeEditor: React.FunctionComponent<ResumeEditorProps> = ({
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400);

  useResizeObserver(containerRef, (entry) => {
    setHeight(entry.contentRect.height);
  });

  function handleEditorDidMount(
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) {
    monaco.languages.registerDocumentFormattingEditProvider("markdown", {
      provideDocumentFormattingEdits(model) {
        return [
          {
            text: format(model.getValue(), {
              parser: "markdown",
              plugins: [parserMarkdown],
            }),
            range: model.getFullModelRange(),
          },
        ];
      },
    });
  }

  return (
    <div className={className} ref={containerRef}>
      <Editor
        className="w-full"
        height={height}
        defaultLanguage="markdown"
        defaultValue={props.defaultValue}
        onChange={(val) => props.onChange?.(val || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          quickSuggestions: false,
        }}
      ></Editor>
    </div>
  );
};

export default ResumeEditor;
