import { faUser } from "@fortawesome/pro-light-svg-icons";
import { Routes, Route } from "react-router-dom";
import {
    faBooks,
    faHome,
    faUserCircle,
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
import PageAllRequest from "../views/Private/PageAllRequest/PageAllRequest";

import PageMyStatus from "../views/Public/PageVisitorView/PageMyStatus";
import PageContact from "../views/Public/PageVisitorView/PageContact";
import PageVisition from "../views/Public/PageVisitorView/PageVisition";
import PageFeedBack from "../views/Public/PageVisitorView/PageFeedBack";
import PageEvent from "../views/Private/PageEvent/PageEvent";
import PageSignUp from "../views/Public/PageSignUp/PageSignUp";
import PageLandingPage from "../views/Public/PageLandingPage/PageLandingPage";
import PageVisitorRequest from "../views/Public/PageVisitorView/PageVisitorRequest";
import PageVisitation from "../views/Private/PageVisitation/PageVisitation";
import PageFeedBackForms from "../views/Private/PageFeedBack/PageFeedBackForms";
import PagePermission from "../views/Private/PagePermission/PagePermission";
import PageVisitorRequests from "../views/Private/PageVisitoRequest/PageVisitorRequests";
import PageDepartment from "../views/Private/PageDepartment/PageDepartment";

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
                        component={PageLandingPage}
                    />
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute
                        title="LOGIN"
                        pageId="PageLogin"
                        component={PageLogin}
                    />
                }
            />
            <Route
                path="/sign-up"
                element={
                    <PublicRoute
                        title="SIGN UP"
                        pageId="PageSignUp"
                        component={PageSignUp}
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
                path="/visit-request"
                element={
                    <PrivateRoute
                        title="Visitor Request"
                        pageId="PageVisitorRequest"
                        component={PageVisitorRequest}
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
                path="/visitation-form/:status/:id"
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
                path="/feedback-form/:status/:id"
                element={
                    <PrivateRoute
                        title="Contact"
                        pageId="PageContactContent"
                        component={PageFeedBack}
                    />
                }
            />
            <Route
                path="/departments"
                element={
                    <PrivateRoute
                        title="Departments"
                        pageId="PageDepartments"
                        component={PageDepartment}
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
                path="/user-profile"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="User Profile"
                        title="User Profile"
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
                path="/user-profile/add"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="User"
                        title="PageUserForm"
                        subtitle="ADD"
                        pageId="PageUserForm"
                        pageHeaderIcon={faUsers}
                        breadcrumb={[
                            {
                                name: "Profile",
                                link: "/profile",
                            },
                            {
                                name: "Add Profile",
                            },
                        ]}
                        component={PageUserForm}
                    />
                }
            />
            <Route
                path="/user-profile/edit/:id"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="User Profile"
                        title="PageUserForm"
                        subtitle="VIEW / EDIT"
                        pageId="PageUserForm"
                        pageHeaderIcon={faUsers}
                        breadcrumb={[
                            {
                                name: "Profile",
                                link: "/user-profile",
                            },
                            {
                                name: "Edit User Profile",
                            },
                        ]}
                        component={PageUserForm}
                    />
                }
            />

            <Route
                path="/user-profile/edit/:id"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="User Profile"
                        title="PageUserForm"
                        subtitle="VIEW / EDIT"
                        pageId="PageUserForm"
                        pageHeaderIcon={faUsers}
                        breadcrumb={[
                            {
                                name: "User",
                                link: "/user-profile",
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
                        moduleCode="M-02"
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
                        moduleCode="M-02"
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
                        component={PageAllRequest}
                    />
                }
            />
            <Route
                path="/declined"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
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
                        component={PageAllRequest}
                    />
                }
            />
            <Route
                path="/available-schedules"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="Available Schedules"
                        title="PageAvailableSchedules"
                        subtitle="VIEW / EDIT"
                        pageId="PageAvailableSchedules"
                        pageHeaderIcon={faUserCircle}
                        breadcrumb={[
                            {
                                name: "Available Schedules",
                                link: "/available-schedules",
                            },
                            {
                                name: "View Available Schedules",
                            },
                        ]}
                        component={PageEvent}
                    />
                }
            />
            <Route
                path="/visitation-forms"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="Visitation Forms"
                        title="PageVisitationForms"
                        subtitle="VIEW / EDIT"
                        pageId="PageVisitationForms"
                        pageHeaderIcon={faUserCircle}
                        breadcrumb={[
                            {
                                name: "View Visitation Forms",
                            },
                        ]}
                        component={PageVisitation}
                    />
                }
            />
            <Route
                path="/feedback-forms"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="Visitation Forms"
                        title="PageVisitationForms"
                        subtitle="VIEW / EDIT"
                        pageId="PageVisitationForms"
                        pageHeaderIcon={faUserCircle}
                        breadcrumb={[
                            {
                                name: "View Feedback Forms",
                            },
                        ]}
                        component={PageFeedBackForms}
                    />
                }
            />
            <Route
                path="/visitor-requests"
                element={
                    <PrivateRoute
                        moduleCode="M-02"
                        moduleName="Visitor Requests"
                        title="PageVisitorRequests"
                        subtitle="VIEW / EDIT"
                        pageId="PageVisitorRequests"
                        pageHeaderIcon={faUser}
                        breadcrumb={[
                            {
                                name: "View Visitor Requests",
                            },
                        ]}
                        component={PageVisitorRequests}
                    />
                }
            />
            <Route
                path="/permissions"
                element={
                    <PrivateRoute
                        moduleCode="M-13"
                        moduleName="Page Permission"
                        title="Permission"
                        subtitle="EDIT"
                        pageId="PagePermission"
                        pageHeaderIcon={faBooks}
                        breadcrumb={[
                            {
                                name: "Permission",
                            },
                        ]}
                        component={PagePermission}
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
