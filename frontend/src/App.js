// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AdminPage from './pages/admin/AdminPage';
import AdminChampions from './pages/admin/AdminChampions';
import AdminTraits from './pages/admin/AdminTraits';
import ErrorPage from './error-page';
import Header from 'components/Header';
import './css/ChampionsList.css';
import './css/style.css';

import { useState, useEffect } from 'react';
import ProtectedRoutes from 'utils/ProtectedRoutes';
import axios from 'axios';

function App() {
  // store username/admin name
  const [token, setToken] = useState('');
  // switch login/logout button
  const [showLogin, setShowLogin] = useState(true);
  // to switch text in the header for admin
  const [backToAdmin, setBackToAdmin] = useState(false);
  
  const clickToHomePage = () => {
    setBackToAdmin(true);
  };
  
  return (
    <div className="background">
        <Router>
          <Header showLogin={showLogin} setShowLogin={setShowLogin} backToAdmin={backToAdmin} setBackToAdmin={setBackToAdmin} token={token} setToken={setToken}/>
          <Routes>
       
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage clickToHomePage={clickToHomePage} token={token} setToken={setToken}/>}>
                <Route path="/admin/champions" element={<AdminChampions />} />
                <Route path="/admin/traits" element={<AdminTraits />} />
            </Route>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
