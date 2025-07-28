import { FaUserCircle } from 'react-icons/fa'
import './index.css'

const Header = () => (
  <nav className="nav-header">
    <div className="nav-content">
      <img
        className="website-logo"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
        alt="website logo"
      />
    </div>
    <div className="profile-icon-container">
      <FaUserCircle className="profile-icon" />
    </div>
  </nav>
)

export default Header
