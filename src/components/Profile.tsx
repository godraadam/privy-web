import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import QRCode from "react-qr-code";
import ProfileNavbar from "./ProfileNavbar";
import axios from "axios";
import { routerApiUrl } from "../store";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [showAlert, setShowAlert] = useState(false);
  const [contactTrusted, setContactTrusted] = useState(
    searchParams.get("trusted") === "true"
  );
  const [proxy, setProxy] = useState(searchParams.get("proxy") === "true");
  const [editingAlias, setEditingAlias] = useState(false);
  const [newAlias, setNewAlias] = useState(searchParams.get("username") ?? "");

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
  
  async function onAddProxyClicked() {
    setProxy(!proxy);
    try {
      const alias = searchParams.get("username");
      if (!alias) {
        return;
      }
      const res = await trackPromise(axios.post(`${routerApiUrl}/account/add-proxy/${alias}`));
      navigate("/messages");
    } catch (error) {
      console.log(error);
    }
  }

  function onCopyClicked() {
    navigator.clipboard.writeText(searchParams.get("pubkey") ?? "");

    /* Alert the copied text */
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }

  async function onDeleteContactClicked() {
    const alias = searchParams.get("username");
    if (!alias) {
      return;
    }
    try {
      const res = await axios.delete(`${routerApiUrl}/contact/rm/${alias}`);
      navigate("/messages");
    } catch (error) {
      console.error(error);
    }
  }

  async function onDeleteConversationClicked() {
    const alias = searchParams.get("username");
    if (!alias) {
      return;
    }
    try {
      const res = await axios.delete(
        `${routerApiUrl}/message/rm/all-with/${alias}`
      );
      navigate("/messages");
    } catch (error) {
      console.error(error);
    }
  }

  async function onDeleteAccountLocallyClicked() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (!username || !password) {
      // shouldn't be here, so redirect
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(`${routerApiUrl}/account/remove-locally`, {
        username: username,
        mnemonic: password,
      });
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  async function onDeleteAccountPermanentlyClicked() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (!username || !password) {
      // shouldn't be here, so redirect
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${routerApiUrl}/account/remove-permanently`,
        {
          username: username,
          mnemonic: password,
        }
      );
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  async function onSaveChangesClicked() {
    try {
      const alias = searchParams.get("username");
      if (!alias) {
        return;
      }
      const res = await axios.put(`${routerApiUrl}/contact/${alias}`, {
        alias: newAlias,
        trusted: contactTrusted,
      });
      setEditingAlias(false);
      navigate("/messages");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-zinc-800">
      <ProfileNavbar
        contactAlias={searchParams.get("username") ?? ""}
        self={!searchParams.get("contact")}
      />

      <div className="flex flex-col space-y-4 flex-grow justify-center items-center">
        <div className="card lg:card-side bg-stone-800 shadow-xl">
          <div className="flex p-5 bg-white items-center rounded-xl">
            <QRCode value={searchParams.get("pubkey") ?? ""} />
          </div>
          <div className="card-body pl-10 space-y-5">
            <div className="flex flex-row space-x-3 items-center">
              <h2 className="card-title w-32">Public key:</h2>
              <div className="whitespace-nowrap text-zinc-400 font-mono overflow-x-scroll max-w-md">
                {searchParams.get("pubkey") ?? ""}
              </div>
              <button className="" onClick={onCopyClicked}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 17v-21h21v2h-19v19h-2z" />
                </svg>
              </button>
            </div>
            {searchParams.get("contact") ? (
              <>
                <div className="flex flex-row space-x-2 items-center">
                  <h2 className="card-title w-36">Alias:</h2>
                  <input
                    type="text"
                    className={
                      !editingAlias
                        ? "bg-inherit w-full py-1 pl-2 text-zinc-400 font-mono"
                        : "w-full outline-none bg-zinc-700 rounded-full py-1 pl-2 text-zinc-400 font-mono"
                    }
                    value={newAlias}
                    disabled={!editingAlias}
                    onChange={(e) => {
                      setNewAlias((e.target as HTMLInputElement).value);
                    }}
                  />
                  <button
                    onClick={() => {
                      setEditingAlias(!editingAlias);
                      setNewAlias(searchParams.get("username") ?? "");
                    }}
                  >
                    {!editingAlias ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="White"
                      >
                        <path d="M19.769 9.923l-12.642 12.639-7.127 1.438 1.438-7.128 12.641-12.64 5.69 5.691zm1.414-1.414l2.817-2.82-5.691-5.689-2.816 2.817 5.69 5.692z" />
                      </svg>
                    ) : (
                      <svg
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                        stroke-linejoin="round"
                        stroke-miterlimit="2"
                        viewBox="0 0 24 24"
                        width={20}
                        height={20}
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <h2 className="card-title w-48">Trusted peer:</h2>
                  <div className="text-zinc-400 font-mono w-full">
                    {contactTrusted ? "Yes" : "No"}
                  </div>
                  <label className="label cursor-pointer justify-center">
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      checked={contactTrusted}
                      onClick={() => {
                        setContactTrusted(!contactTrusted);
                      }}
                    />
                  </label>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <h2 className="card-title w-48">Proxy peer:</h2>
                  <div className="text-zinc-400 font-mono w-full">
                    {proxy ? "Yes" : "No"}
                  </div>
                  {!proxy && (
                    <label className="label cursor-pointer justify-center">
                      <button
                        onClick={onAddProxyClicked}
                      >
                        <svg
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                          stroke-linejoin="round"
                          stroke-miterlimit="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-white w-8 h-8"
                        >
                          <path
                            d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                            fill-rule="nonzero"
                          />
                        </svg>
                      </button>
                    </label>
                  )}
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <h2 className="card-title w-full text-red-400">
                    Delete contact:
                  </h2>
                  <label htmlFor="my-modal" className="modal-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M21 6l-3 18h-12l-3-18h2.028l2.666 16h8.611l2.666-16h2.029zm-4.711-4c-.9 0-1.631-1.099-1.631-2h-5.316c0 .901-.73 2-1.631 2h-5.711v2h20v-2h-5.711z" />
                    </svg>
                  </label>
                </div>
                <button
                  className="btn"
                  onClick={onSaveChangesClicked}
                  disabled={
                    !(
                      newAlias !== searchParams.get("username") ||
                      contactTrusted !==
                        (searchParams.get("trusted") === "true")
                    )
                  }
                >
                  Save changes
                </button>
              </>
            ) : (
              <div className="flex flex-row space-x-2 items-center">
                <h2 className="card-title w-full text-red-400">
                  Delete account:
                </h2>
                <label htmlFor="my-modal2" className="modal-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M21 6l-3 18h-12l-3-18h2.028l2.666 16h8.611l2.666-16h2.029zm-4.711-4c-.9 0-1.631-1.099-1.631-2h-5.316c0 .901-.73 2-1.631 2h-5.711v2h20v-2h-5.711z" />
                  </svg>
                </label>
              </div>
            )}
          </div>
          <LoadingIndicator width={200}/>
        </div>
        {showAlert ? (
          <div className="alert alert-success shadow-lg max-w-md">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Public key copied!</span>
            </div>
          </div>
        ) : (
          <div className="h-14"></div>
        )}
      </div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal ">
        <div className="modal-box bg-stone-800 shadow-xl">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg text-red-500">Delete contact</h3>
          <p className="py-4">
            {`Are you sure you want to remove ${
              searchParams.get("username") ?? ""
            } from your contact list? By default this will not delete the conversation, only the contact. Deleted conversations cannot be restored!`}
          </p>
          <div className="modal-action">
            <label
              htmlFor="my-modal"
              className="btn btn-sm"
              onClick={onDeleteContactClicked}
            >
              Delete contact
            </label>
            <label
              htmlFor="my-modal"
              className="btn btn-error btn-sm"
              onClick={onDeleteConversationClicked}
            >
              Delete conversation
            </label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="my-modal2" className="modal-toggle" />
      <div className="modal ">
        <div className="modal-box bg-stone-800 shadow-xl">
          <label
            htmlFor="my-modal2"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg text-red-500">Delete account</h3>
          <p className="py-4">
            Deleting the account from this machine will preserve your data on
            other devices and you can import the account on this device again.
            Deleting the account permanently will remove the account from all
            devices together with all messages sent or received.
          </p>
          <div className="modal-action">
            <label
              htmlFor="my-modal2"
              className="btn btn-sm"
              onClick={onDeleteAccountLocallyClicked}
            >
              Delete locally
            </label>
            <label
              htmlFor="my-modal2"
              className="btn btn-error btn-sm"
              onClick={onDeleteAccountPermanentlyClicked}
            >
              Delete permanently
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
