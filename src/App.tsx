import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from 'pages/Home';
import Auth from 'pages/Auth';
import AuthRedirect from 'pages/AuthRedirect';
import Account from 'pages/Account';
import Keybind from 'pages/Keybind';
import Gear from 'pages/Gear';
import Profession from 'pages/Profession';
import Mount from 'pages/Mount';
import Pet from 'pages/Pet';
import Logout from 'pages/Logout';
import SingleKeybind from 'pages/SingleKeybind';
import SingleProfession from 'pages/SingleProfession';
import SingleGear from 'pages/SingleGear';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/redirect" element={<AuthRedirect />} />
        <Route path="/account" element={<Account />} />
        <Route path="/keybind" element={<Keybind />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/profession" element={<Profession />} />
        <Route path="/mount" element={<Mount />} />
        <Route path="/pet" element={<Pet />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/keybind/:alt/:realm/:spec" element={<SingleKeybind />} />
        <Route path="/profession/:alt/:realm/:profession" element={<SingleProfession />} />
        <Route path="/gear/:alt/:realm" element={<SingleGear />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
