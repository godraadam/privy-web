import axios from "axios";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivyContact } from "../models/privyContact";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";
import Contacts from "./Contacts";
import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";

export default function Messages() {
  const [messages, setMessages] = useState<Array<PrivyMessage>>([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [selectedContact, setSelectedContact] = useState<PrivyContact | null>(
    null
  );
  
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  
  const scrollToBottom = () => {
    if(!messagesEndRef) {
      return;
    }
    if (!messagesEndRef.current) {
      return;
    }
    // @ts-ignore
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    (async () => {
      try {
        // fetch self
        let res = await axios.get(`${routerApiUrl}/auth/whoami`);
        setUserName(res.data.username);
        setPubKey(res.data.pubkey);
      } catch (error) {
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

  async function onLogout() {
    // send logout request to router
    const res = await axios.post(`${routerApiUrl}/auth/logout`);
    switch (res.status) {
      case 200:
        navigate("/login");
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
    if(!selectedContact) {
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
      <div className="navbar flex flex-row min-w-screen border-stone-600 border-b">
        <h1 className="text-2xl mx-auto font-bold">Privy</h1>
        <div className="bg-base-100 justify-end my-2">
          <div className="dropdown">
            <button className="flex flex-row border border-stone-700 rounded-full px-5 py-1 normal-case text-md">
              {userName}
              <svg
                clip-rule="evenodd"
                fill-rule="evenodd"
                width="24"
                height="24"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                fill="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z" />
              </svg>
            </button>
            <ul className="dropdown-content menu p-1 shadow bg-stone-800 rounded-box min-w-md">
              <li>
                <button onClick={onLogout}>
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="white"
                  >
                    <path d="M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z" />
                  </svg>
                  Logout
                </button>
              </li>
              <li>
                <button
                  onClick={(e) =>
                    navigate(`/profile/?username=${userName}&pubkey=${encodeURIComponent(pubKey)}`)
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="white"
                  >
                    <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm8.127 19.41c-.282-.401-.772-.654-1.624-.85-3.848-.906-4.097-1.501-4.352-2.059-.259-.565-.19-1.23.205-1.977 1.726-3.257 2.09-6.024 1.027-7.79-.674-1.119-1.875-1.734-3.383-1.734-1.521 0-2.732.626-3.409 1.763-1.066 1.789-.693 4.544 1.049 7.757.402.742.476 1.406.22 1.974-.265.586-.611 1.19-4.365 2.066-.852.196-1.342.449-1.623.848 2.012 2.207 4.91 3.592 8.128 3.592s6.115-1.385 8.127-3.59zm.65-.782c1.395-1.844 2.223-4.14 2.223-6.628 0-6.071-4.929-11-11-11s-11 4.929-11 11c0 2.487.827 4.783 2.222 6.626.409-.452 1.049-.81 2.049-1.041 2.025-.462 3.376-.836 3.678-1.502.122-.272.061-.628-.188-1.087-1.917-3.535-2.282-6.641-1.03-8.745.853-1.431 2.408-2.251 4.269-2.251 1.845 0 3.391.808 4.24 2.218 1.251 2.079.896 5.195-1 8.774-.245.463-.304.821-.179 1.094.305.668 1.644 1.038 3.667 1.499 1 .23 1.64.59 2.049 1.043z" />
                  </svg>
                  Profile
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-row" style={{minHeight:"90%"}}>
        <Contacts
          setSelectedContact={setSelectedContact}
        />
      {/* messages */}
        {!selectedContact ? (
          <div className="flex mx-auto items-center">
            <img src="/privy-logo.png" alt="Image not found" />
          </div>
        ) : (
          <div className="flex flex-col flex-grow overflow-y-scroll" ref={messagesEndRef}>
            <div className="flex flex-col border-l-white border-1 pt-20 px-10 bg-stone-900 ">
                <ul className="space-y-2">
                  {messages.map((msg, index) => {
                    return (
                      <li key={index}>
                        {msg.from == selectedContact?.alias ? (
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
                className="border border-stone-500 btn btn-wide hover:bg-stone-500"
                onClick={onSend}
              >
                <svg
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="30"
                  width="30"
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
        )}
        </div>  
    </div>
  );
}