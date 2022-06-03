import axios from "axios";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivyContact } from "../models/privyContact";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";
import Contacts from "./Contacts";
import IncomingMessage from "./IncomingMessage";
import MessagesNavbar from "./MessagesNavbar";
import OutgoingMessage from "./OutgoingMessage";

export default function Messages() {
  const [messages, setMessages] = useState<Array<PrivyMessage>>([]);
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<PrivyContact | null>(
    null
  );

  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (!messagesEndRef) {
      return;
    }
    if (!messagesEndRef.current) {
      return;
    }
    // @ts-ignore
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    (async () => {
      try {
        // fetch self
        const res = await axios.get(`${routerApiUrl}/auth/whoami`);
      } catch (error) {
        // if not logged in, redirect
        navigate("/login");
      }
      await fetchMessagesWithSelectedAccount();
    })();
  }, [selectedContact]);

  async function fetchMessagesWithSelectedAccount() {
    if (!selectedContact) {
      return;
    }
    const res = await axios.get(
      `${routerApiUrl}/message/with/${selectedContact.alias}`
    );
    switch (res.status) {
      case 200:
        const msgs = res.data as PrivyMessage[];
        setMessages(msgs);
        break;
    }
  }

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      onSend();
    }
  };

  async function onSend() {
    if (message === "") {
      // don't send empty message
      return;
    }
    if (!selectedContact) {
      return;
    }
    setMessage("");
    try {
      const res = await axios.post(`${routerApiUrl}/message/send`, {
        recipient_alias: selectedContact.alias,
        message: message,
      });
      switch (res.status) {
        case 200:
          console.log(`Message sent to ${selectedContact?.alias}!`);
          fetchMessagesWithSelectedAccount();
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* navbar*/}
      <MessagesNavbar />
      <div className="flex flex-row" style={{ minHeight: "90%" }}>
        {/* messages */}
        <Contacts setSelectedContact={setSelectedContact} />
        {/* messages */}
        {!selectedContact ? (
          <div className="flex mx-auto items-center">
            <img src="/privy-logo.png" alt="not found" />
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="text-center text-xl font-bold py-3 bg-black">
              {selectedContact.alias}
            </div>
            <div
              className="flex flex-col flex-grow overflow-y-scroll bg-gradient-to-b from-black to-stone-800"
              ref={messagesEndRef}
            >
              <div className="flex flex-col border-l-white flex-grow border-1 pt-20 px-10">
                <ul className="space-y-2">
                  {messages.map((msg, index) => {
                    return (
                      <li key={index}>
                        {msg.from === selectedContact?.alias ? (
                          <IncomingMessage message={msg} />
                        ) : (
                          <OutgoingMessage message={msg} />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex flex-row space-x-2 px-10 py-5 justify-center">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="input input-bordered w-2/3"
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
        )}
      </div>
    </div>
  );
}
