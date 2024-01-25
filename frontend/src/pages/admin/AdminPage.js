import Header from '../../components/Header';
import { Form, useNavigate, NavLink, Outlet  } from 'react-router-dom';

const AdminPage = ({showLogin, setShowLogin}) => {
  return (
    <>
      <Header showLogin={showLogin} setShowLogin={setShowLogin}/>
    
      <div style={{display:'flex', gap:'10px'}}>
          <NavLink to={'/admin/champions'}>Champions</NavLink>
          <NavLink to={'/admin/traits'}>Traits</NavLink>
          <NavLink to={'/'}>Back to home</NavLink>
      </div>
      <Outlet/>
    </>
  )
}

export default AdminPage