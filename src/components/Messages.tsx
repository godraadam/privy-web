import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivyContact } from "../models/privyContact";
import { routerApiUrl } from "../store";
import Contacts from "./Contacts";
import Conversation from "./Conversation";
import MessagesNavbar from "./MessagesNavbar";

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
  });


  return (
    <div className="flex flex-col flex-grow h-screen max-w-screen overflow-clip">
      {/* navbar*/}
      <MessagesNavbar />
      <div className="flex flex-row" style={{height:"95vh"}}>
        {/* contacts list */}
        <Contacts setSelectedContact={setSelectedContact} selectedAlias={selectedContact?.alias ?? ""}/>
        {/* messages */}
        {!selectedContact ? (
          <div className="flex flex-grow justify-center items-center bg-gradient-to-b from-black to-zinc-900">
            <div className="text-center text-md">
            Select a contact to begin conversation
            </div>
          </div>
        ) : (
          <Conversation contact={selectedContact} onQuit={() => setSelectedContact(null)}/>
        )}
      </div>
    </div>
  );
}
