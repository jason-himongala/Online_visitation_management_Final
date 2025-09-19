import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Button, Col, Flex, Card, Table, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/pro-regular-svg-icons";

import { GET, POST } from "../../../providers/useAxiosQuery";
import {
    TableGlobalSearchAnimated,
    TablePagination,
    TableShowingEntriesV2,
} from "../../../providers/CustomTableFilter";
import useTableScrollOnTop from "../../../providers/useTableScrollOnTop";
import ModalFileReview from "./component/ModalFileReview";

export default function PageAllRequest() {
    const navigate = useNavigate();
    const location = useLocation();

    const [openModalFileReview, setOpenModalFileReview] = useState({
        open: false,
        data: null,
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at",
        sort_order: "desc",
        status: location.pathname.includes("approved")
            ? "Approved"
            : location.pathname.includes("declined")
            ? "Declined"
            : location.pathname.includes("all-requests")
            ? "Pending"
            : location.pathname.includes("available-schedules")
            ? "Pending"
            : "",
    });

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
                : "",
            sort_field: "created_at",
            sort_order: "desc",
        });
    }, [location]);

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/visitation_information?${new URLSearchParams(tableFilter)}`,
        ["visitation_information_submit"]
    );

    useEffect(() => {
        refetchSource();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFilter]);

    const { mutate: mutateVisitorInfo } = POST(`api/visitor_requests`, [
        "visitation_information_submit",
        "visitor_request_list",
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
                            message: `${status} Successfully`,
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

    useTableScrollOnTop("tbl_user", location);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
    };

    const isApprovedPage = location.pathname.includes("approved");
    const isDeclinedPage = location.pathname.includes("declined");
    const isAllRequestsPage = location.pathname.includes("all-requests");

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

                                {/* ✅ Bulk Actions */}
                                {selectedRowKeys.length > 0 && (
                                    <>
                                        {(isAllRequestsPage ||
                                            isDeclinedPage) && (
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
                                        {(isAllRequestsPage ||
                                            isApprovedPage) && (
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
                        rowSelection={rowSelection}
                    >
                        <Table.Column
                            title="Action"
                            key="action"
                            align="center"
                            width={50}
                            render={(_, record) => (
                                <Flex align="center" justify="center" gap={5}>
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            setOpenModalFileReview({
                                                open: true,
                                                data: record.file,
                                            })
                                        }
                                        icon={<FontAwesomeIcon icon={faFile} />}
                                    />
                                </Flex>
                            )}
                        />

                        <Table.Column
                            title="Visitors Email"
                            key="email"
                            dataIndex="email"
                            width={180}
                        />
                        <Table.Column
                            title="Date&Time"
                            key="available_time"
                            dataIndex="available_time"
                            width={150}
                        />
                        <Table.Column
                            title="Purpose of Visit"
                            key="purpose_of_visit"
                            dataIndex="purpose_of_visit"
                            width={150}
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
