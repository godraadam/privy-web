import { useEffect, useState } from "react";
import axios from "axios";
import { routerApiUrl } from "../store";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [showSuccessAccount, setShowSuccessAccount] = useState(false);
  const [showErrorAccount, setShowErrorAccount] = useState(false);
  const [accountStateMessage, setAccountStateMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${routerApiUrl}/auth/whoami`, {
        validateStatus: (status) => true,
      });
      if (res.status === 200) {
        // someone already logged in, redirect
        navigate("/messages");
      } else if (res.status === 404) {
        await fetchAccounts();
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
      const res = await axios.post(`${routerApiUrl}/auth/login`, {
        username: username,
        password: password,
      });
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
        default:
          displayError("Something went wrong, try again later!");
      }
    } catch (error) {
      displayError("Something went wrong, try again later!");
    }
  }

  async function onAddAccount() {
    try {
      const res = await axios.post(`${routerApiUrl}/account/add`, {
        username: username,
        password: password,
      });
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

  async function onCreateAccount() {
    try {
      const res = await axios.post(`${routerApiUrl}/account/create`, {
        username: username,
        password: password,
      });
      switch (res.status) {
        case 200:
          displaySuccess("Account has been created successfully!");
          setUsername("");
          setPassword("");
          await fetchAccounts();
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

  function displayError(error: string) {
    setShowSuccessAccount(false);
    setShowErrorAccount(true);
    setAccountStateMessage(error);
  }

  function displaySuccess(msg: string) {
    setShowSuccessAccount(true);
    setShowErrorAccount(false);
    setAccountStateMessage(msg);
  }

  return (
    <div className="flex flex-col bg-black min-h-screen">
      <Navbar />
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
          onInput={(e) =>
            setPassword((e.target as HTMLInputElement).value ?? "")
          }
          value={password}
        />
        <div className="flex justify-center space-x-2">
          {localUsers.map(user => user.username).includes(username) ? (
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
          {!localUsers.map(user => user.username).includes(username) ? (
            <>
              <button
                className="btn hover:bg-white text-black bg-stone-400"
                disabled={!(username.length > 0 && password.length > 0)}
                onClick={onAddAccount}
              >
                Import account
              </button>
              <button
                className="btn hover:bg-white text-black bg-stone-400"
                disabled={!(username.length > 0 && password.length > 0)}
                onClick={onCreateAccount}
              >
                Create account
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        <div
          className="alert alert-success shadow-lg "
          style={{ display: showSuccessAccount ? "block" : "none" }}
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
            <span>{accountStateMessage}</span>
          </div>
        </div>
        <div
          className="alert alert-error shadow-lg"
          style={{ display: showErrorAccount ? "block" : "none" }}
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
            <span>{accountStateMessage}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
