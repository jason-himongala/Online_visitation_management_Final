import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Layout, Typography } from "antd";

import Header from "./component/VisitorHeader";
import PageVisitContent from "./component/PageVisitContent";
import ModalGroupChatView from "./component/ModalGroupChatView";

export default function PageMyStatus(props) {
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
        data: null,
    });

    return (
        <>
            <Layout>
                {/* <Header handleMenuClick={handleMenuClick} /> */}

                <Card className="rounded-ss-none" variant="borderless">
                    <PageVisitContent width={width} />
                </Card>

                <Layout.Footer className="!text-center !bg-[#0d5b10] !text-white">
                    <Typography.Text className="!text-white">
                        © 2025 CSU Visitation System | Developed by Jason
                    </Typography.Text>
                </Layout.Footer>
            </Layout>

            <ModalGroupChatView
                toggleModalOpenGroupChat={toggleModalOpenGroupChat}
                setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
            />
        </>
    );
}
