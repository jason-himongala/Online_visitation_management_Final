import { use, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, Typography } from "antd";
import { appLogo } from "../../../../providers/appConfig";
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
                <span
                    className="contact-btn"
                    style={{ color: "#fff", cursor: "pointer" }}
                    onClick={() =>
                        setToggleModalOpenGroupChat({ open: true, data: null })
                    }
                >
                    Contact Us
                </span>
            ),
            key: "/contact",
        },
        {
            label: (
                <span
                    onClick={handleLogout}
                    className="contact-btn"
                    style={{ color: "#fff", cursor: "pointer" }}
                >
                    Logout
                </span>
            ),
            key: "/signout",
        },
    ];

    return (
        <>
            <Layout.Header
                style={{
                    background: "#0d5b10",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 4px",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "40px",
                    }}
                >
                    <img
                        src={appLogo}
                        alt="CSU Logo"
                        style={{ height: "80px", marginRight: "12px" }}
                    />
                    <Typography.Title
                        level={3}
                        style={{
                            color: "#fff",
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: "bold",
                            lineHeight: "1.2",
                            textAlign: "center",
                        }}
                    >
                        CSU
                        <br />
                        Visitation System
                    </Typography.Title>
                </div>

                {/* Right side - Menu */}
                <Menu
                    theme="light"
                    mode="horizontal"
                    className="no-selected-bg custom-menu"
                    style={{
                        background: "transparent",
                        minWidth: 0,
                        border: "none",
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
