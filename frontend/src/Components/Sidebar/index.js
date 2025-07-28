import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import {
  FaUserPlus, FaEdit, FaFileInvoice, FaBell,
  FaBox, FaChartBar, FaAppleAlt, FaSignOutAlt, FaHome
} from "react-icons/fa";
import "./index.css";

const Sidebar = () => {

  const onClickLogOut = () => {
    Cookies.remove('jwt_token', { path: '/' });
    window.location.replace('/login'); 
  };


  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Admin Panel</h1>
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-item"><FaHome /> Dashboard</Link>
        <Link to="/add-member" className="nav-item"><FaUserPlus /> Add Member</Link>
        <Link to="/update-members" className="nav-item"><FaEdit /> Update/Delete Members</Link>
        <Link to="/create-bills" className="nav-item"><FaFileInvoice /> Create Bills</Link>
        <Link to="/fee-packages" className="nav-item"><FaBox /> Fee Packages</Link>
        <Link to="/notifications" className="nav-item"><FaBell /> Assign Notification</Link>
        <Link to="/reports" className="nav-item"><FaChartBar /> Report Export</Link>
        <Link to="/supplements" className="nav-item"><FaBox /> Supplement Store</Link>
        <Link to="/diet-details" className="nav-item"><FaAppleAlt /> Diet Details</Link>
        <button className="nav-item logout" onClick={onClickLogOut}><FaSignOutAlt /> Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;
