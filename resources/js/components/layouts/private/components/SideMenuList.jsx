import { Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faUsersCog,
    faUserCircle,
    faClipboardList,
    faTachometerAlt,
    faCheckCircle,
    faTimesCircle,
    faBook,
} from "@fortawesome/pro-regular-svg-icons";
import { faUsers } from "@fortawesome/pro-light-svg-icons";

export const adminSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    },

    {
        title: "User Profile",
        path: "/user-profile",
        icon: <FontAwesomeIcon icon={faUserCircle} />,
    },

    {
        title: "Visitor Requests",
        path: "/visitor-requests",
        icon: <FontAwesomeIcon icon={faUsers} />,
    },
    // {
    //     title: "Pending Requests",
    //     path: "/all-requests",
    //     icon: <FontAwesomeIcon icon={faClipboardList} />,
    // },
    // {
    //     title: "Approved",
    //     path: "/approved",
    //     icon: <FontAwesomeIcon icon={faCheckCircle} />,
    // },
    // {
    //     title: "Declined",
    //     path: "/declined",
    //     icon: <FontAwesomeIcon icon={faTimesCircle} />,
    // },
    {
        title: "Visitation Forms",
        path: "/visitation-forms",
        icon: <FontAwesomeIcon icon={faBook} />,
    },
    {
        title: "Feedback Forms",
        path: "/feedback-forms",
        icon: <FontAwesomeIcon icon={faBookOpen} />,
    },

    {
        title: "Available Schedules",
        path: "/available-schedules",
        icon: <FontAwesomeIcon icon={faBook} />,
    },

    // {
    //     title: "Permissions",
    //     path: "/permissions",
    //     icon: <FontAwesomeIcon icon={faUsersCog} />,
    //
    // },
];

export const OPSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    },
    // {
    //     title: "All Requests",
    //     path: "/all-requests",
    //     icon: <FontAwesomeIcon icon={faClipboardList} />,
    // },
    // {
    //     title: "Approved",
    //     path: "/approved",
    //     icon: <FontAwesomeIcon icon={faCheckCircle} />,
    // },
    // {
    //     title: "Declined",
    //     path: "/declined",
    //     icon: <FontAwesomeIcon icon={faTimesCircle} />,
    // },

    {
        title: "Visitor Requests",
        path: "/visitor-requests",
        icon: <FontAwesomeIcon icon={faUsers} />,
    },
];

export const DepartmentSideMenu = [
    // {
    //     title: "Pending Requests",
    //     path: "/all-requests",
    //     icon: <FontAwesomeIcon icon={faClipboardList} />,
    // },
    // {
    //     title: "Approved",
    //     path: "/approved",
    //     icon: <FontAwesomeIcon icon={faCheckCircle} />,
    // },
    // {
    //     title: "Declined",
    //     path: "/declined",
    //     icon: <FontAwesomeIcon icon={faTimesCircle} />,
    // },

    {
        title: "Visitor Requests",
        path: "/visitor-requests",
        icon: <FontAwesomeIcon icon={faUsers} />,
    },
    {
        title: "Available Schedules",
        path: "/available-schedules",
        icon: <FontAwesomeIcon icon={faBook} />,
    },
];
