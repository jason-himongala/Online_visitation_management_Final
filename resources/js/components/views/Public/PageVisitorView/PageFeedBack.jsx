import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Layout, Typography } from "antd";
import Header from "./component/VisitorHeader";

import ModalGroupChatView from "./component/ModalGroupChatView";
import PageFeedBackContent from "./component/PageFeedBackContent";

export default function PageFeedBack() {
    const [width, setWidth] = useState(window.innerWidth);
    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
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
        <Layout>
            <br />
            <div className="flex justify-center items-center">
                <PageFeedBackContent width={width} />
            </div>

            <ModalGroupChatView
                toggleModalOpenGroupChat={toggleModalOpenGroupChat}
                setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
            />
            <br />

            <Layout.Footer className="!text-center !bg-[#0d5b10] !text-white">
                <Typography.Text className="!text-white">
                    © 2025 CSU Visitation System | Developed by Jason
                </Typography.Text>
            </Layout.Footer>
        </Layout>
    );
}
