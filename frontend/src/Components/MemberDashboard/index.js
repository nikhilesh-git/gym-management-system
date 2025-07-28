import Header from "../Header"
import Notifications from "../Notifications"
import MemberBills from "../MemberBills"
import MemberSidebar from "../MemberSidebar"

import "./index.css"


const MemberDashboard=()=>(
    <div className="bg-container">
        <Header/>
        <div className="sidebar-container">
            <MemberSidebar/>
            <div className="dashboard-container">
                <h1 className="dashboard-heading">Dashboard</h1>
                <div className="dashboard-body-container">
                    <Notifications/>
                    <MemberBills/>  
                </div>
            </div>
        </div>
    </div>
)

export default MemberDashboard;