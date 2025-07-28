import Header from "../Header"
import Sidebar from "../Sidebar"

import "./index.css"


const ReportExport=()=>(
    <div className="bg-container">
        <Header/>
        <div className="sidebar-container">
            <Sidebar/>
            <div className="dashboard-container">
                <h1 className="dashboard-heading">Export Report</h1>

            </div>
        </div>
    </div>
)

export default ReportExport;