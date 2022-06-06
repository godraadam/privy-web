import axios from "axios";
import { useEffect } from "react";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";
import DeliveryIndicator from "./DeliveryIndicator";

interface MessageProps {
  message: PrivyMessage;
}

export default function OutgoingMessage(props: MessageProps) {
  async function onResend() {
    // send again and delete previous instance
    try {
      if (!props.message.hash) {
        return;
      }
      const res = await axios.delete(
        `${routerApiUrl}/message/rm?hash=${
          props.message.hash}`
      );
      const res2 = await axios.post(`${routerApiUrl}/message/send`, {
        recipient_alias: props.message.to,
        message: props.message.content,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function onCancel() {
    // don't send again, only delete previous instance
    console.log(props.message.hash);
    try {
      const res = await axios.delete(
        `${routerApiUrl}/message/rm?hash=${props.message.hash}`
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2 justify-end items-center">
        <div className="text-xs text-stone-400">
          {new Date(parseInt(props.message.timestamp)).toLocaleTimeString()}
        </div>
        <div className="indicator">
          <DeliveryIndicator delivered={props.message.delivered} />
          <div className="w-fit bg-stone-700 px-5 py-3 rounded-xl text-sm text-white max-w-4xl">
            {props.message.content}
          </div>
        </div>
      </div>
      {props.message.delivered === "failed" && (
        <div className="flex flex-row justify-end space-x-2 text-xs text-red-400 pr-4">
          <a className="link link-hover" onClick={onResend}>
            Resend
          </a>
          <a className="link link-hover" onClick={onCancel}>
            Cancel
          </a>
        </div>
      )}
    </div>
  );
}
