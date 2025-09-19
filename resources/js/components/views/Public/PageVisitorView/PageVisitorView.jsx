import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Layout, Typography } from "antd";

import ListOffficeCard from "./component/ListOffficeCard";
import ModalGroupChatView from "./component/ModalGroupChatView";

export default function PageVisitorView() {
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
                    {/* Main Title */}
                    <Typography.Title
                        level={1}
                        className={`!text-white !text-center !pt-[100px] !drop-shadow-[2px_2px_4px_rgba(0,0,0,1)] ${
                            width < 768 ? "!text-[24px]" : "!text-[48px]"
                        }`}
                    >
                        Welcome to CSU Visitation System
                    </Typography.Title>

                    {/* Subtitle */}
                    <Typography.Title
                        level={1}
                        className="!text-white !text-center !text-[25px] !drop-shadow-[2px_2px_4px_rgba(0,0,0,1)]"
                    >
                        Request and manage your campus visits with ease
                    </Typography.Title>

                    {/* CTA Button */}
                    <div className="!text-center !mt-[120px]">
                        <button
                            onClick={() => navigate("/my-status")}
                            className="!bg-green-800 !text-white !text-2xl !font-semibold !px-12 !py-4 !rounded-full hover:!bg-green-900 !transition-colors !duration-300"
                        >
                            Get Started
                        </button>
                    </div>
                </Layout.Content>

                {/* Modal */}
                <ModalGroupChatView
                    toggleModalOpenGroupChat={toggleModalOpenGroupChat}
                    setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
                />

                {/* Offices Section */}
                <Card>
                    <Typography.Title
                        level={1}
                        className="!text-[#0d5b10] !text-center !text-[25px]"
                    >
                        Offices
                    </Typography.Title>
                    <ListOffficeCard />
                </Card>
            </Layout>

            {/* Footer */}
            <Layout.Footer className="!text-center !bg-[#0d5b10] !text-white">
                <Typography.Text className="!text-white">
                    © 2025 CSU Visitation System | Developed by Jason
                </Typography.Text>
            </Layout.Footer>
        </>
    );
}
