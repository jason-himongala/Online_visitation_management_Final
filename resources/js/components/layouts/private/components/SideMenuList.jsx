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
        icon: <FontAwesomeIcon icon={faHome} />, // Good choice
        moduleCode: "M-01",
    },
    {
        title: "Subjects",
        path: "/subjects",
        icon: <FontAwesomeIcon icon={faBookOpen} />, // Subjects -> books
    },
    {
        title: "Classes",
        path: "/classes",
        icon: <FontAwesomeIcon icon={faChalkboardTeacher} />, // Classes -> teaching board
    },
    {
        title: "Faculty",
        path: "/faculty",
        icon: <FontAwesomeIcon icon={faUserTie} />, // Faculty -> professional user
    },
    {
        title: "Academic Year",
        path: "/academic-year",
        icon: <FontAwesomeIcon icon={faCalendarAlt} />, // Academic Year -> calendar
    },
    {
        title: "Questionnaires",
        path: "/questionnaires",
        icon: <FontAwesomeIcon icon={faClipboardQuestion} />, // Questionnaires -> clipboard with question
        moduleCode: "M-13",
    },
    {
        title: "Evaluation Criteria",
        path: "/evaluation-criteria",
        icon: <FontAwesomeIcon icon={faClipboardCheck} />, // Criteria -> checklist
    },
    {
        title: "Evaluation Report",
        path: "/evaluation-report",
        icon: <FontAwesomeIcon icon={faFileLines} />, // Report -> document
    },
    {
        title: "Evaluation Graph Report",
        path: "/evaluation-graph-report",
        icon: <FontAwesomeIcon icon={faChartBar} />, // Graph report -> bar chart
    },
    {
        title: "User",
        path: "/user",
        icon: <FontAwesomeIcon icon={faUsersCog} />, // User management -> users with settings
    },
];

export const facultySideMenu = [];

export const studentSideMenu = [];
