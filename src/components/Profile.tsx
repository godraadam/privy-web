import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { routerApiUrl } from "../store";

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  async function onLogout() {
    // send logout request to router
    const res = await axios.post(`${routerApiUrl}/auth/logout`);
    switch (res.status) {
      case 200:
        navigate("/login");
        break;
    }
  }

  function onCopyClicked() {
    navigator.clipboard.writeText(searchParams.get("pubkey") ?? "");

    /* Alert the copied text */
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <div className="navbar flex flex-row min-w-screen border-stone-600 border-b">
        <button
          className="btn flex flex-row gap-3"
          onClick={(e) => navigate("/messages")}
        >
          <svg
            clip-rule="evenodd"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="white"
          >
            <path
              d="m9.474 5.209s-4.501 4.505-6.254 6.259c-.147.146-.22.338-.22.53s.073.384.22.53c1.752 1.754 6.252 6.257 6.252 6.257.145.145.336.217.527.217.191-.001.383-.074.53-.221.293-.293.294-.766.004-1.057l-4.976-4.976h14.692c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-14.692l4.978-4.979c.289-.289.287-.761-.006-1.054-.147-.147-.339-.221-.53-.221-.191-.001-.38.071-.525.215z"
              fill-rule="nonzero"
            />
          </svg>
          Back
        </button>
        <h1 className="text-2xl mx-auto font-bold">Privy</h1>
        <div className="bg-base-100 justify-end my-2">
          <div className="dropdown">
            <button className="flex flex-row border border-stone-700 rounded-full px-5 py-1 normal-case text-md">
              <svg
                clip-rule="evenodd"
                fill-rule="evenodd"
                width="24"
                height="24"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                fill="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z" />
              </svg>
            </button>
            <ul className="dropdown-content menu p-1 shadow bg-stone-800 rounded-box min-w-md">
              <li>
                <button onClick={onLogout}>
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="white"
                  >
                    <path d="M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-grow bg-base-200 justify-center py-10">
        <div className="text-center">
          <div className="max-w-md space-y-10">
            <h1 className="text-5xl font-bold">Profile</h1>
            <div className="stats bg-stone-800">
              <div className="stat content-start">
                <div className="stat-title">User name</div>
                <div className="stat-value text-2xl">
                  {searchParams.get("username")}
                </div>
              </div>

              <div className="stat content-start">
                <div className="stat-title">Public Key</div>
                <div className="stat-value text-lg truncate">
                  {searchParams.get("pubkey")}
                </div>
                <div className="stat-actions space-x-5">
                  <button className="btn btn-sm" onClick={onCopyClicked}>
                    Copy
                  </button>
                  <button className="btn btn-sm">Share</button>
                </div>
              </div>
            </div>
            {showAlert && (
              <div className="alert alert-success shadow-lg">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
