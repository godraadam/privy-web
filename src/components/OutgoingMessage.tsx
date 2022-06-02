import { PrivyMessage } from "../models/privyMessage";

interface MessageProps {
  message: PrivyMessage;
}

export default function OutgoingMessage(props: MessageProps) {
  return (
    <div className="flex flex-row space-x-2 justify-end items-center">
      <div className="text-xs text-stone-400">
        {new Date(parseInt(props.message.timestamp)).toLocaleTimeString()}
      </div>
      <div className="w-fit bg-stone-700 p-3 rounded-xl text-sm text-white max-w-4xl">
        {props.message.content}
      </div>
    </div>
  );
}
