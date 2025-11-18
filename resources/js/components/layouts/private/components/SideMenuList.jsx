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
];

export const OPSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    },

    {
        title: "Visitor Requests",
        path: "/visitor-requests",
        icon: <FontAwesomeIcon icon={faUsers} />,
    },
];

export const DepartmentSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    },

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
