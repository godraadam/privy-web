import axios from "axios";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivyContact } from "../models/privyContact";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";
import Contacts from "./Contacts";
import Conversation from "./Conversation";
import IncomingMessage from "./IncomingMessage";
import MessagesNavbar from "./MessagesNavbar";
import OutgoingMessage from "./OutgoingMessage";

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<PrivyContact | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // fetch self
        const res = await axios.get(`${routerApiUrl}/auth/whoami`);
      } catch (error) {
        // if not logged in, redirect
        navigate("/login");
      }
    })();
  }, []);


  return (
    <div className="flex flex-col h-screen">
      {/* navbar*/}
      <MessagesNavbar />
      <div className="flex flex-row" style={{ minHeight: "90%" }}>
        {/* contacts list */}
        <Contacts setSelectedContact={setSelectedContact} />
        {/* messages */}
        {!selectedContact ? (
          <div className="flex flex-grow justify-center items-center bg-gradient-to-b from-base-200 to-zinc-800">
            <img src="/privy-logo.png" alt="not found" />
          </div>
        ) : (
          <Conversation contact={selectedContact}/>
        )}
      </div>
    </div>
  );
}
