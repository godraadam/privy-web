import axios from "axios";
import { useState } from "react";
import { routerApiUrl } from "../store";

interface AddContactFormProps {
  f: () => Promise<void>;
}

export default function AddContactForm(props: AddContactFormProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContactAlias, setNewContactAlias] = useState("");
  const [newContactPubKey, setNewContactPubKey] = useState("");
  const [newContactTrusted, setNewContactTrusted] = useState(false);

  async function onAddNewContact() {
    try {
      const res = await axios.post(`${routerApiUrl}/contact/add`, {
        alias: newContactAlias,
        pubkey: newContactPubKey,
        trusted: newContactTrusted,
      });
      switch (res.status) {
      }
      await props.f();
      setNewContactAlias("");
      setNewContactPubKey("");
    } catch (error) {}
  }

  return (
    <>
      <button
        className="flex border-none flex-row justify-between text-white text-sm px-5 items-center gap-3 border border-stone-500 rounded-full py-3 max-w-sm hover:bg-stone-600 text-normal"
        onClick={() => setShowContactForm(!showContactForm)}
      >
        Add contact
        {!showContactForm ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M24 12c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm-18.005-1.568l1.415-1.414 4.59 4.574 4.579-4.574 1.416 1.414-5.995 5.988-6.005-5.988z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 7.58l5.995 5.988-1.416 1.414-4.579-4.574-4.59 4.574-1.416-1.414 6.006-5.988z" />
          </svg>
        )}
      </button>
      {showContactForm && (
        <div className="w-full max-w-sm p-2 space-y-2 ">
          <input
            type="text"
            className="input input-bordered input-white w-full max-w-sm"
            placeholder="Alias"
            onInput={(e) =>
              setNewContactAlias((e.target as HTMLInputElement).value ?? "")
            }
            value={newContactAlias}
          />
          <input
            type="text"
            className="input input-bordered input-white w-full max-w-sm"
            placeholder="Public key"
            onInput={(e) =>
              setNewContactPubKey((e.target as HTMLInputElement).value ?? "")
            }
            value={newContactPubKey}
          />
          <div className="form-control w-full max-w-sm">
            <label className="label cursor-pointer">
              <span className="label-text">Trusted contact</span>
              <input
                type="checkbox"
                className="toggle"
                onClick={() => setNewContactTrusted(!newContactTrusted)}
              />
            </label>
          </div>
          <button
            className="btn btn-primary w-full max-w-sm"
            onClick={onAddNewContact}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
