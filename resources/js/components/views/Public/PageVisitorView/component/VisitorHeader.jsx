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
            label: <Link to="/home">Home</Link>,
            key: "/home",
        },
        {
            label: <Link to="/visitation-form">Visitation Form</Link>,
            key: "/visitation-form",
        },
        { label: <Link to="/my-status">My Status</Link>, key: "/my-status" },
        {
            label: <Link to="/feedback-form">Feedback Form</Link>,
            key: "/feedback-form",
        },
        {
            label: (
                <Button
                    className="btn-main-primary"
                    type="link"
                    style={{ color: "#fff" }}
                    onClick={() =>
                        setToggleModalOpenGroupChat({ open: true, data: null })
                    }
                >
                    Contact Us
                </Button>
            ),
            key: "/contact",
        },

        {
            label: (
                <Button
                    onClick={handleLogout}
                    type="link"
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
                    className="no-selected-bg"
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
