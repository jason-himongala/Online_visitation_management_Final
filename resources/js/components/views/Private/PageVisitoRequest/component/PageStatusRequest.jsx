import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Button, Col, Flex, Card, Table, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/pro-regular-svg-icons";

import ModalFileReview from "./ModalFileReview";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import {
    TableGlobalSearchAnimated,
    TablePagination,
    TableShowingEntriesV2,
    useTableScrollOnTop,
} from "../../../../providers/CustomTableFilter";

export default function PageStatusRequest(props) {
    const {
        activeTab,
        tableFilter,
        setTableFilter,
        handleUpdateStatus,
        userRole,
        selectedRowKeys,
        dataSource,
        rowSelection,
        openModalFileReview,
        setOpenModalFileReview,
    } = props;

    const statusColors = {
        pending: "#faad14", // Orange/Yellow for pending
        approved: "#52c41a", // Green for approved
        declined: "#ff4d4f", // Red for declined
    };

    return (
        <Card>
            <Row gutter={[20, 20]} id="tbl_wrapper">
                <Col xs={24}>
                    <div className="tbl-top-filter">
                        <Flex justify="space-between" align="center">
                            <Flex gap={15}>
                                <TableGlobalSearchAnimated
                                    tableFilter={tableFilter}
                                    setTableFilter={setTableFilter}
                                />

                                {userRole === "OP" &&
                                    selectedRowKeys.length > 0 && (
                                        <>
                                            {(tableFilter.status ===
                                                "Pending" ||
                                                tableFilter.status ===
                                                    "Declined") && (
                                                <Button
                                                    type="primary"
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            selectedRowKeys,
                                                            "approved"
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            {(tableFilter.status ===
                                                "Pending" ||
                                                tableFilter.status ===
                                                    "Approved") && (
                                                <Button
                                                    danger
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            selectedRowKeys,
                                                            "declined"
                                                        )
                                                    }
                                                >
                                                    Decline
                                                </Button>
                                            )}
                                        </>
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

                <Col xs={24}>
                    <Table
                        id="tbl_profiles"
                        dataSource={dataSource?.data?.data || []}
                        rowKey={(record) => record.id}
                        pagination={false}
                        bordered
                        scroll={{ x: "max-content" }}
                        sticky
                        rowSelection={userRole === "OP" ? rowSelection : null}
                    >
                        {userRole === "OP" && (
                            <Table.Column
                                title="Action"
                                key="action"
                                align="center"
                                width={50}
                                render={(_, record) => (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        gap={5}
                                    >
                                        <Button
                                            type="link"
                                            onClick={() =>
                                                setOpenModalFileReview({
                                                    open: true,
                                                    data: record.file,
                                                })
                                            }
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faFile}
                                                />
                                            }
                                        />
                                    </Flex>
                                )}
                            />
                        )}

                        <Table.Column
                            title="Visitors"
                            key="email"
                            dataIndex="email"
                            width={180}
                            render={(_, record) =>
                                record.profile
                                    ? `${record.profile.firstname} ${
                                          record.profile.lastname ?? ""
                                      }`
                                    : " "
                            }
                        />
                        <Table.Column
                            title="Department"
                            key="department_name"
                            dataIndex="department_name"
                            width={180}
                            render={(_, record) =>
                                record.appointment_schedule?.department
                                    ? record.appointment_schedule.department
                                          .department_name
                                    : ""
                            }
                        />

                        <Table.Column
                            title="Date&Time"
                            key="available_time"
                            dataIndex="available_time"
                            width={200}
                        />

                        <Table.Column
                            title="Purpose of Visit"
                            key="purpose_of_visit"
                            dataIndex="purpose_of_visit"
                            width={150}
                        />
                        <Table.Column
                            title="Status"
                            key="status"
                            dataIndex="status"
                            width={90}
                            render={(status) => (
                                <span
                                    style={{
                                        color:
                                            statusColors[
                                                status?.toLowerCase()
                                            ] || "#595959",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {status}
                                </span>
                            )}
                        />
                    </Table>
                </Col>

                <Col xs={24}>
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

            <ModalFileReview
                openModalFileReview={openModalFileReview}
                setOpenModalFileReview={setOpenModalFileReview}
            />
        </Card>
    );
}
