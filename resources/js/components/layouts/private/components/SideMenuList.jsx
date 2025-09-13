import { Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faUsers,
    faEnvelope,
    faClockRotateLeft,
    faShieldKeyhole,
    faD,
    faBuilding,
    faList,
    faBookOpen,
    faChalkboardTeacher,
    faUserTie,
    faCalendarAlt,
    faClipboardQuestion,
    faClipboardCheck,
    faFileLines,
    faChartBar,
    faUsersCog,
    faUserCircle,
    faClipboardList,
    faTachometerAlt,
    faCheckCircle,
    faTimesCircle,
    faBook,
} from "@fortawesome/pro-regular-svg-icons";

export const adminHeaderMenuLeft = (
    <>
        {/* <div className="ant-menu-left-icon">
            <Link to="/subscribers/current">
                <span className="anticon">
                    <FontAwesomeIcon icon={faUsers} />
                </span>
                <Typography.Text>Subscribers</Typography.Text>
            </Link>
        </div> */}
    </>
);

export const adminHeaderDropDownMenuLeft = () => {
    const items = [
        // {
        //     key: "/subscribers/current",
        //     icon: <FontAwesomeIcon icon={faUsers} />,
        //     label: <Link to="/subscribers/current">Subscribers</Link>,
        // },
    ];

    return <Menu items={items} />;
};

export const adminSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} />,
        moduleCode: "M-01",
    },
    {
        title: "Profile",
        path: "/profile",
        icon: <FontAwesomeIcon icon={faUserCircle} />,
        moduleCode: "M-02",
    },
    {
        title: "All Requests",
        path: "/all-requests",
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        moduleCode: "M-03",
    },
    {
        title: "Approved",
        path: "/approved",
        icon: <FontAwesomeIcon icon={faCheckCircle} />,
        moduleCode: "M-04",
    },
    {
        title: "Declined",
        path: "/declined",
        icon: <FontAwesomeIcon icon={faTimesCircle} />,
        moduleCode: "M-05",
    },
];

export const DepartmentSideMenu = [
    // {
    //     title: "Dashboard",
    //     path: "/dashboard",
    //     icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    //     moduleCode: "M-01",
    // },
    {
        title: "Profile",
        path: "/profile",
        icon: <FontAwesomeIcon icon={faUserCircle} />,
        moduleCode: "M-02",
    },
    {
        title: "Pending Requests",
        path: "/all-requests",
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        moduleCode: "M-03",
    },
    {
        title: "Approved",
        path: "/approved",
        icon: <FontAwesomeIcon icon={faCheckCircle} />,
        moduleCode: "M-04",
    },
    {
        title: "Declined",
        path: "/declined",
        icon: <FontAwesomeIcon icon={faTimesCircle} />,
        moduleCode: "M-05",
    },

    {
        title: "Available Schedules",
        path: "/available-schedules",
        icon: <FontAwesomeIcon icon={faBook} />,
        moduleCode: "M-05",
    },
];

export const PicoSideMenu = [
    // {
    //     title: "Dashboard",
    //     path: "/dashboard",
    //     icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    //     moduleCode: "M-01",
    // },
    {
        title: "Profile",
        path: "/profile",
        icon: <FontAwesomeIcon icon={faUserCircle} />,
        moduleCode: "M-02",
    },
    {
        title: "Pending Requests",
        path: "/all-requests",
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        moduleCode: "M-03",
    },
    {
        title: "Approved",
        path: "/approved",
        icon: <FontAwesomeIcon icon={faCheckCircle} />,
        moduleCode: "M-04",
    },
    {
        title: "Declined",
        path: "/declined",
        icon: <FontAwesomeIcon icon={faTimesCircle} />,
        moduleCode: "M-05",
    },
    {
        title: "Visitation Forms",
        path: "/visitation-forms",
        icon: <FontAwesomeIcon icon={faBook} />,
        moduleCode: "M-05",
    },
    {
        title: "Feedback Forms",
        path: "/feedback-forms",
        icon: <FontAwesomeIcon icon={faBookOpen} />,
        moduleCode: "M-05",
    },
];

export const studentSideMenu = [];
