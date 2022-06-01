import axios from "axios";
import { useEffect, useState } from "react";
import { PrivyContact } from "../models/privyContact";
import { routerApiUrl } from "../store";

export default function Messages({ user }: any) {
  const [contacts, setContacts] = useState<Array<PrivyContact>>([]);
  const [newContactAlias, setNewContactAlias] = useState("");
  const [newContactPubKey, setNewContactPubKey] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    (async () => fetchContacts())();
  }, []);

  async function fetchContacts() {
    try {
      const res = await axios.get(`${routerApiUrl}/contact/ls`);
      setContacts(res.data as Array<PrivyContact>);
    } catch (error) {}
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

  return (
    <div className="flex">
      <div className="flex flex-col space-y-2 p-20">
        <button
          className="btn btn-ghost w-full max-w-xs"
          onClick={() => setShowContactForm(!showContactForm)}
        >
          Add contact
        </button>
        {showContactForm && (
          <div className="p-2">
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
        <ul className="space-y-2">{
        contacts.length > 0 ? (
          contacts.map((contact, index) => {
            return (
              <li className="bg-stone-600 w-full rounded-full px-10 py-1">{contact.alias}</li>
            );
          })
        ) : (
          <div className="mx-auto py-5 text-xl">
            No contacts found locally. Try adding a new one!
          </div>
        )}
        </ul>
      </div>
    </div>
  );
}
