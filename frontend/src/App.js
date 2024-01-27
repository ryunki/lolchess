// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {RecoilRoot,atom,selector,useRecoilState,useRecoilValue} from 'recoil';


import Home from './pages/Home';
import AdminPage from './pages/admin/AdminPage';
import AdminChampions from './pages/admin/AdminChampions';
import AdminTraits from './pages/admin/AdminTraits';
import ErrorPage from './error-page';
import Header from 'components/Header';
import './css/ChampionsList.css';
import './css/style.css';

import { useState, useEffect } from 'react';

function App() {
  // to switch text in the header for admin
  const [backToAdmin, setBackToAdmin] = useState(false);
  
  const clickToHomePage = () => {
    setBackToAdmin(true);
  };
  
  return (
    <div className="background">
      <RecoilRoot>
        <Router>
          <Header backToAdmin={backToAdmin} setBackToAdmin={setBackToAdmin}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage clickToHomePage={clickToHomePage}/>}>
                <Route path="/admin/champions" element={<AdminChampions />} />
                <Route path="/admin/traits" element={<AdminTraits />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}

export default App;

