import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Layout, Typography } from "antd";

import ListOffficeCard from "./component/ListOffficeCard";
import ModalGroupChatView from "./component/ModalGroupChatView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-light-svg-icons";

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
            <Layout className="privates-layout flex items-center justify-center min-h-screen">
                <Layout.Content className="flex flex-col items-center justify-center text-center">
                    <Typography.Title
                        level={1}
                        className={`!text-white !drop-shadow-[2px_2px_4px_rgba(0,0,0,1)] ${
                            width < 768 ? "!text-[24px]" : "!text-[48px]"
                        }`}
                    >
                        Welcome to CSU Visitation System
                    </Typography.Title>

                    <Typography.Title
                        level={1}
                        className="!text-white !text-[25px] !drop-shadow-[2px_2px_4px_rgba(0,0,0,1)]"
                    >
                        Request and manage your campus visits with ease
                    </Typography.Title>

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="mt-[120px] flex justify-center">
                        <Button
                            onClick={() => navigate("/visit-request")}
                            className="
                            group
                            !bg-gradient-to-r !from-green-700 !to-green-900 
                            hover:!from-green-800 hover:!to-green-950
                            !text-white !font-semibold 
                            !px-12 md:!px-16 !py-5 
                            !rounded-full 
                            !text-lg md:!text-2xl 
                            !transition-all !duration-300 
                            !shadow-lg hover:!shadow-xl 
                            !flex !items-center !justify-center !gap-3
        "
                            style={{
                                border: "none",
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                                height: "60px",
                            }}
                        >
                            <span className="group-hover:translate-x-1 transition-transform duration-300 font-semibold">
                                Get Started
                            </span>
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="transition-transform duration-300 group-hover:translate-x-2"
                            />
                        </Button>
                    </div>
                </Layout.Content>
            </Layout>

            <Card
                style={{
                    backgroundColor: "#f0f2f5",
                }}
            >
                <Typography.Title
                    level={1}
                    className="!text-[#0d5b10] !text-center !text-[25px]"
                >
                    Offices
                    <br />
                </Typography.Title>
                <ListOffficeCard />
            </Card>

            <Layout.Footer className="!text-center !bg-[#0d5b10] !text-white">
                <Typography.Text className="!text-white">
                    © 2025 CSU Visitation System | Developed by Jason
                </Typography.Text>
            </Layout.Footer>
        </>
    );
}
