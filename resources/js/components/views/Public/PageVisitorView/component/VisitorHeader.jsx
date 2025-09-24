import { Button, Layout, Menu, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { use, useState } from "react";
import ModalGroupChatView from "./ModalGroupChatView";

export default function VisitorHeader() {
    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
        data: null,
    });
    const location = useLocation();
    const navigate = useNavigate();

    let pathname = location.pathname;
    console.log("pathname", pathname);
    pathname = pathname.split("/");
    pathname = "/" + pathname[1];

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        window.location.reload();
    };
    const MenuVisitor = [
        {
            label: (
                <Link to="/home" className="no-underline!">
                    Home
                </Link>
            ),
            key: "/home",
        },
        {
            label: (
                <Link to="/visit-request" className="no-underline!">
                    Visit Request
                </Link>
            ),
            key: "/visit-request",
        },
        {
            label: (
                <Link to="/my-status" className="no-underline!">
                    My Status
                </Link>
            ),
            key: "/my-status",
        },
        {
            label: (
                <Link to="/visitation-form" className="no-underline!">
                    Visitation Form
                </Link>
            ),
            key: "/visitation-form",
        },
        {
            label: (
                <Link to="/feedback-form" className="no-underline!">
                    Feedback Form
                </Link>
            ),
            key: "/feedback-form",
        },
        {
            label: (
                <Link
                    type="link"
                    className="contact-btn"
                    style={{ color: "#fff" }}
                    onClick={() =>
                        setToggleModalOpenGroupChat({ open: true, data: null })
                    }
                >
                    Contact Us
                </Link>
            ),
            key: "/contact",
        },
        {
            label: (
                <Button
                    onClick={handleLogout}
                    type="link"
                    className="contact-btn"
                    style={{ color: "#fff" }}
                >
                    Logout
                </Button>
            ),
            key: "/signout",
        },
    ];

    return (
        <>
            <Layout.Header style={{ background: "#0d5b10", height: "80px" }}>
                <Menu
                    theme="light"
                    mode="horizontal"
                    className="no-selected-bg custom-menu"
                    style={{
                        background: "transparent",
                        minWidth: 0,
                        flex: 1,
                        justifyContent: "flex-end",
                    }}
                    items={MenuVisitor}
                />
            </Layout.Header>
            <ModalGroupChatView
                setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
                toggleModalOpenGroupChat={toggleModalOpenGroupChat}
            />
        </>
    );
}
