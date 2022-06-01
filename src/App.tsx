import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

export default function App() {
  
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <div className="hero flex-grow bg-base-200 content-center">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Privy!</h1>
            <p className="py-6">
              Privy Messenger is a fully distributed, peer to peer, end to end encrypted messaging application. Take privacy in your own hands and join 
              the distributed future now!
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/login")}>Get Started</button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
