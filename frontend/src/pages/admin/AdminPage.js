import Header from '../../components/Header';
import '../../css/AdminPage.css'
import { Form, useNavigate, NavLink, Outlet  } from 'react-router-dom';

const AdminPage = ({showLogin, setShowLogin}) => {
  return (
    <>
      <Header showLogin={showLogin} setShowLogin={setShowLogin}/>
    
      <div className='navbar'>
          <NavLink to='/admin/champions' className={({isActive})=>(isActive?`active`:`inactive`)}>Champions</NavLink>
          <NavLink to='/admin/traits' className={({isActive})=>(isActive?'active':'inactive')}>Traits</NavLink>
          <NavLink to='/' className={({isActive})=>(isActive?'active':'inactive')}>Back to home</NavLink>
      </div>
      <Outlet/>
    </>
  )
}

export default AdminPage