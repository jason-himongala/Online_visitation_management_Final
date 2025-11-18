import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Col, notification, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";

import Tabs from "../../../providers/Tabs";
import PageStatusRequest from "./component/PageStatusRequest";
import { role, UserId } from "../../../providers/appConfig";
import { GET, POST } from "../../../providers/useAxiosQuery";

export default function PageVisitorRequests() {
    const [activeTab, setActiveTab] = useState("0");

    const navigate = useNavigate();
    const location = useLocation();
    const userRole = role();
    const UserIds = UserId();

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

    const { data: dataUser } = GET(
        `api/users?id=${UserIds}`,
        "user_detail",
        () => {},
        false
    );

    const currentUser =
        dataUser?.data?.[0] ||
        dataUser?.data?.find((user) => user.id === UserIds);

    // console.log("User ID currentUser:", currentUser);
    // console.log("User Role:", userRole);
    // console.log("User Department ID:", currentUser?.department_id);

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/visitation_information?${new URLSearchParams(tableFilter)}`,
        "visitation_information_submit"
    );

    const filteredDataSource = useMemo(() => {
        if (!dataSource?.data?.data) return dataSource;

        if (userRole === "PICO" || userRole === "OP") {
            return dataSource;
        }

        if (userRole === "Department" && currentUser?.department_id) {
            const filteredData = dataSource.data.data.filter(
                (item) =>
                    item.appointment_schedule?.department_id ===
                    currentUser.department_id
            );

            return {
                ...dataSource,
                data: {
                    ...dataSource.data,
                    data: filteredData,
                    total: filteredData.length,
                    per_page: dataSource.data.per_page,
                    current_page: dataSource.data.current_page,
                    last_page: Math.ceil(
                        filteredData.length / dataSource.data.per_page
                    ),
                },
            };
        }

        return dataSource;
    }, [dataSource, userRole, currentUser?.department_id]);

    // console.log("Original Data Count:", dataSource?.data?.data?.length);
    // console.log("Filtered Data Count:", filteredDataSource?.data?.data?.length);

    useEffect(() => {
        refetchSource();
        return () => {};
    }, [tableFilter]);

    const { mutate: mutateVisitorInfo } = POST(`api/visitor_requests`, [
        "visitation_information_submit",
        "visitor_request_list",
        "user_notifications",
        "visitation_information_submit",
    ]);

    const handleUpdateStatus = (ids, status, remarkInput = "") => {
        const selectedRecords = filteredDataSource?.data?.data.filter((item) =>
            ids.includes(item.id)
        );

        let profile_id = selectedRecords.map((item) => item.profile_id);
        let visitaion_information_id = selectedRecords.map((item) => item.id);
        let department_id = selectedRecords.map(
            (item) => item.appointment_schedule?.department_id || null
        );

        let remarks = selectedRecords.map(() => remarkInput);

        mutateVisitorInfo(
            {
                profile_id,
                visitaion_information_id,
                department_id,
                status,
                remarks,
            },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        notification.success({
                            message: `Success`,
                            description: res.message,
                        });
                        setSelectedRowKeys([]);
                        refetchSource();
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
                dataSource={filteredDataSource}
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
