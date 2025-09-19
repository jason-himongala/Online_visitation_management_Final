import { useState } from "react";
import { Card, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCheck,
    faClockRotateLeft,
    faListRadio,
    faUser,
    faUsers,
} from "@fortawesome/pro-regular-svg-icons";

import Tabs from "../../../providers/Tabs";
import PageEventContentCalendar from "./component/PageEventContentCalendar";
import PageEventContentTable from "./component/PageEventContentTable";
import PageAllRequest from "../PageAllRequest/PageAllRequest";

export default function PageEvent() {
    const [activeTab, setActiveTab] = useState("0");

    const items = [
        {
            key: "0",
            icon: <FontAwesomeIcon icon={faCalendar} />,
            label: "Calendar",
            children: <PageEventContentCalendar />,
        },
        {
            key: "1",
            icon: <FontAwesomeIcon icon={faUsers} />,
            label: "List of Pending Visitors",
            children: <PageAllRequest />,
        },
    ];

    return (
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Tabs
                    type="card"
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={items.map((item) => ({
                        ...item,
                        children: null,
                    }))}
                />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card variant="borderless" className="rounded-ss-none!">
                    {items[activeTab].children}
                </Card>
            </Col>
        </Row>
    );
}
