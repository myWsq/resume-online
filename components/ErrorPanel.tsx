import { Button } from "@vechaiui/react";
import Image from "next/image";
import pic from "../public/meh.png";

const ErrorPanel: React.FunctionComponent<{ error: string }> = (props) => {
  return (
    <div className="h-screen  flex items-center justify-center p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
        <div className="px-12">
          <Image
            src={pic}
            alt="meh"
            layout="responsive"
            placeholder="blur"
          ></Image>
        </div>
        <div className="text-center lg:text-left">
          <h1 className="text-2xl">Something wrong here</h1>
          <p className="break-all text-gray-400 mt-1">
            {props.error || "1232132121312321x12321moxpjni123po12j31h"}
          </p>
          <Button
            variant="outline"
            color="primary"
            className="mt-5"
            onClick={() => location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPanel;
