import { useEffect, useState } from "react";
import axios from "axios";
import { routerApiUrl } from "../store";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localUsers, setLocalUsers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${routerApiUrl}/account/ls`);
      setLocalUsers(res.data);
    })();
  });

  async function onLogin() {}

  async function onAddAccount() {
    try {
      const res = await axios.post(`${routerApiUrl}/account/add`, {
        username: username,
        password: password,
      });
      switch (res.status) {
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onCreateAccount() {
    try {
      const res = await axios.post(`${routerApiUrl}/account/create`, {
        username: username,
        password: password,
      });
      switch (res.status) {
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="">
      <div className="navbar bg-primary">
        <a className="btn btn-ghost normal-case text-xl">privy</a>
      </div>
      <div className="flex flex-col mx-auto">
        {localUsers.length > 0
          ? localUsers.map((user, index) => {
              return (
                <div className="avatar placeholder mx-auto" key={index}>
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                    <button className="text-3xl" onClick={onLogin}>
                      {user.username[0]}
                    </button>
                  </div>
                </div>
              );
            })
          : "No accounts found locally. Create or import one!"}
      </div>
      <div className="form-control w-full max-w-xs p-10 space-y-5 mx-auto">
        <input
          type="text"
          className="input input-bordered input-primary w-full max-w-xs"
          placeholder="Username"
          onInput={(e) =>
            setUsername((e.target as HTMLInputElement).value ?? "")
          }
        />
        <input
          type="password"
          className="input input-bordered input-primary w-full max-w-xs"
          placeholder="Password"
          onInput={(e) =>
            setPassword((e.target as HTMLInputElement).value ?? "")
          }
        />
        <button
          className="btn btn-primary"
          disabled={!(username.length > 0 && password.length > 0)}
          onClick={onAddAccount}
        >
          Import account
        </button>
        <button
          className="btn btn-secondary"
          disabled={!(username.length > 0 && password.length > 0)}
          onClick={onCreateAccount}
        >
          Create account
        </button>
      </div>
    </div>
  );
}
