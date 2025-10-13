import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Card, List, Button, Modal, Typography, Divider } from "antd";

import { GET } from "../../../../providers/useAxiosQuery";
import ModalGroupChatView from "./ModalGroupChatView";
import { UserId } from "../../../../providers/appConfig";
export default function PageMyStatusContent() {
    const userId = UserId();

    const { data: dataSource } = GET(
        `api/visitation_information?user_id=${userId}`,
        ["visitation_information_submit", "visitation_information_submit"]
    );

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

    const navigate = useNavigate();

    return (
        <>
            <List
                dataSource={dataSource?.data || []}
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
                                        item.created_at
                                    ).toLocaleDateString()}
                                </div>
                            </div>

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
                        </div>
                    </Card>
                )}
            />

            <Modal
                title="My Status"
                open={openModal}
                width={600}
                onCancel={() => setOpenModal(false)}
                footer={null}
                centered
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

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#f6ffed",
                                padding: "12px 16px",
                                borderRadius: 4,
                                marginBottom: 12,
                            }}
                        >
                            <span>
                                You can now communicate with the Department +
                                PICO.
                            </span>
                            <Button
                                type="primary"
                                style={{
                                    background: "#0d5b10",
                                    borderColor: "#0d5b10",
                                }}
                                onClick={() =>
                                    setToggleModalOpenGroupChat({
                                        open: true,
                                        data: null,
                                    })
                                }
                            >
                                Open Chat
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
                                You can now fill out the visitation form.
                            </span>
                            <Button
                                type="primary"
                                style={{
                                    background: "#0d5b10",
                                    borderColor: "#0d5b10",
                                }}
                                onClick={() =>
                                    navigate(
                                        `/visitation-form/${selectedItem.status?.toLowerCase()}/${
                                            selectedItem.id
                                        }`
                                    )
                                }
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
                            <span>You can now fill out the feedback form.</span>
                            <Button
                                type="primary"
                                style={{
                                    background: "#0d5b10",
                                    borderColor: "#0d5b10",
                                }}
                                onClick={() =>
                                    navigate(
                                        `/feedback-form/${selectedItem.status?.toLowerCase()}/${
                                            selectedItem.id
                                        }`
                                    )
                                }
                            >
                                Go to Feedback form
                            </Button>
                        </div>
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
