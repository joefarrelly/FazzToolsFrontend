import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Auth from 'pages/Auth';
import AuthRedirect from 'pages/AuthRedirect';
import Account from 'pages/Account';
import Gear from 'pages/Gear';
import Profession from 'pages/Profession';
import Mount from 'pages/Mount';
import Pet from 'pages/Pet';
import Achievement from 'pages/Achievement';
import Reputation from 'pages/Reputation';
import MythicPlus from 'pages/MythicPlus';
import Logout from 'pages/Logout';
import SingleProfession from 'pages/SingleProfession';
import SingleGear from 'pages/SingleGear';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Account />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/redirect" element={<AuthRedirect />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/profession" element={<Profession />} />
        <Route path="/mount" element={<Mount />} />
        <Route path="/pet" element={<Pet />} />
        <Route path="/achievement" element={<Achievement />} />
        <Route path="/reputation" element={<Reputation />} />
        <Route path="/mythicplus" element={<MythicPlus />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profession/:alt/:realm/:profession" element={<SingleProfession />} />
        <Route path="/gear/:alt/:realm" element={<SingleGear />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
