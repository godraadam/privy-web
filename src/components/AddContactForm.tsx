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

  async function onAddNewContact() {
    try {
      const res = await axios.post(`${routerApiUrl}/contact/add`, {
        alias: newContactAlias,
        pubkey: newContactPubKey,
        trusted: false,
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
        className="flex flex-row justify-center gap-3 border border-stone-500 rounded-full py-3 max-w-md hover:bg-stone-500 text-normal"
        onClick={() => setShowContactForm(!showContactForm)}
      >
        Add contact
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M8.602 3.7c-1.154 1.937-.635 5.227 1.424 9.025.93 1.712.697 3.02.338 3.815-.982 2.178-3.675 2.799-6.525 3.456-1.964.454-1.839.87-1.839 4.004h-1.995l-.005-1.241c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418-4.733-8.729-1.35-13.678 3.732-13.678 3.321 0 5.97 2.117 5.97 6.167 0 3.555-1.949 6.833-2.383 7.833h-2.115c.392-1.536 2.499-4.366 2.499-7.842 0-5.153-5.867-4.985-7.369-2.458zm15.398 15.8c0 2.485-2.017 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.017-4.5 4.5-4.5 4.5 2.015 4.5 4.5zm-2-.5h-2v-2h-1v2h-2v1h2v2h1v-2h2v-1z" />
        </svg>
      </button>
      {showContactForm && (
        <div className="w-full max-w-md p-2 space-y-2 ">
          <input
            type="text"
            className="input input-bordered input-white w-full max-w-md"
            placeholder="Alias"
            onInput={(e) =>
              setNewContactAlias((e.target as HTMLInputElement).value ?? "")
            }
            value={newContactAlias}
          />
          <input
            type="text"
            className="input input-bordered input-white w-full max-w-md"
            placeholder="Public key"
            onInput={(e) =>
              setNewContactPubKey((e.target as HTMLInputElement).value ?? "")
            }
            value={newContactPubKey}
          />
          <div className="form-control w-full max-w-md">
            <label className="label cursor-pointer">
              <span className="label-text">Trusted contact</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
          <button
            className="btn btn-primary w-full max-w-md"
            onClick={onAddNewContact}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
