import { useEffect } from "react";
import { PrivyMessage } from "../models/privyMessage";

interface MessageProps {
  message: PrivyMessage;
}

export default function OutgoingMessage(props: MessageProps) {
  useEffect(() => console.log(props.message.delivered));

  return (
    <div className="flex flex-row space-x-2 justify-end items-center">
      <div className="text-xs text-stone-400">
        {new Date(parseInt(props.message.timestamp)).toLocaleTimeString()}
      </div>
      <div className="indicator">
        {props.message.delivered && (
          <span className="indicator-item indicator-bottom badge p-0" title="delivered">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z" />
            </svg>
          </span>
        )}
        <div className="w-fit bg-stone-700 px-5 py-3 rounded-xl text-sm text-white max-w-4xl">
          {props.message.content}
        </div>
      </div>
    </div>
  );
}
