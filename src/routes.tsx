import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./components/Login";
import History from "./components/History";
import Bookings from "./components/Bookings";
import NotFound from "./components/NotFound";
import { useAuthContext } from "./contexts/auth.context";
import OutletTemplate from "./components/OutletTemplate";
import Users from "./components/Users";
import AccommodationsMap from "./components/AccommodationsMap";
import HotelMap from "./components/HotelMap";
import Logout from "./components/user/Logout";

const AppRoutes = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      <Route
        path="/"
        element={user?.isAdmin ? <OutletTemplate /> : <UserLogin />}
      >
        <Route
          path="/bookings"
          element={user?.isAdmin ? <Bookings /> : <Navigate to="/" />}
        />
        <Route
          path="history"
          element={user?.isAdmin ? <History /> : <Navigate to="/" />}
        />
        <Route
          path="users"
          element={user?.isAdmin ? <Users /> : <Navigate to="/" />}
        />
        <Route
          path="accommodations"
          element={user?.isAdmin ? <AccommodationsMap /> : <Navigate to="/" />}
        />
        <Route
          path="hotel-map"
          element={user?.isAdmin ? <HotelMap /> : <Navigate to="/" />}
        />
        <Route path="/" element={<Bookings />} />
        <Route path="logout" element={<Logout />} />
      </Route>
      <Route
        path="/login"
        element={!user?.isAdmin ? <UserLogin /> : <Navigate to="/bookings" />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default AppRoutes;
