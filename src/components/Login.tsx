import { KeyboardEvent, useEffect, useState } from "react";
import axios from "axios";
import { routerApiUrl } from "../store";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";
import { usePromiseTracker } from "react-promise-tracker";
import LoginNavbar from "./LoginNavbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate();
  const { promiseInProgress } = usePromiseTracker();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${routerApiUrl}/auth/whoami`, {
          validateStatus: (status) => true,
        });
        if (res.status === 200) {
          // someone already logged in, redirect
          navigate("/messages");
        } else if (res.status === 404) {
          await fetchAccounts();
        }
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          if (error.code === "ERR_NETWORK") {
            displayError(
              "Privy Router is not accessible! Check if it is up and running first."
            );
          }
        }
      }
    })();
  }, [navigate]);

  async function fetchAccounts() {
    try {
      const res = await axios.get(`${routerApiUrl}/account/ls`);
      switch (res.status) {
        case 200:
          setLocalUsers(res.data);
          break;
        default:
          console.log(res.status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onAccountSelected(index: number) {
    setPassword("");
    setUsername(localUsers[index].username);
  }

  async function onLogin() {
    try {
      const res = await axios.post(
        `${routerApiUrl}/auth/login`,
        {
          username: username,
          mnemonic: password,
        },
        { validateStatus: (status) => true }
      );
      switch (res.status) {
        case 200:
          displaySuccess(`Logged in as ${username}!`);
          localStorage.setItem("username", username);
          navigate("/messages");
          break;
        case 404:
          displayError(
            `No such user found: ${username}! Try importing it first!`
          );
          break;
        case 401:
          setPassword("");
          displayError(`The password does not match!`);
          break;
        default:
          displayError("Something went wrong, try again later!");
      }
    } catch (error) {
      displayError("Something went wrong, try again later!");
    }
  }

  async function onAddAccount() {
    try {
      const res = await trackPromise(
        axios.post(`${routerApiUrl}/account/add`, {
          username: username,
          mnemonic: password,
        })
      );
      switch (res.status) {
        case 200:
          displaySuccess("Account has been imported successfully!");
          setUsername("");
          setPassword("");
          await fetchAccounts();
          break;
        default:
          displayError("Something went wrong, try again later!");
      }
    } catch (error) {
      displayError("Something went wrong, try again later!");
    }
  }

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

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      if (
        localUsers.map((user) => user.username).includes(username) &&
        password.length > 0
      ) {
        onLogin();
      }
    }
  };

  return (
    <div
      className="flex flex-col bg-gradient-to-b from-black to-stone-800 min-h-screen"
      onKeyUp={handleKeypress}
    >
      <LoginNavbar />
      <div className="flex justify-center space-x-3 pt-20">
        {localUsers.length > 0 ? (
          localUsers.map((user, index) => {
            return (
              <div className="avatar placeholder" key={index}>
                <div className="bg-stone-200 text-black rounded-full w-24">
                  <button
                    className="text-3xl"
                    onClick={() => onAccountSelected(index)}
                  >
                    {user.username[0]}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="mx-auto py-5 text-md">
            No accounts found locally. Create or import one!
          </div>
        )}
      </div>
      <div className="form-control flex-grow w-full max-w-md p-10 space-y-5 mx-auto">
        <input
          type="text"
          className="input input-bordered input-white w-full max-w-md"
          placeholder="Username"
          onInput={(e) =>
            setUsername((e.target as HTMLInputElement).value ?? "")
          }
          value={username}
        />
        <input
          type="password"
          className="input input-bordered input-white w-full max-w-md"
          placeholder="Password"
          title="At least one capital letter, at least one digit, minimum 8 characters"
          onInput={(e) =>
            setPassword((e.target as HTMLInputElement).value ?? "")
          }
          value={password}
        />
        <LoadingIndicator width={200} />
        <div className="flex justify-center space-x-2">
          {localUsers.map((user) => user.username).includes(username) ? (
            <button
              className="btn hover:bg-white text-black bg-green-400"
              disabled={!(username.length > 0 && password.length > 0)}
              onClick={onLogin}
            >
              Login
            </button>
          ) : (
            <></>
          )}
          {!localUsers.map((user) => user.username).includes(username) ? (
            <button
              className="btn hover:bg-white text-black bg-stone-400"
              disabled={!(username.length > 0)}
              onClick={onAddAccount}
              style={{ display: !promiseInProgress ? "block" : "none" }}
            >
              Import account
            </button>
          ) : (
            <></>
          )}
        </div>
        <button
          className="text-center underline"
          onClick={() => navigate("/register")}
        >
          Create new account
        </button>
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
      </div>
      <Footer />
    </div>
  );
}
