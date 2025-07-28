import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Dashboard from "./Components/Dashboard";
import AddMember from "./Components/AddMember";
import UpdateOrDeleteMembers from "./Components/UpdateOrDeleteMember";
import CreateBills from "./Components/CreateBills";
import AssignNotification from "./Components/AssignNotification";
import FeePackages from "./Components/FeePackages";
import SupplementStore from "./Components/SupplementStore";
import ReportExport from "./Components/ReportExport";
import DietDetails from "./Components/DietDetails";
import LoginPage from "./Components/LoginPage";
import NotFound from "./Components/NotFound";
import MemberDashboard from "./Components/MemberDashboard";
import MemberFeePackages from "./Components/MemberFeePackages";
import MemberSupplementStore from "./Components/MemberSupplementStore";
import MemberDietDetails from "./Components/MemberDietDetails";
import ProtectedRoute from "./Components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt_token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []); 

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginPage setRole={setRole} />} />


        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={role === "admin" ? <Dashboard /> : <MemberDashboard />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/notifications"
            element={role === "admin" ? <AssignNotification /> : <NotFound />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/add-member"
            element={role === "admin" ? <AddMember /> : <NotFound />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/update-members"
            element={role === "admin" ? <UpdateOrDeleteMembers /> : <NotFound />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/create-bills"
            element={role === "admin" ? <CreateBills /> : <NotFound />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/fee-packages"
            element={role === "admin" ? <FeePackages /> : <MemberFeePackages />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/supplements"
            element={role === "admin" ? <SupplementStore /> : <MemberSupplementStore />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/reports"
            element={role === "admin" ? <ReportExport /> : <NotFound />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/diet-details"
            element={role === "admin" ? <DietDetails /> : <MemberDietDetails />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
