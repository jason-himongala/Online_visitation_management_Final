import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Row,
    Button,
    Col,
    Flex,
    Card,
    Table,
    Popconfirm,
    Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faPlus,
    faTimesCircle,
} from "@fortawesome/pro-regular-svg-icons";

import { GET } from "../../../providers/useAxiosQuery";
import {
    TableGlobalSearchAnimated,
    TablePageSize,
    TablePagination,
    TableShowingEntriesV2,
} from "../../../providers/CustomTableFilter";
import useTableScrollOnTop from "../../../providers/useTableScrollOnTop";

export default function PageApproved() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at",
        sort_order: "desc",
        status: "Active",
        from: location.pathname,
        isTrash: 0, // 0 = Active, 1 = Archived
    });

    // const { data: dataSource, refetch: refetchSource } = GET(
    //     `api/users?${new URLSearchParams(tableFilter)}`,
    //     ["users_active_list", "check_user_permission"]
    // );

    const dataSource = {
        data: {
            total: 2,
            data: [
                {
                    id: 1,
                    visitors: "Jericho Cabalan",
                    fullname: "COFES",
                    gender: "2023-01-01 09:00 AM",
                    purpose_of_visit: "Inquiry",
                    file: "document.pdf",
                    status: "Approved",
                },
            ],
        },
    };

    // useEffect(() => {
    //     refetchSource();

    //     return () => {};
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [tableFilter]);

    useTableScrollOnTop("tbl_user", location);

    return (
        <Card>
            <Row gutter={[20, 20]} id="tbl_wrapper">
                <Col xs={24} sm={24} md={24} lg={24}>
                    {/* <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => navigate(`/users/add`)}
                        name="btn_add"
                        shape="round"
                    >
                        Add User
                    </Button> */}

                    <Typography.Title level={2} className="mb-0">
                        Approved Requests
                    </Typography.Title>
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="tbl-top-filter">
                        <Flex justify="space-between" align="center">
                            <Flex gap={15}>
                                <TableGlobalSearchAnimated
                                    tableFilter={tableFilter}
                                    setTableFilter={setTableFilter}
                                />
                                {selectedRowKeys.length > 0 && (
                                    <Popconfirm
                                        title={
                                            <>
                                                Are you sure you want to
                                                <br />
                                                {tableFilter.status === "Active"
                                                    ? "archive"
                                                    : "restore"}{" "}
                                                the selected{" "}
                                                {selectedRowKeys.length > 1
                                                    ? "Grade Levels"
                                                    : "Grade Level"}
                                                ?
                                            </>
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => {
                                            handleSelectedArchived();
                                        }}
                                        disabled={isLoadingArchiveGradeLevel}
                                    >
                                        <Button
                                            name="btn_active_archive"
                                            loading={isLoadingArchiveGradeLevel}
                                            danger={
                                                tableFilter.status === "Active"
                                            }
                                            type="primary"
                                            className={
                                                tableFilter.status ===
                                                "Deactivated"
                                                    ? "btn-success"
                                                    : ""
                                            }
                                        >
                                            {tableFilter.status === "Active"
                                                ? "ARCHIVE"
                                                : "RESTORE"}{" "}
                                            SELECTED
                                        </Button>
                                    </Popconfirm>
                                )}
                            </Flex>

                            <Flex gap={10}>
                                <TableShowingEntriesV2 />
                                <TablePagination
                                    tableFilter={tableFilter}
                                    setTableFilter={setTableFilter}
                                    total={dataSource?.data.total}
                                    showLessItems={true}
                                    showSizeChanger={false}
                                    tblIdWrapper="tbl_wrapper_position"
                                />
                            </Flex>
                        </Flex>
                    </div>
                </Col>

                <Col xs={24} sm={24} md={24}>
                    <Table
                        id="tbl_profiles"
                        dataSource={dataSource.data.data}
                        rowKey="id"
                        pagination={false}
                        bordered
                        // onChange={onChangeTable}
                        scroll={{ x: "max-content" }}
                        sticky
                    >
                        <Table.Column
                            title="Action"
                            key="action"
                            dataIndex="action"
                            align="center"
                            width={150}
                            render={(_text, record) => {
                                return (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        gap={5}
                                    >
                                        <Button
                                            type="link"
                                            name="btn_edit"
                                            // onClick={() => {
                                            //     navigate(
                                            //         `${location.pathname}/edit/${record.id}`
                                            //     );
                                            // }}
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    style={{ color: "#1677ff" }}
                                                />
                                            }
                                        />

                                        <Popconfirm
                                            title={`Are you sure to ${
                                                !tableFilter.isTrash
                                                    ? "approve"
                                                    : "decline"
                                            } this data?`}
                                            // onConfirm={() => {
                                            //     handleDeleteProfile(record);
                                            // }}
                                            onCancel={() => {
                                                notification.error({
                                                    message: "Action Cancelled",
                                                    description: "",
                                                });
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="link"
                                                name="btn_archive_active"
                                                icon={
                                                    <FontAwesomeIcon
                                                        icon={faTimesCircle}
                                                        style={{
                                                            color: tableFilter.isTrash
                                                                ? "#52c41a"
                                                                : "#ff4d4f",
                                                        }}
                                                    />
                                                }
                                            />
                                        </Popconfirm>
                                    </Flex>
                                );
                            }}
                        />
                        <Table.Column
                            title="Visitors"
                            key="visitors"
                            dataIndex="visitors"
                            sorter
                            width={180}
                        />
                        <Table.Column
                            title="Office"
                            key="fullname"
                            dataIndex="fullname"
                            sorter
                            width={180}
                        />
                        <Table.Column
                            title="Date&Time"
                            key="gender"
                            dataIndex="gender"
                            sorter
                            width={150}
                        />
                        <Table.Column
                            title="Purpose of Visit"
                            key="purpose_of_visit"
                            dataIndex="purpose_of_visit"
                            sorter
                            width={150}
                        />
                        <Table.Column
                            title="Details"
                            key="file"
                            dataIndex="file"
                            sorter
                            width={150}
                        />
                        <Table.Column
                            title="Status"
                            key="status"
                            dataIndex="status"
                            sorter
                            width={150}
                        />
                    </Table>
                </Col>

                <Col xs={24} sm={24} md={24} lg={24}>
                    <Flex
                        justify="space-between"
                        align="center"
                        className="tbl-bottom-filter"
                    >
                        <div />

                        <Flex align="center">
                            <TableShowingEntriesV2 />
                            <TablePagination
                                tableFilter={tableFilter}
                                setTableFilter={setTableFilter}
                                showLessItems={true}
                                showSizeChanger={false}
                                tblIdWrapper="tbl_wrapper"
                                total={dataSource?.data?.total}
                            />
                        </Flex>
                    </Flex>
                </Col>
            </Row>
        </Card>
    );
}
