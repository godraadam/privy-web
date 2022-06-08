import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-gradient-to-b from-black to-zinc-700 relative">
      <button
        className="btn btn-ghost absolute top-10 right-10 normal-case"
        onClick={() => navigate("/login")}
      >
        Log in or Sign up
      </button>
      <div className="flex flex-col justify-center items-center">
        <div className="text-center py-40">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Privy!</h1>
            <p className="py-6">
              Privy Messenger is a fully distributed, peer to peer, end to end
              encrypted messaging application. Take privacy in your own hands
              and join the distributed future now!
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/help")}>Get Started</button>
          </div>
        </div>
      </div>
      <div className="p-20">
        <div className="flex flex-col items-end p-10">
          <div className="max-w-xl w-full">
            <h1 className="text-5xl font-bold">Peer to peer</h1>
            <p className="py-6 text-right">
              In a peer to peer network, there are no servers or clients, all
              nodes are equal. This eliminates the need for a central, privately
              owned datacenter, giving the control over private data back to the
              users.
            </p>
          </div>
        </div>
        <div className="p-10">
          <div className="max-w-xl w-full">
            <h1 className="text-5xl font-bold">End to end encrypted</h1>
            <p className="py-6">
              End to end encrypted messaging means that once the message leaves
              your computer, until the moment it arrives to the recipient, it is
              encrypted, and digitally signed, to make sure nobody can read it
              and nobody can change it.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end p-10">
          <div className="max-w-xl w-full">
            <h1 className="text-5xl font-bold">Open source</h1>
            <p className="py-6 text-right">
              The entire source code behind Privy is available on{" "}
              <a className="link" href="//github.com/godraadam">
                Github
              </a>
              . You are welcome to see, build and improve the application for
              yourself. Privy was built in the open using open source
              components, and in turn Privy is open for forks, improvements, and
              peer review.
            </p>
          </div>
        </div>
        <div className="p-10">
          <div className="max-w-xl w-full">
            <h1 className="text-5xl font-bold">Free for all</h1>
            <p className="py-6">
              Privy is peer to peer, and user data is stored on user and trusted
              devices. This means that the Privy ecosystem does not need any
              datacenters, nor servers, nor any type of instrastucture. The
              system is sustained by you, the users. Privy is free to use and
              will remain so forever.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
