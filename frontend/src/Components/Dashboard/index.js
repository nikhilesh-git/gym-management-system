import Header from "../Header"
import Notifications from "../Notifications"
import Sidebar from "../Sidebar"

import "./index.css"


const Dashboard=()=>(
    <div className="bg-container">
        <Header/>
        <div className="sidebar-container">
            <Sidebar/>
            <div className="dashboard-container">
                <h1 className="dashboard-heading">Dashboard</h1>
                <Notifications/>
            </div>
        </div>
    </div>
)

export default Dashboard;