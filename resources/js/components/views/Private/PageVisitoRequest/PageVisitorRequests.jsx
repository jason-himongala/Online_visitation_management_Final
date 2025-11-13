import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Col, notification, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";

import Tabs from "../../../providers/Tabs";
import PageStatusRequest from "./component/PageStatusRequest";
import { role } from "../../../providers/appConfig";
import { GET, POST } from "../../../providers/useAxiosQuery";
export default function PageVisitorRequests() {
    const [activeTab, setActiveTab] = useState("0");

    const navigate = useNavigate();
    const location = useLocation();
    const userRole = role();

    const [openModalFileReview, setOpenModalFileReview] = useState({
        open: false,
        data: null,
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const getStatusByTab = (tabKey) => {
        switch (tabKey) {
            case "0":
                return "Pending";
            case "1":
                return "Approved";
            case "2":
                return "Declined";
            default:
                return "Pending";
        }
    };

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at",
        sort_order: "desc",
        status: getStatusByTab(activeTab),
    });

    useEffect(() => {
        setTableFilter((prevFilter) => ({
            ...prevFilter,
            status: getStatusByTab(activeTab),
            page: 1,
        }));
    }, [activeTab]);

    useEffect(() => {
        setTableFilter({
            page: 1,
            page_size: 50,
            search: "",
            from: location.pathname,
            status: location.pathname.includes("approved")
                ? "Approved"
                : location.pathname.includes("declined")
                ? "Declined"
                : location.pathname.includes("all-requests")
                ? "Pending"
                : location.pathname.includes("available-schedules")
                ? "Pending"
                : getStatusByTab(activeTab),
            sort_field: "created_at",
            sort_order: "desc",
        });
    }, [location, activeTab]);

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/visitation_information?${new URLSearchParams(tableFilter)}`,
        "visitation_information_submit"
    );

    useEffect(() => {
        refetchSource();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFilter]);

    const { mutate: mutateVisitorInfo } = POST(`api/visitor_requests`, [
        "visitation_information_submit",
        "visitor_request_list",
        "user_notifications",
        "visitation_information_submit",
    ]);

    const handleUpdateStatus = (ids, status) => {
        const selectedRecords = dataSource?.data?.data.filter((item) =>
            ids.includes(item.id)
        );

        let profile_id = selectedRecords.map((item) => item.profile_id);
        let visitaion_information_id = selectedRecords.map((item) => item.id);

        mutateVisitorInfo(
            {
                profile_id,
                visitaion_information_id,
                status,
            },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        notification.success({
                            message: `Success ${
                                status === "approved" ? "Approved" : "Declined"
                            }`,
                            description: res.message,
                        });
                        setSelectedRowKeys([]);
                        refetchSource();
                    } else {
                        notification.error({
                            message: "Error",
                            description: res.message,
                        });
                    }
                },
                onError: () => {
                    notification.error({
                        message: "Error",
                        description: "Something went wrong.",
                    });
                },
            }
        );
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
    };

    const createTabItem = (key, status, label) => ({
        key,
        icon: <FontAwesomeIcon icon={faUsers} />,
        label,
        children: (
            <PageStatusRequest
                status={status}
                dataSource={dataSource}
                tableFilter={tableFilter}
                setTableFilter={setTableFilter}
                handleUpdateStatus={handleUpdateStatus}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                rowSelection={rowSelection}
                refetchSource={refetchSource}
                openModalFileReview={openModalFileReview}
                setOpenModalFileReview={setOpenModalFileReview}
                userRole={userRole}
            />
        ),
    });

    const items = [
        createTabItem("0", "Pending", "Pending Visitors"),
        createTabItem("1", "Approved", "Approved Visitors"),
        createTabItem("2", "Declined", "Declined Visitors"),
    ];

    return (
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Tabs
                    type="card"
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={items.map((item) => ({
                        key: item.key,
                        label: item.label,
                        icon: item.icon,
                    }))}
                />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card variant="borderless" className="rounded-ss-none!">
                    {items.find((item) => item.key === activeTab)?.children}
                </Card>
            </Col>
        </Row>
    );
}
