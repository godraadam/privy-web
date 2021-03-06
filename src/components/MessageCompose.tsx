import axios from "axios";
import { KeyboardEvent, useState } from "react";
import { PrivyContact } from "../models/privyContact";
import { routerApiUrl } from "../store";

interface MessageComposeProps {
  contact: PrivyContact;
  scrollToBottom: () => void;
  fetcMessages: () => Promise<void>;
}

export default function MessageCompose(props: MessageComposeProps) {
  const [message, setMessage] = useState("");

  async function onSend() {
    if (message === "") {
      // don't send empty message
      return;
    }

    // reset text box
    setMessage("");
    props.scrollToBottom();
    try {
      const res = await axios.post(`${routerApiUrl}/message/send`, {
        recipient_alias: props.contact.alias,
        message: message,
      });
      switch (res.status) {
        case 200:
          await props.fetcMessages();

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
    <div className="flex flex-row space-x-2 pl-5 pr-10 pt-2 pb-5 justify-center sticky bottom-0 bg-zinc-800">
      <input
        type="text"
        placeholder="Type your message"
        className="input input-bordered w-full bg-stone-800"
        value={message}
        onChange={(e) => setMessage((e.target as HTMLInputElement).value ?? "")}
        onKeyUp={handleKeypress}
      />
      <button className="border-2 border-stone-600 btn hover:bg-stone-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z" />
        </svg>
      </button>
      <button className="btn btn-primary" onClick={onSend}>
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
  );
}
