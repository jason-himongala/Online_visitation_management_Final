import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Layout, Typography } from "antd";
import Header from "./component/VisitorHeader";

import ModalGroupChatView from "./component/ModalGroupChatView";
import PageFeedBackContent from "./component/PageFeedBackContent";

export default function PageFeedBack() {
    const [width, setWidth] = useState(window.innerWidth);
    const { id, status } = useParams();
    console.log("statusssss ffeeds", status);

    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
    });

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
                <PageFeedBackContent width={width} status={status} id={id} />
            </div>

            <Layout.Footer className="!text-center !bg-[#0d5b10] !text-white">
                <Typography.Text className="!text-white">
                    © 2025 CSU Visitation System | Developed by Jason
                </Typography.Text>
            </Layout.Footer>
        </Layout>
    );
}
