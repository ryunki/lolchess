// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {RecoilRoot} from 'recoil';


import Home from './pages/Home';
import AdminChampions from './pages/admin/AdminChampions';
import AdminTraits from './pages/admin/AdminTraits';
import ErrorPage from './error-page';
import Header from 'components/Header';
import './css/ChampionsList.css';
import './css/style.css';

import { useState, useEffect } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import { Modal } from 'components/Modal';
import ProtectedRoute from 'ProtectedRoute';
function App() {
  // to switch text in the header for admin
  const [backToAdmin, setBackToAdmin] = useState(()=>{
    // for persisting correct state when refreshed (home/admin page)
    if(window.location.href.split('/')[3] === ''){
      return true
    }else{
      return false
    }
  });
  const clickToHomePage = () => {
    setBackToAdmin(true);
  };
  
  // this is modal for adding compositions
  const [deckMessage, setDeckMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = (message) => {
    setIsModalOpen(true)
    setDeckMessage(message)
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setDeckMessage('')
  }

  return (
    <div className="background">
      <RecoilRoot>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          deckMessage={deckMessage}
        />
        <Router>
          <Header backToAdmin={backToAdmin} setBackToAdmin={setBackToAdmin}/>
          <Routes>
            <Route path="/" element={<Home deckMessage={deckMessage} setDeckMessage={setDeckMessage} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} openModal={openModal} closeModal={closeModal}/>} />
            <Route element={<ProtectedRoute clickToHomePage={clickToHomePage}/>}>
              {/* <Route path="/admin" element={<AdminPage clickToHomePage={clickToHomePage} />}> */}
                  <Route path="/admin/champions" element={<AdminChampions openModal={openModal}/>} />
                  <Route path="/admin/traits" element={<AdminTraits openModal={openModal}/>} />
              {/* </Route> */}
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}

export default App;

