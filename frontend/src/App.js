// @ts-nocheck
import { createBrowserRouter as Router, RouterProvider } from 'react-router-dom';

import Home from './pages/Home'
import AdminPage from './pages/admin/AdminPage'
import AdminChampions from './pages/admin/AdminChampions';
import AdminTraits from './pages/admin/AdminTraits';
import ErrorPage from "./error-page";

import './css/ChampionsList.css';
import './css/style.css';

import { Form, useNavigate, NavLink, Outlet  } from 'react-router-dom';
import {useState, useEffect} from 'react'


function App() {
  const [showLogin, setShowLogin] = useState(Boolean)
  // const [isAdmin, setIsAdmin] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = Router([
    {
      path: "/",
      element: <Home showLogin={showLogin} setShowLogin={setShowLogin}/>,
      errorElement: <ErrorPage/>
    },
    {
      path:"admin",
      element: <AdminPage showLogin={showLogin} setShowLogin={setShowLogin}/>,
      children: [
        {
          path:"champions",
          element: <AdminChampions/>
        },
        {
          path:"traits",
          element: <AdminTraits/>
        }
      ]
    }
  ]);
  
return (
  <div className="background">
      <RouterProvider router={router}/>
  </div>
  );
}

export default App;
