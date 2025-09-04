import { Routes, Route } from "react-router-dom";
import {
    faCalendar,
    faHome,
    faUserClock,
    faUsers,
} from "@fortawesome/pro-regular-svg-icons";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import Page404 from "../views/Private/PageEditProfile/errors/Page404";
import PageRequestPermission from "../views/Private/PageEditProfile/errors/PageRequestPermission";

import PageLogin from "../views/public/PageLogin/PageLogin";
import PageEditProfile from "../views/Private/PageEditProfile/PageEditProfile";
import PageDashboard from "../views/private/PageDashboard/PageDashboard";

import PageUser from "../views/Private/PageUser/PageUser";
import PageUserForm from "../views/Private/PageUser/PageUserForm";

// import PageEmailTemplate from "../views/Private/PageEmailTemplate.jsx/PageEmailTemplate";

export default function RouteList() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicRoute
                        title="LOGIN"
                        pageId="PageLogin"
                        component={PageLogin}
                    />
                }
            />
            <Route
                path="/edit-profile"
                element={
                    <PrivateRoute
                        moduleName="Edit Profile"
                        title="User"
                        subtitle="VIEW / EDIT"
                        pageId="PageUserProfile"
                        pageHeaderIcon={faUsers}
                        breadcrumb={[
                            {
                                name: "Edit Profile",
                            },
                        ]}
                        component={PageEditProfile}
                    />
                }
            />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute
                        // moduleCode="M-01"
                        moduleName="Dashboard"
                        title="Dashboard"
                        subtitle="ADMIN"
                        pageId="PageDashboard"
                        pageHeaderIcon={faHome}
                        breadcrumb={[
                            {
                                name: "Dashboard",
                            },
                        ]}
                        component={PageDashboard}
                    />
                }
            />
            <Route
                path="/users"
                element={
                    <PrivateRoute
                        // moduleCode="M-02"
                        moduleName="User"
                        title="User"
                        subtitle="VIEW / EDIT"
                        pageId="PageUser"
                        pageHeaderIcon={faUsers}
                        breadcrumb={[
                            {
                                name: "User",
                            },
                        ]}
                        component={PageUser}
                    />
                }
            />
            <Route
                path="/users/add"
                element={
                    <PrivateRoute
                        // moduleCode="M-02"
                        moduleName="User"
                        title="PageUserForm"
                        subtitle="ADD"
                        pageId="PageUserForm"
                        pageHeaderIcon={faUsers}
                        breadcrumb={[
                            {
                                name: "User",
                                link: "/users",
                            },
                            {
                                name: "Add User",
                            },
                        ]}
                        component={PageUserForm}
                    />
                }
            />
            <Route
                path="/users/edit/:id"
                element={
                    <PrivateRoute
                        // moduleCode="M-02"
                        moduleName="User"
                        title="PageUserForm"
                        subtitle="VIEW / EDIT"
                        pageId="PageUserForm"
                        pageHeaderIcon={faUsers}
                        breadcrumb={[
                            {
                                name: "User",
                                link: "/users",
                            },
                            {
                                name: "Edit User",
                            },
                        ]}
                        component={PageUserForm}
                    />
                }
            />
            <Route
                path="/request-permission"
                element={<PageRequestPermission />}
            />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}
