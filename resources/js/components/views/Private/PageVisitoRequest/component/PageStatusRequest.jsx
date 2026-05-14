import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Row,
    Button,
    Col,
    Flex,
    Card,
    Table,
    notification,
    Modal,
    Input,
    Tag,
    Tooltip,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFile,
    faEye,
    faFilePdf,
    faFileWord,
    faFileImage,
    faFileAlt,
} from "@fortawesome/pro-regular-svg-icons";

import ModalFileReview from "./ModalFileReview";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import {
    TableGlobalSearchAnimated,
    TablePagination,
    TableShowingEntriesV2,
    useTableScrollOnTop,
} from "../../../../providers/CustomTableFilter";
import FloatTextArea from "../../../../providers/FloatTextArea";

const { TextArea } = Input;

export default function PageStatusRequest(props) {
    const {
        tableFilter,
        userID,
        setTableFilter,
        handleUpdateStatus,
        userRole,
        selectedRowKeys,
        dataSource,
        rowSelection,
        openModalFileReview,
        setOpenModalFileReview,
    } = props;

    const [declineModal, setDeclineModal] = useState({
        open: false,
        remarks: "",
        selectedKeys: [],
    });

    const statusColors = {
        pending: "#faad14",
        approved: "#52c41a",
        declined: "#ff4d4f",
    };

    const handleDeclineClick = () => {
        setDeclineModal({
            open: true,
            remarks: "",
            selectedKeys: selectedRowKeys,
        });
    };

    const handleDeclineConfirm = () => {
        if (!declineModal.remarks.trim()) {
            notification.error({
                message: "Remarks Required",
                description:
                    "Please provide remarks for declining the request.",
            });
            return;
        }

        handleUpdateStatus(
            declineModal.selectedKeys,
            "declined",
            declineModal.remarks,
        );
        setDeclineModal({ open: false, remarks: "", selectedKeys: [] });
    };

    const handleDeclineCancel = () => {
        setDeclineModal({ open: false, remarks: "", selectedKeys: [] });
    };

    const hasFile = (record) => {
        return !!(
            record.file_path ||
            record.file_url ||
            record.file ||
            record.visitation_form?.file_path ||
            record.visitor_request?.file_path
        );
    };

    const getFileIcon = (record) => {
        const filePath =
            record.file_path ||
            record.file ||
            record.visitation_form?.file_path ||
            record.visitor_request?.file_path;

        if (!filePath) return faFileAlt;

        const fileName = filePath.toLowerCase();

        if (fileName.endsWith(".pdf")) {
            return faFilePdf;
        }
        if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
            return faFileWord;
        }
        if (
            fileName.endsWith(".png") ||
            fileName.endsWith(".jpg") ||
            fileName.endsWith(".jpeg") ||
            fileName.endsWith(".gif")
        ) {
            return faFileImage;
        }

        return faFileAlt;
    };

    const getFileIconColor = (record) => {
        const icon = getFileIcon(record);

        if (icon === faFilePdf) return "#ff4d4f"; // Red for PDF
        if (icon === faFileWord) return "#1890ff"; // Blue for Word
        if (icon === faFileImage) return "#52c41a"; // Green for images
        return "#666"; // Gray for other files
    };

    const getFileName = (record) => {
        if (record.file_name) return record.file_name;
        if (record.visitation_form?.file_name)
            return record.visitation_form.file_name;
        if (record.visitor_request?.file_name)
            return record.visitor_request.file_name;

        const filePath =
            record.file_path ||
            record.file ||
            record.visitation_form?.file_path ||
            record.visitor_request?.file_path;

        if (filePath) {
            return filePath.split("/").pop() || "Document";
        }

        return "No file";
    };

    return (
        <Card>
            <Row gutter={[20, 20]} id="tbl_wrapper">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
                                                            "approved",
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
                                                    onClick={handleDeclineClick}
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
                                title="File"
                                key="action"
                                align="center"
                                width={70}
                                render={(_, record) => {
                                    const hasAttachment = hasFile(record);
                                    const fileName = getFileName(record);
                                    const icon = getFileIcon(record);
                                    const iconColor = getFileIconColor(record);

                                    return (
                                        <Flex
                                            align="center"
                                            justify="center"
                                            gap={5}
                                        >
                                            {hasAttachment ? (
                                                <Tooltip
                                                    title={`View ${fileName}`}
                                                >
                                                    <Button
                                                        type="link"
                                                        onClick={() =>
                                                            setOpenModalFileReview(
                                                                {
                                                                    open: true,
                                                                    data: record, // Pass the entire record
                                                                },
                                                            )
                                                        }
                                                        icon={
                                                            <FontAwesomeIcon
                                                                icon={icon}
                                                                style={{
                                                                    fontSize:
                                                                        "18px",
                                                                    color: iconColor,
                                                                }}
                                                            />
                                                        }
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "#999",
                                                        fontStyle: "italic",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    No file
                                                </span>
                                            )}
                                        </Flex>
                                    );
                                }}
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
                            render={(_, record) =>
                                record.selected_time ||
                                record.time ||
                                record.available_time
                            }
                            width={200}
                        />

                        <Table.Column
                            title="Purpose of Visit"
                            key="purpose_of_visit"
                            dataIndex="purpose_of_visit"
                            width={150}
                        />
                        {tableFilter.status === "Declined" && (
                            <Table.Column
                                title="Remarks"
                                key="remarks"
                                dataIndex="remarks"
                                width={150}
                            />
                        )}

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

            <Modal
                title="Decline Request"
                open={declineModal.open}
                onOk={handleDeclineConfirm}
                onCancel={() =>
                    setDeclineModal({
                        open: false,
                        remarks: "",
                        selectedKeys: [],
                    })
                }
                okText="Decline"
                okButtonProps={{ danger: true }}
            >
                <p>Please provide a reason for declining this request:</p>
                <FloatTextArea
                    value={declineModal.remarks}
                    onChange={(e) =>
                        setDeclineModal((prev) => ({
                            ...prev,
                            remarks: e.target.value,
                        }))
                    }
                    rows={4}
                    placeholder="Enter remarks..."
                />
            </Modal>

            <ModalFileReview
                openModalFileReview={openModalFileReview}
                setOpenModalFileReview={setOpenModalFileReview}
            />
        </Card>
    );
}
