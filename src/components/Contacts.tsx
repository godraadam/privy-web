import axios from "axios";
import { useEffect, useState } from "react";
import { PrivyContact } from "../models/privyContact";
import { PrivyMessage } from "../models/privyMessage";
import { routerApiUrl } from "../store";
import AddContactForm from "./AddContactForm";
import Contact from "./Contact";

interface ContacsProps {
  setSelectedContact: (contact: PrivyContact) => void;
}

export default function Contacts(props: ContacsProps) {
  const [contacts, setContacts] = useState<Array<PrivyContact>>([]);

  useEffect(() => {
    (async () => fetchContacts())();
  }, []);

  async function fetchContacts() {
    try {
      const res = await axios.get(`${routerApiUrl}/contact/ls`);
      setContacts(res.data as Array<PrivyContact>);
    } catch (error) {}
  }

  return (
    <div className="flex flex-col max-w-md space-y-2 px-6 w-full pt-5 bg-base-200 border-stone-600 border-r">
      <AddContactForm f={fetchContacts} />
      {/* contacts */}
      <div className="divider"></div>
      <h1 className="text-xl font-bold">Contacts</h1>
      <ul className="space-y-2">
        {contacts.length > 0 ? (
          contacts.map((contact, index) => {
            return (
              <Contact
                index={index}
                contact={contact}
                onClick={() => props.setSelectedContact(contact)}
              />
            );
          })
        ) : (
          <div className="mx-auto py-5 text-sm">
            No contacts found locally. Try adding a new one!
          </div>
        )}
      </ul>
    </div>
  );
}
