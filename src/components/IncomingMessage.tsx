import axios from "axios";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";

interface MessageProps {
  message: PrivyMessage;
}

export default function IncomingMessage(props: MessageProps) {
  
  async function deleteMessage() {
    // don't send again, only delete previous instance
    try {
      const res = await axios.post(`${routerApiUrl}/message/rm`, {
        hash: props.message.hash,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div className="flex flex-row space-x-2 justify-start items-center">
      <div className="w-fit text-xs text-stone-400">
        {new Date(parseInt(props.message.timestamp)).toLocaleTimeString()}
      </div>
      <div className="w-fit bg-stone-600 px-5 py-2 rounded-xl text-sm text-white max-w-4xl">
        {props.message.content}
      </div>
      <div className="dropdown dropdown-right">
          <label tabIndex={0} className="btn btn-circle btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-52 text-sm"
          >
            <li>
              <a onClick={deleteMessage}>Delete</a>
            </li>
            <li>
              <a>Forward</a>
            </li>
            <li>
              <a>Reply</a>
            </li>
          </ul>
        </div>
    </div>
  );
}