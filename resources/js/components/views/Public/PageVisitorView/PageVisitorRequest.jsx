import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Layout, Typography } from "antd";

import PageVisitorRequestContent from "./component/PageVisitorRequestContent";

export default function PageVisitorRequest(props) {
    const [width, setWidth] = useState(window.innerWidth);

    return (
        <>
            <Layout>
                <Card className="rounded-ss-none" variant="borderless">
                    <PageVisitorRequestContent width={width} />
                </Card>

                <Layout.Footer className="!text-center !bg-[#0d5b10] !text-white">
                    <Typography.Text className="!text-white">
                        © 2025 CSU Visitation System | Developed by Jason
                    </Typography.Text>
                </Layout.Footer>
            </Layout>
        </>
    );
}
