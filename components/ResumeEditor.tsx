import Editor from "@monaco-editor/react";
import useResizeObserver from "@react-hook/resize-observer";
import React, { useRef, useState } from "react";

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
  const [height, setHeight] = useState(0);

  useResizeObserver(containerRef, (entry) => {
    setHeight(entry.contentRect.height);
  });

  return (
    <div className={className} ref={containerRef}>
      <Editor
        className="w-full"
        height={height}
        defaultLanguage="markdown"
        defaultValue={props.defaultValue}
        onChange={(val) => props.onChange?.(val || "")}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      ></Editor>
    </div>
  );
};

export default ResumeEditor;
