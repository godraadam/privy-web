import axios from "axios";
import { useState } from "react";
import { routerApiUrl } from "../store";
import LoginNavbar from "./LoginNavbar";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { useNavigate } from "react-router-dom";
import {saveAs} from "file-saver"

export const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  const navigate = useNavigate();
  const { promiseInProgress } = usePromiseTracker();

  function displayError(error: string) {
    setShowSuccess(false);
    setShowError(true);
    setAlertMessage(error);
    setTimeout(() => setShowError(false), 4000);
  }

  function displaySuccess(msg: string) {
    setShowSuccess(true);
    setShowError(false);
    setAlertMessage(msg);
    setTimeout(() => setShowSuccess(false), 4000);
  }

  function onCopyClicked() {
    if (mnemonic.length < 0) {
      return;
    }
    navigator.clipboard.writeText(mnemonic);

    /* Alert the copied text */
    displaySuccess("Passphrase copied!");
  }
  
  function onSaveClicked() {
    if (mnemonic.length < 0) {
        return;
      }
      const blob = new Blob([mnemonic], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "privy-passphrase.txt")
  }

  async function onCreateAccount() {
    setUsername("");
    try {
      const res = await trackPromise(
        axios.post(`${routerApiUrl}/account/create`, {
          username: username,
        })
      );
      switch (res.status) {
        case 200:
          displaySuccess("Account has been created successfully!");
          // display words
          setMnemonic(res.data.mnemonic);
          break;
        case 409:
          displayError(
            "An account with this username already exists on this device!"
          );
          break;
        default:
          displayError("Something went wrong, try again later!");
      }
    } catch (error) {
      displayError("Something went wrong, try again later!");
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-b from-black to-stone-800 min-h-screen">
      <LoginNavbar />
      <div className="form-control flex-grow w-full max-w-md lg:max-w-lg xl:max-w-xl p-10 space-y-5 mx-auto">
        <span className="font-semibold text-lg">
          Choose a username. This username is only to identify your account on
          this device, and must not be the same on every device.
        </span>
        <input
          type="text"
          className="input input-bordered input-white w-full max-w-md"
          placeholder="Username"
          onInput={(e) =>
            setUsername((e.target as HTMLInputElement).value ?? "")
          }
          value={username}
        />
        <button
          className="btn hover:bg-white text-black bg-stone-400"
          disabled={!(username.length > 0)}
          onClick={onCreateAccount}
          style={{ display: !promiseInProgress ? "block" : "none" }}
        >
          Create account
        </button>

        {mnemonic.length > 0 ? (
          <>
            <h3 className=" text-center font-bold text-lg uppercase pt-4">
              Your passphrase:
            </h3>
            <p className="py-4  text-red-300">
              This is your passphrase. Keep it secret at all times. If you
              forget it/lose it, you will not be able to recover it, so save it
              somwehere safe!
            </p>
            <div className="whitespace-nowrap text-zinc-400 font-mono overflow-x-scroll max-w-md">
              {mnemonic}
            </div>
            <div className="flex gap-3 justify-center">
              <button className="btn btn-sm" onClick={onCopyClicked}>
                Copy
              </button>
              <button className="btn btn-sm" onClick={onSaveClicked}>Download</button>
            </div>
          </>
        ) : (
          <></>
        )}
        <div
          className="alert alert-success shadow-lg "
          style={{ display: showSuccess ? "block" : "none" }}
        >
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
            <span>{alertMessage}</span>
          </div>
        </div>
        <div
          className="alert alert-error shadow-lg"
          style={{ display: showError ? "block" : "none" }}
        >
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
            <span>{alertMessage}</span>
          </div>
        </div>
      <button className="text-center underline" onClick={() => navigate("/login")}> Back to login</button>
      </div>
    </div>
  );
};
