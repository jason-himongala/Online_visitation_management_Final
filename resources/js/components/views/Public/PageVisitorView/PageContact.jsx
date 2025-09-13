import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import Header from "./component/VisitorHeader";

import ModalGroupChatView from "./component/ModalGroupChatView";

export default function PageContact() {
    const [width, setWidth] = useState(window.innerWidth);
    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
        data: null,
    });
    const navigate = useNavigate();
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
        }
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
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

    return (
        <>
            <Layout style={{ minHeight: "160vh" }}>
                <Header handleMenuClick={handleMenuClick} />

                <ModalGroupChatView
                    toggleModalOpenGroupChat={toggleModalOpenGroupChat}
                    setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
                />
            </Layout>
        </>
    );
}
