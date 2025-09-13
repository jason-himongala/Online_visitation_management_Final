import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Flex, Layout, Menu, Row, Typography } from "antd";

import ListOffficeCard from "./component/ListOffficeCard";

import ModalGroupChatView from "./component/ModalGroupChatView";

export default function PageVisitorView() {
    const [width, setWidth] = useState(window.innerWidth);
    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
        data: null,
    });

    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        if (e.key === "home") return navigate("/");
        if (e.key === "visit-request") return navigate("/visitor");
        if (e.key === "my-status") return navigate("/my-status");
        if (e.key === "visitation-form") return navigate("/visitation-form");
        if (e.key === "feedback-form") return navigate("/feedback-form");
        if (e.key === "contact") {
            setToggleModalOpenGroupChat({
                open: true,
                data: null,
            });
            return;
        }
        if (e.key === "logout") {
        }
    };

    useEffect(() => {
        const section = document.querySelector(".private-layout");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        function handleResize() {
            setWidth(window.innerWidth);

            if (window.innerWidth === 768) {
                setSideMenuCollapse(true);
            }
            if (window.innerWidth > 768) {
                setSideMenuCollapse(false);
            }
            if (window.innerHeight < 768) {
                setSideMenuCollapse(true);
            }
        }
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <Layout className="privates-layout">
                <Layout.Content>
                    <Typography.Title
                        level={1}
                        style={{
                            color: "#fff",
                            textAlign: "center",
                            paddingTop: 100,
                            textShadow: "2px 2px 4px #000",
                            fontSize: width < 768 ? 24 : 48,
                        }}
                    >
                        Welcome to CSU Visitation System
                    </Typography.Title>
                    <Typography.Title
                        level={1}
                        style={{
                            color: "#fff",
                            textAlign: "center",
                            textShadow: "2px 2px 4px #000",
                            fontSize: "25px",
                        }}
                    >
                        Request and manage your campus visits with ease
                    </Typography.Title>
                    <div style={{ textAlign: "center", marginTop: "120px" }}>
                        <button
                            onClick={() => navigate("/my-status")}
                            className="bg-green-800! text-white! text-2xl! font-semibold! px-12! py-4! rounded-full! hover:bg-green-900! transition-colors! duration-300!"
                        >
                            Get Started
                        </button>
                    </div>
                </Layout.Content>

                <ModalGroupChatView
                    toggleModalOpenGroupChat={toggleModalOpenGroupChat}
                    setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
                />
                <Card>
                    <Typography.Title
                        level={1}
                        style={{
                            color: "#0d5b10",
                            textAlign: "center",

                            fontSize: "25px",
                        }}
                    >
                        Offices
                    </Typography.Title>
                    <ListOffficeCard />
                </Card>
            </Layout>
            <Layout.Footer
                style={{
                    textAlign: "center",
                    backgroundColor: "#0d5b10",
                    color: "#fff",
                }}
            >
                <Typography.Text type="secondary" style={{ color: "#fff" }}>
                    © 2023 CSU Visitation System. All rights reserved.
                </Typography.Text>
            </Layout.Footer>
        </>
    );
}
