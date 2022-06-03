import axios from "axios";
import { KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivyContact } from "../models/privyContact";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";
import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";

interface ConversationProps {
  contact: PrivyContact;
  onQuit: () => void;
}

export default function Conversation(props: ConversationProps) {
  const [messages, setMessages] = useState<Array<PrivyMessage>>([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const promiseInProgress = usePromiseTracker();

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    // fetch messages when mounting
    (async () => {
      trackPromise(fetchMessagesWithSelectedAccount());

      // then fetch every half a second
      intervalId = setInterval(fetchMessagesWithSelectedAccount, 2000);
    })();

    // cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [props.contact]);

  async function fetchMessagesWithSelectedAccount() {
    const res = await axios.get(
      `${routerApiUrl}/message/with/${props.contact.alias}`
    );
    switch (res.status) {
      case 200:
        const msgs = res.data as PrivyMessage[];
        setMessages(msgs);
        console.log(msgs);
        break;
    }
  }

  async function onSend() {
    if (message === "") {
      // don't send empty message
      return;
    }

    // reset text box
    setMessage("");
    try {
      const res = await axios.post(`${routerApiUrl}/message/send`, {
        recipient_alias: props.contact.alias,
        message: message,
      });
      switch (res.status) {
        case 200:
          console.log(`Message sent to ${props.contact?.alias}!`);
          fetchMessagesWithSelectedAccount();
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      onSend();
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-row justify-between bg-black border-b border-stone-500">
          <div className="flex px-5 flex-row items-center text-white gap-5 text-xl font-bold py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M0 1v16.981h4v5.019l7-5.019h13v-16.981h-24zm13 12h-8v-1h8v1zm6-3h-14v-1h14v1zm0-3h-14v-1h14v1z" />
            </svg>
            <div
              className="link link-hover"
              onClick={() =>
                navigate(
                  `/profile/?username=${
                    props.contact.alias
                  }&pubkey=${encodeURIComponent(
                    props.contact.pubkey
                  )}&contact=true&trusted=${props.contact.trusted}`
                )
              }
            >
              {props.contact.alias}
            </div>
            <LoadingIndicator width={200}/>
          </div>
          
        <button className="" onClick={props.onQuit}>
          <svg
            clip-rule="evenodd"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="white"
          >
            <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col flex-grow overflow-y-scroll scroll-smooth bg-gradient-to-b from-black to-zinc-800">
        <div className="flex flex-col-reverse flex-grow border-1 pt-20 px-10 pb-24">
          {messages.length > 0 ? (
            <ul className="space-y-2">
              {messages.map((msg, index) => {
                return (
                  <li key={index}>
                    {msg.from === props.contact.alias ? (
                      <IncomingMessage message={msg} />
                    ) : (
                      <OutgoingMessage message={msg} />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-grow justify-center items-center">
              <div className="text-center text-md">
                Nothing here yet. Say Hi!
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row space-x-2 px-10 pt-2 pb-5 justify-center sticky bottom-0 bg-zinc-800">
          <input
            type="text"
            placeholder="Type your message"
            className="input input-bordered w-2/3 bg-stone-800"
            value={message}
            onChange={(e) =>
              setMessage((e.target as HTMLInputElement).value ?? "")
            }
            onKeyUp={handleKeypress}
          />
          <button
            className="border border-stone-700 btn btn-wide hover:bg-stone-500"
            onClick={onSend}
          >
            <svg
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              height="28"
              width="28"
              fill="white"
            >
              <path
                d="m12.012 1.995c-5.518 0-9.998 4.48-9.998 9.998s4.48 9.998 9.998 9.998 9.997-4.48 9.997-9.998-4.479-9.998-9.997-9.998zm0 1.5c4.69 0 8.497 3.808 8.497 8.498s-3.807 8.498-8.497 8.498-8.498-3.808-8.498-8.498 3.808-8.498 8.498-8.498zm1.528 4.715s1.502 1.505 3.255 3.259c.146.147.219.339.219.531s-.073.383-.219.53c-1.753 1.754-3.254 3.258-3.254 3.258-.145.145-.336.217-.527.217-.191-.001-.383-.074-.53-.221-.293-.293-.295-.766-.004-1.057l1.978-1.977h-6.694c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h6.694l-1.979-1.979c-.289-.289-.286-.762.006-1.054.147-.147.339-.221.531-.222.19 0 .38.071.524.215z"
                fill-rule="nonzero"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
