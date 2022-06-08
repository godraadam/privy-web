import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './components/Login';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Help from './components/Help';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="messages" element={<Messages />} />
      <Route path="profile" element={<Profile />} />
      <Route path="help" element={<Help />} />
    </Routes>
  </BrowserRouter>
);

