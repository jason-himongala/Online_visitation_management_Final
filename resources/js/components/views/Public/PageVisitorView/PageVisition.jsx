import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Layout, Typography } from "antd";
import PageVisitionContent from "./component/PageVisitionContent";

export default function PageVisition() {
    const { id, status } = useParams();
    console.log("status", status);

    const [width, setWidth] = useState(window.innerWidth);

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
            <Layout>
                {/* <VisitorHeader handleMenuClick={handleMenuClick} /> */}
                <br />
                <div className="flex justify-center items-center">
                    <PageVisitionContent
                        width={width}
                        id={id}
                        status={status}
                    />
                </div>
                <br />
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
