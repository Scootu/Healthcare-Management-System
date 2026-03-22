import Login from "../views/Login";
import RegisterPatient from "../views/RegisterPatient";
import RegisterDoctor from "../views/RegisterDoctor";
import Landing from "../views/Landing";
import AddPharmacy from "../views/AddPharmacy";
import Dashboard from "../views/Dashboard";
import PharmacyDashboard from "../views/PharmacyDashboard";
import Users from "../views/Users";
import AllUsers from "../features/users/allUsers";
import UserCard from "../features/users/userCard";
import Dayra from "../features/users/Dayra";
import Commune from "../features/users/Commune";
import UsersInCommune from "../features/users/usersByCommune";
import Doctors from "../views/Doctors";
import AddDoctors from "../views/AddDoctors";
import Barchart from "../views/BarChart";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import DashboardLayout from "../layouts/DashboardLayout";
import { Route } from "react-router-dom";
import { type JSX } from "react";

export const routes: routeType[] = [
  {
    path: "/landing",
    element: (
      <GuestGuard>
        <Landing />
      </GuestGuard>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "/register-patient",
    element: (
      <GuestGuard>
        <RegisterPatient />
      </GuestGuard>
    ),
  },
  {
    path: "/register-doctor",
    element: (
      <GuestGuard>
        <RegisterDoctor />
      </GuestGuard>
    ),
  },
  {
    path: "/register-pharmacy",
    element: (
      <GuestGuard>
        <AddPharmacy />
      </GuestGuard>
    ),
  },
  {
    path: "/users",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Users />,
      },
      {
        path: "all",
        element: <AllUsers />,
      },
      {
        path: ":userId",
        element: <UserCard />,
      },
      {
        path: "wilayat/:wilayaId",
        element: <Dayra />,
      },
      {
        path: "wilayat/:wilayaId/:dayraId",
        element: <Commune />,
      },
      {
        path: "wilayat/:wilayaId/:dayraId/:communeId",
        element: <UsersInCommune />,
      }
    ],
  },
  {
    path: "/doctors",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Doctors />,
      },
    ],
  },
  {
    path: "/adddoctor",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <AddDoctors />,
      },
    ],
  },
  {
    path: "/barchart",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Barchart />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true, 
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <GuestGuard>
        <Landing />
      </GuestGuard>
    ),
  },
  {
    path: "/pharmacy",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <PharmacyDashboard />,
      },
    ],
  },];

export const renderRoutes = (routes: routeType[]): JSX.Element[] => {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)} {/* recursion */}
        </Route>
      );
    }
    return (
      <Route
        key={index}
        index={route.index}
        path={route.path}
        element={route.element}
      />
    );
  });
};



interface routeType {
  path?: string;       
  index?: boolean;       
  element: JSX.Element; 
  children?: routeType[]; 
}
  