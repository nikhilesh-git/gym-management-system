import { Link  } from "react-router-dom";
import Cookies from 'js-cookie';
import {
  FaHome, FaBox, FaAppleAlt, FaSignOutAlt
} from "react-icons/fa";
import "./index.css";

const MemberSidebar = () => {

  const onClickLogOut = () => {
    Cookies.remove('jwt_token', { path: '/' });
    window.location.replace('/login'); 
  }



  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Member Panel</h1>
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-item"><FaHome /> Dashboard</Link>
        <Link to="/fee-packages" className="nav-item"><FaBox /> Fee Packages</Link>
        <Link to="/supplements" className="nav-item"><FaBox /> Supplement Store</Link>
        <Link to="/diet-details" className="nav-item"><FaAppleAlt /> Diet Details</Link>
        <button className="nav-item logout" onClick={onClickLogOut}><FaSignOutAlt /> Logout</button>
      </nav>
    </div>
  );
};

export default MemberSidebar;
