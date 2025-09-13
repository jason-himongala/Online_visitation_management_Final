import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Layout, Typography } from "antd";
import ModalGroupChatView from "./component/ModalGroupChatView";
import PageVisitionContent from "./component/PageVisitionContent";
import VisitorHeader from "./component/VisitorHeader";

export default function PageVisition() {
    const [width, setWidth] = useState(window.innerWidth);
    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
    });

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        window.location.reload();
    };

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
            return <Button onClick={handleLogout}></Button>;
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
            {/* <VisitorHeader handleMenuClick={handleMenuClick} /> */}
            <br />
            <div className="flex justify-center items-center">
                <PageVisitionContent width={width} />
            </div>
            <br />

            <Layout.Footer
                style={{ textAlign: "center", backgroundColor: "#0d5b10" }}
            >
                <Layout.Footer
                    style={{
                        textAlign: "center",
                        backgroundColor: "#0d5b10",
                    }}
                >
                    <Typography.Text type="secondary" style={{ color: "#fff" }}>
                        © 2023 CSU Visitation System. All rights reserved.
                    </Typography.Text>
                </Layout.Footer>
            </Layout.Footer>
        </Layout>
    );
}
