import { Routes, Route } from "react-router-dom";
import {
    faCalendar,
    faHome,
    faUserCircle,
    faUserClock,
    faUsers,
} from "@fortawesome/pro-regular-svg-icons";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import Page404 from "../views/Private/PageEditProfile/errors/Page404";
import PageRequestPermission from "../views/Private/PageEditProfile/errors/PageRequestPermission";

import PageEditProfile from "../views/Private/PageEditProfile/PageEditProfile";
import PageDashboard from "../views/private/PageDashboard/PageDashboard";

import PageUser from "../views/Private/PageUser/PageUser";
import PageUserForm from "../views/Private/PageUser/PageUserForm";
import PageLogin from "../views/Public/PageLogin/PageLogin";
import PageVisitorView from "../views/Public/PageVisitorView/PageVisitorView";
import VisitorRoute from "./VisitorRoute";
import PageAllRequest from "../views/Private/PageAllRequest/PageAllRequest";
import PageApproved from "../views/Private/PageApproved/PageApproved";
import PageDeclined from "../views/Private/PageDeclined/PageDeclined";
import PageMyStatus from "../views/Public/PageVisitorView/PageMyStatus";
import PageContact from "../views/Public/PageVisitorView/PageContact";
import PageVisitionForm from "../views/Public/PageVisitorView/PageVisition";
import PageVisition from "../views/Public/PageVisitorView/PageVisition";
import PageFeedBack from "../views/Public/PageVisitorView/PageFeedBack";
import PageVisitationContent from "../views/Public/PageVisitorView/component/PageVisitionContent";

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
                path="/home"
                element={
                    <PrivateRoute
                        title="Visitor View"
                        pageId="PageVisitorView"
                        component={PageVisitorView}
                    />
                }
            />
            <Route
                path="/my-status"
                element={
                    <PrivateRoute
                        title="My Status"
                        pageId="PageMyStatus"
                        component={PageMyStatus}
                    />
                }
            />
            <Route
                path="/my-status/contact/group-chat"
                element={
                    <PrivateRoute
                        title="Contact"
                        pageId="PageContactContent"
                        component={PageContact}
                    />
                }
            />
            <Route
                path="/visitation-form"
                element={
                    <PrivateRoute
                        title="Contact"
                        pageId="PageContactContent"
                        component={PageVisition}
                    />
                }
            />
            <Route
                path="/feedback-form"
                element={
                    <PrivateRoute
                        title="Contact"
                        pageId="PageContactContent"
                        component={PageFeedBack}
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
                path="/profile"
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
                path="/all-requests"
                element={
                    <PrivateRoute
                        // moduleCode="M-02"
                        moduleName="All Requests"
                        title="PageAllRequest"
                        subtitle="VIEW / EDIT"
                        pageId="PageAllRequest"
                        pageHeaderIcon={faUserCircle}
                        breadcrumb={[
                            {
                                name: "All Requests",
                                link: "/all-requests",
                            },
                            {
                                name: "View All Requests",
                            },
                        ]}
                        component={PageAllRequest}
                    />
                }
            />
            <Route
                path="/approved"
                element={
                    <PrivateRoute
                        // moduleCode="M-02"
                        moduleName="Approved"
                        title="PageApproved"
                        subtitle="VIEW / EDIT"
                        pageId="PageApproved"
                        pageHeaderIcon={faUserCircle}
                        breadcrumb={[
                            {
                                name: "Approved",
                                link: "/approved",
                            },
                            {
                                name: "View Approved",
                            },
                        ]}
                        component={PageApproved}
                    />
                }
            />
            <Route
                path="/declined"
                element={
                    <PrivateRoute
                        // moduleCode="M-02"
                        moduleName="Declined"
                        title="PageDeclined"
                        subtitle="VIEW / EDIT"
                        pageId="PageDeclined"
                        pageHeaderIcon={faUserCircle}
                        breadcrumb={[
                            {
                                name: "Declined",
                                link: "/declined",
                            },
                            {
                                name: "View Declined",
                            },
                        ]}
                        component={PageDeclined}
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
