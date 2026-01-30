import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Card,
    List,
    Button,
    Modal,
    Typography,
    Divider,
    Popconfirm,
    message,
    Flex,
} from "antd";

import { GET } from "../../../../providers/useAxiosQuery";
import ModalGroupChatView from "./ModalGroupChatView";
import { UserId } from "../../../../providers/appConfig";

export default function PageMyStatusContent() {
    const userId = UserId();

    const { data: dataSource } = GET(
        `api/visitation_information?user_id=${userId}`,
        "visitation_information_submit",
    );

    const [removedIds, setRemovedIds] = useState(() => {
        const saved = localStorage.getItem("removedVisitationIds");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "removedVisitationIds",
            JSON.stringify(removedIds),
        );
    }, [removedIds]);

    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
        data: null,
    });

    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpen = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleRemove = (id) => {
        setRemovedIds((prev) => [...prev, id]);
        setOpenModal(false);
        message.success("Item removed successfully");
    };

    const navigate = useNavigate();

    const filteredData = (dataSource?.data || []).filter(
        (item) => !removedIds.includes(item.id),
    );

    const { data: datavistionForms, loading: isLoadingChat } = GET(
        `api/visitation_forms`,
        [
            "visitation_forms_submit",
            "user_notifications",
            "user_notifications_list",
        ],
    );

    const handleVisitationFormClick = () => {
        const formSubmitted = datavistionForms?.data.find(
            (form) =>
                form.visitation_information_id === selectedItem.id &&
                form.remarks === "Submitted",
        );

        if (formSubmitted) {
            Modal.info({
                title: "Form Submitted",
                content: "You have already filled up the visitation form.",
            });
        } else {
            navigate(
                `/visitation-form/${selectedItem.status?.toLowerCase()}/${
                    selectedItem.id
                }`,
            );
        }
    };

    const { data: dataFeedback } = GET(`api/feedback`, "feedback_form");

    const handleFeedbackFormClick = () => {
        const formSubmitted = dataFeedback?.data.find(
            (form) =>
                form.visitation_information_id === selectedItem.id &&
                form.remarks === "Submitted",
        );

        if (formSubmitted) {
            Modal.info({
                title: "Form Submitted",
                content: "You have already filled up the visitation form.",
            });
        } else {
            navigate(
                `/feedback-form/${selectedItem.status?.toLowerCase()}/${
                    selectedItem.id
                }`,
            );
        }
    };

    const handleRequestNewVisit = () => {
        navigate("/visit-request");
    };

    return (
        <>
            <List
                dataSource={filteredData}
                renderItem={(item) => (
                    <Card
                        style={{
                            marginBottom: 16,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                        }}
                        bodyStyle={{ padding: "16px 20px" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <Typography.Text
                                    strong
                                    style={{ fontSize: 16 }}
                                >
                                    {item.purpose_of_visit}
                                </Typography.Text>
                                <div style={{ fontSize: 12, color: "#555" }}>
                                    Submitted:{" "}
                                    {new Date(
                                        item.created_at,
                                    ).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                                <Button
                                    size="small"
                                    style={{
                                        backgroundColor:
                                            item.status?.toLowerCase() ===
                                            "approved"
                                                ? "#52c41a"
                                                : item.status?.toLowerCase() ===
                                                    "pending"
                                                  ? "#faad14"
                                                  : "#ff4d4f",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 6,
                                        fontSize: 14,
                                        padding: "4px 16px",
                                    }}
                                    onClick={() => handleOpen(item)}
                                >
                                    {item.status
                                        ? item.status.charAt(0).toUpperCase() +
                                          item.status.slice(1).toLowerCase()
                                        : ""}
                                </Button>
                                <Popconfirm
                                    title="Are you sure you want to remove this item?"
                                    onConfirm={() => handleRemove(item.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        danger
                                        size="small"
                                        style={{
                                            background: "#ff7875",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 6,
                                            fontSize: 14,
                                            padding: "4px 16px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </Card>
                )}
            />

            <Modal
                title="My Status"
                open={openModal}
                width={600}
                onCancel={() => setOpenModal(false)}
                footer={
                    selectedItem && !removedIds.includes(selectedItem.id) ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Button
                                danger
                                onClick={() => setOpenModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    ) : null
                }
            >
                {selectedItem && (
                    <>
                        <Typography.Paragraph>
                            <b>Visitor :</b> {selectedItem.email}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <b>Date & Time :</b> {selectedItem.available_time}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <b>Purpose :</b> {selectedItem.purpose_of_visit}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            <b>Status :</b>{" "}
                            <span
                                style={{
                                    fontSize: 16,
                                    color:
                                        selectedItem.status?.toLowerCase() ===
                                        "approved"
                                            ? "#52c41a"
                                            : selectedItem.status?.toLowerCase() ===
                                                "pending"
                                              ? "rgb(250, 173, 20)"
                                              : "#ff4d4f",
                                }}
                            >
                                {selectedItem.status
                                    ? selectedItem.status
                                          .charAt(0)
                                          .toUpperCase() +
                                      selectedItem.status.slice(1).toLowerCase()
                                    : ""}
                            </span>
                        </Typography.Paragraph>

                        <Divider />

                        {selectedItem.status?.toLowerCase() !== "declined" ? (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "#f6ffed",
                                        padding: "12px 16px",
                                        borderRadius: 4,
                                        marginBottom: "12px",
                                    }}
                                >
                                    <span>
                                        You can now fill out the visitation
                                        form.
                                    </span>
                                    <Button
                                        type="primary"
                                        style={{
                                            background: "#0d5b10",
                                            borderColor: "#0d5b10",
                                        }}
                                        disabled={
                                            (
                                                selectedItem.status ?? ""
                                            ).toLowerCase() !== "approved"
                                        }
                                        onClick={handleVisitationFormClick}
                                    >
                                        Go to Visitation form
                                    </Button>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "#f6ffed",
                                        padding: "12px 16px",
                                        borderRadius: 4,
                                    }}
                                >
                                    <span>
                                        You can now fill out the feedback form.
                                    </span>
                                    <Button
                                        type="primary"
                                        style={{
                                            background: "#0d5b10",
                                            borderColor: "#0d5b10",
                                        }}
                                        disabled={
                                            (
                                                selectedItem.status ?? ""
                                            ).toLowerCase() !== "approved" ||
                                            (
                                                selectedItem.remarks ?? ""
                                            ).toLowerCase() !== "completed"
                                        }
                                        onClick={handleFeedbackFormClick}
                                    >
                                        Go to Feedback form
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div
                                style={{
                                    background: "#fff2e8",
                                    padding: "16px",
                                    borderRadius: "4px",
                                    border: "1px solid #ffbb96",
                                    marginBottom: "12px",
                                }}
                            >
                                <Flex align="center" gap={16}>
                                    <Typography.Paragraph
                                        style={{ margin: 0, flex: 1 }}
                                    >
                                        Your visit request has been declined.
                                        You may submit a new request.
                                    </Typography.Paragraph>

                                    <Button
                                        type="primary"
                                        style={{
                                            background: "#0d5b10",
                                            borderColor: "#0d5b10",
                                        }}
                                        onClick={handleRequestNewVisit}
                                    >
                                        Submit New Request
                                    </Button>
                                </Flex>
                            </div>
                        )}
                    </>
                )}

                <ModalGroupChatView
                    toggleModalOpenGroupChat={toggleModalOpenGroupChat}
                    setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
                />
            </Modal>
        </>
    );
}
