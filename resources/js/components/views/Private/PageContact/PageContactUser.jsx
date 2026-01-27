import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    TableGlobalSearchAnimated,
    TablePageSize,
    TablePagination,
    TableShowingEntriesV2,
    useTableScrollOnTop,
} from "../../../providers/CustomTableFilter";
import { Col, Flex, Table, Card, Switch, notification } from "antd";
import { GET, POST } from "../../../providers/useAxiosQuery";
import notificationErrors from "../../../providers/notificationErrors";

export default function PageContactUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "id",
        sort_order: "desc",
    });

    const [toggleModalContact, setToggleModalContact] = useState({
        open: false,
        data: null,
    });

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/contacts?${new URLSearchParams(tableFilter)}`,
        "submit_contact_list",
    );

    const onChangeTable = (pagination, filters, sorter) => {
        setTableFilter((prevState) => ({
            ...prevState,
            page: 1,
            page_size: "50",
        }));
    };

    useEffect(() => {
        refetchSource();
    }, [tableFilter]);

    useTableScrollOnTop("tbl_profiles", location.pathname);

    const { mutate: mutateToggleUserStatus, loading: loadingToggleUserStatus } =
        POST(`api/user_toggle_status`, "users_active_list");

    const handleToggleStatus = ({ id, status }) => {
        mutateToggleUserStatus(
            { id, status },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        notification.success({
                            message: "User",
                            description: res.message,
                        });
                        refetchSource();
                    } else {
                        notification.error({
                            message: "User",
                            description: res.message,
                        });
                    }
                },
                onError: (err) => {
                    notificationErrors(err);
                },
            },
        );
    };

    const getSwitchStyle = (checked) => ({
        backgroundColor: checked ? "#52c41a" : "#ff4d4f",
        borderColor: checked ? "#52c41a" : "#ff4d4f",
    });

    return (
        <Card className="rounded-ss-none" variant="borderless">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Flex className="tbl-top-filter" justify="end" align="center">
                    <TablePageSize
                        tableFilter={tableFilter}
                        setTableFilter={setTableFilter}
                    />
                </Flex>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Flex
                    align="center"
                    className="tbl-top-filter"
                    justify="space-between"
                >
                    <Flex gap={15} align="center">
                        <TableGlobalSearchAnimated
                            tableFilter={tableFilter}
                            setTableFilter={setTableFilter}
                        />
                    </Flex>

                    <Flex align="center">
                        <TableShowingEntriesV2 />
                        <TablePagination
                            tableFilter={tableFilter}
                            setTableFilter={setTableFilter}
                            total={dataSource?.data.total}
                            showLessItems={true}
                            showSizeChanger={false}
                            tblIdWrapper="tbl_wrapper_deduction"
                        />
                    </Flex>
                </Flex>
            </Col>

            <Table
                id="tbl_profiles"
                dataSource={dataSource?.data?.data || dataSource?.data || []}
                rowKey={(record) => record.id}
                pagination={false}
                bordered
                scroll={{ x: "max-content" }}
                sticky
            >
                <Table.Column
                    title="Name"
                    key="username"
                    dataIndex="username"
                    width={50}
                />
                <Table.Column
                    title="Email"
                    key="email"
                    dataIndex="email"
                    width={50}
                />
                <Table.Column
                    title="Message"
                    key="message"
                    dataIndex="message"
                    width={50}
                />
                <Table.Column
                    title="Status"
                    key="status"
                    dataIndex="status"
                    width={80}
                    render={(status, record) => (
                        <Switch
                            checked={status === "Active"}
                            checkedChildren="Active"
                            unCheckedChildren="Deactivated"
                            loading={loadingToggleUserStatus}
                            style={getSwitchStyle(status === "Active")}
                            onChange={() => {
                                handleToggleStatus({
                                    id: record.user_id,
                                    status:
                                        status === "Active"
                                            ? "Deactivated"
                                            : "Active",
                                });
                            }}
                        />
                    )}
                />
            </Table>
            <Col xs={24} sm={24} md={24}>
                <Flex
                    className="tbl-bottom-filter"
                    justify="end"
                    align="center"
                >
                    <TableShowingEntriesV2 />
                    <TablePagination
                        tableFilter={tableFilter}
                        setTableFilter={setTableFilter}
                        total={dataSource?.data.total}
                        showLessItems={true}
                        showSizeChanger={false}
                        tblIdWrapper="tbl_wrapper_deduction"
                    />
                </Flex>
            </Col>
        </Card>
    );
}
