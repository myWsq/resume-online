export interface ResumeEditorProps {
  value: string;
  onChange?: JSX.IntrinsicElements["textarea"]["onChange"];
  className?: string;
}
const ResumeEditor: React.FunctionComponent<ResumeEditorProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <textarea className="w-full" {...props}></textarea>
    </div>
  );
};

export default ResumeEditor;
