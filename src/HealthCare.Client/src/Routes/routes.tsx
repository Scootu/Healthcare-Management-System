import Login from "../views/Login";
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
import Profile from "../views/Profile";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import DashboardLayout from "../layouts/DashboardLayout";
import { Route } from "react-router-dom";
import { type JSX } from "react";

export const routes: routeType[] = [
  {
    path: "/login",
    element: (
      <GuestGuard>
        <Login />
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
    path: "/profile",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "*",
    element: (
      <GuestGuard>
        <Login />
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
  