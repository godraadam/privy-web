import axios from "axios";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";
import DeliveryIndicator from "./DeliveryIndicator";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import { BeatLoader } from "react-spinners";
import ReactMarkdown from "react-markdown"
interface MessageProps {
  message: PrivyMessage;
}

export default function OutgoingMessage(props: MessageProps) {
  const { promiseInProgress }= usePromiseTracker();

  async function onResend() {
    // send again and delete previous instance
    try {
      if (!props.message.hash) {
        return;
      }
      const res = await trackPromise(axios.post(`${routerApiUrl}/message/rm`, {
        hash: props.message.hash,
      }));
      const res2 = await trackPromise(axios.post(`${routerApiUrl}/message/send`, {
        recipient_alias: props.message.to,
        message: props.message.content,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteMessage() {
    // don't send again, only delete previous instance
    try {
      const res = await trackPromise(
        axios.post(`${routerApiUrl}/message/rm`, {
          hash: props.message.hash,
        })
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2 justify-end items-center">
        <div className="dropdown dropdown-left">
          <label tabIndex={0} className="btn btn-circle btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  fill="gray"
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
        <div className="text-xs text-stone-400">
          {new Date(parseInt(props.message.timestamp)).toLocaleTimeString()}
        </div>
        <div className="indicator">
          <DeliveryIndicator delivered={props.message.delivered} />
          <div className="w-fit bg-stone-700 px-5 py-3 rounded-xl text-sm text-white max-w-4xl">
            <ReactMarkdown children={props.message.content}></ReactMarkdown>
          </div>
        </div>
      </div>
      {props.message.delivered === "failed" && (
        <div className="flex flex-row justify-end space-x-2 text-xs text-red-400 pr-4">
          <a className="link link-hover" onClick={onResend}>
            Resend
          </a>
          <a className="link link-hover" onClick={deleteMessage}>
            Cancel
          </a>
        </div>
      )}
    </div>
  );
}
