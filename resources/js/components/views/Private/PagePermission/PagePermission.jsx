import { useState } from "react";
import { Col, Row, Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip } from "@fortawesome/pro-regular-svg-icons";

import { GET } from "../../../providers/useAxiosQuery";
import TabPermissionModule from "./components/TabPermissionModule";
import TabPermissionUserRole from "./components/TabPermissionUserRole";
import TabPermissionUser from "./components/TabPermissionUser";

export default function PagePermission() {
    const [tabParentActive, setTabParentActive] = useState("0");
    const [selectedUserRole, setSelectedUserRole] = useState("1");

    const [optionUserType, setOptionUserType] = useState([]);

    GET(
        `api/user_role?sort_field=id&sort_order=asc`,
        "user_role_dropdown",
        (res) => {
            if (res.data) {
                setOptionUserType(
                    res.data.map((item) => ({
                        value: `${item.id}`,
                        label: item.role,
                    }))
                );
            }
        },
        false
    );

    const items = [
        {
            key: "0",
            label: "Module",
            icon: <FontAwesomeIcon icon={faMicrochip} />,
            children: <TabPermissionModule tabParentActive="Module" />,
        },
        {
            key: "1",
            label: "User Role",
            icon: <FontAwesomeIcon icon={faMicrochip} />,
            children: (
                <Tabs
                    className="tab-user-role"
                    defaultActiveKey="1"
                    type="card"
                    onTabClick={(key) => setSelectedUserRole(key)}
                    items={optionUserType.map((item) => ({
                        key: item.value,
                        label: item.label,
                        children: (
                            <TabPermissionUserRole
                                tabParentActive="UserRole"
                                userRole={selectedUserRole}
                            />
                        ),
                    }))}
                />
            ),
        },
        {
            key: "2",
            label: "Users",
            icon: <FontAwesomeIcon icon={faMicrochip} />,
            children: (
                <TabPermissionUser
                    tabParentActive="Users"
                    userRole={selectedUserRole}
                />
            ),
        },
    ];

    return (
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Tabs
                    activeKey={tabParentActive}
                    type="card"
                    indicator={{
                        size: (origin) => origin - 26,
                        align: "end",
                    }}
                    onTabClick={(key) => {
                        setTabParentActive(key);
                    }}
                    items={items.map((item) => ({
                        key: item.key,
                        label: item.label,
                        icon: item.icon,
                        children: null,
                    }))}
                />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {items[tabParentActive].children}
            </Col>
        </Row>
    );
}
