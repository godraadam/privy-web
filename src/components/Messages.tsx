import axios from "axios";
import { KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivyContact } from "../models/privyContact";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";

export default function Messages({ user }: any) {
  const [contacts, setContacts] = useState<Array<PrivyContact>>([]);
  const [newContactAlias, setNewContactAlias] = useState("");
  const [newContactPubKey, setNewContactPubKey] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [messages, setMessages] = useState<Array<PrivyMessage>>([]);
  const [selectedContactIndex, setSelectedContactIndex] = useState(-1);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => fetchContacts())();
  }, []);

  async function fetchContacts() {
    try {
      const res = await axios.get(`${routerApiUrl}/contact/ls`);
      setContacts(res.data as Array<PrivyContact>);
    } catch (error) {}
  }

  async function showMessagesForSelectedContact(index: number) {
    setSelectedContactIndex(index);
    const contact = contacts[index];
    const res = await axios.get(
      `${routerApiUrl}/message/with/${contact.alias}`
    );
    switch (res.status) {
      case 200:
        const msgs = res.data as PrivyMessage[];
        setMessages(msgs);
        console.log(messages);
        break;
    }
  }

  async function onAddNewContact() {
    try {
      const res = await axios.post(`${routerApiUrl}/contact/add`, {
        alias: newContactAlias,
        pubkey: newContactPubKey,
        trusted: false,
      });
      switch (res.status) {
      }
      await fetchContacts();
      setNewContactAlias("");
      setNewContactPubKey("");
    } catch (error) {}
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
    setMessage("");
    try {
      const res = await axios.post(`${routerApiUrl}/message/send`, {
        recipient_alias: contacts[selectedContactIndex].alias,
        message: message,
      });
      switch (res.status) {
        case 200:
          console.log("Message sent!");
          await showMessagesForSelectedContact(selectedContactIndex);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-row min-h-screen">
      <div className="flex flex-col min-w-lg space-y-2 p-20 bg-stone-900">
        <button className="btn btn-ghost w-full max-w-xs" onClick={onLogout}>
          Logout
        </button>
        <button
          className="btn btn-ghost w-full max-w-xs"
          onClick={() => setShowContactForm(!showContactForm)}
        >
          Add contact
        </button>
        {showContactForm && (
          <div className="w-full max-w-xs p-2 space-y-1 ">
            <input
              type="text"
              className="input input-bordered input-white w-full max-w-xs"
              placeholder="Alias"
              onInput={(e) =>
                setNewContactAlias((e.target as HTMLInputElement).value ?? "")
              }
              value={newContactAlias}
            />
            <input
              type="text"
              className="input input-bordered input-white w-full max-w-xs"
              placeholder="Public key"
              onInput={(e) =>
                setNewContactPubKey((e.target as HTMLInputElement).value ?? "")
              }
              value={newContactPubKey}
            />
            <div className="form-control w-full max-w-xs">
              <label className="label cursor-pointer">
                <span className="label-text">Trusted contact</span>
                <input type="checkbox" className="toggle" />
              </label>
            </div>
            <button
              className="btn btn-primary w-full max-w-xs"
              onClick={onAddNewContact}
            >
              Save
            </button>
          </div>
        )}
        {/* contacts */}
        <ul className="space-y-2">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => {
              return (
                <li
                  className="bg-stone-600 w-full rounded-full px-10 py-1"
                  onClick={() => showMessagesForSelectedContact(index)}
                  key={index}
                >
                  {contact.alias}
                </li>
              );
            })
          ) : (
            <div className="mx-auto py-5 text-sm">
              No contacts found locally. Try adding a new one!
            </div>
          )}
        </ul>
      </div>
      <div className="divider divider-horizontal"></div>
      {/* messages */}
      {selectedContactIndex < 0 ? (
        <div className="flex flex-col flex-grow items-center justify-center">
          <img src="/privy-logo.png" alt="Image not found" />
        </div>
      ) : (
        <div className="flex flex-grow flex-col">
          <div className="flex flex-grow flex-col space-y-2 p-20 bg-base-200">
            <ul className="space-y-1">
              {messages.map((msg, index) => {
                return (
                  <li key={index}>
                    {msg.from == contacts[selectedContactIndex].alias ? (
                      <div className="flex flex-row space-x-2 justify-start">
                        <div className="w-fit bg-stone-700 p-3 rounded-xl text-sm text-white">
                          {msg.content}
                        </div>

                        <div className="text-xs text-stone-400">
                          {new Date(
                            parseInt(msg.timestamp)
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-row space-x-2 justify-end">
                        <div className="w-fit bg-stone-700 p-3 rounded-xl text-sm text-white">
                          {msg.content}
                        </div>

                        <div className="text-xs text-stone-400">
                          {new Date(
                            parseInt(msg.timestamp)
                          ).toLocaleTimeString()}
                        </div>
                      </div>
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
              className="btn btn-md btn-wide btn-active btn-ghost"
              onClick={onSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
