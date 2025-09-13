import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button, List, Avatar, Typography } from "antd";
import {
    SendOutlined,
    CheckOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Title, Text } = Typography;

// Example groups
const groupsList = [
    {
        id: "mnhs",
        name: "MNHS",
        avatar: "https://via.placeholder.com/40",
        members: [
            {
                id: 1,
                name: "PICO",
                avatar: "https://static.beebom.com/wp-content/uploads/2025/03/cha-hae-in-solo-leveling.jpg?w=1250&quality=75",
                status: "online",
            },
            {
                id: 2,
                name: "Juan Dela Cruz",
                avatar: "https://via.placeholder.com/40/f5222d/ffffff?text=J",
                status: "offline",
            },
        ],
    },
    {
        id: "science",
        name: "Science Department",
        avatar: "https://via.placeholder.com/40",
        members: [
            {
                id: 3,
                name: "Teacher A",
                avatar: "https://via.placeholder.com/40/52c41a/ffffff?text=A",
                status: "online",
            },
            {
                id: 4,
                name: "Teacher B",
                avatar: "https://via.placeholder.com/40/722ed1/ffffff?text=B",
                status: "away",
            },
        ],
    },
];

export default function ModalMessage(props) {
    const { setToggleModalOpenGroupChat, toggleModalOpenGroupChat } = props;
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState({
        mnhs: [
            {
                id: 1,
                sender: "PICO",
                text: "Nag kaon kana love?",
                timestamp: Date.now(),
                status: "seen",
            },
        ],
    });
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [hasOpened, setHasOpened] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (toggleModalOpenGroupChat.open) {
            setHasOpened(true);
        } else {
            setSelectedGroup(null);
        }
    }, [toggleModalOpenGroupChat.open]);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (timestamp) => {
        const today = new Date();
        const messageDate = new Date(timestamp);

        if (today.toDateString() === messageDate.toDateString()) {
            return "Today";
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (yesterday.toDateString() === messageDate.toDateString()) {
            return "Yesterday";
        }

        return messageDate.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year:
                messageDate.getFullYear() !== today.getFullYear()
                    ? "numeric"
                    : undefined,
        });
    };

    const handleSend = () => {
        if (newMessage.trim() === "" || !selectedGroup) return;

        const timestamp = Date.now();
        const newMsg = {
            id: timestamp,
            text: newMessage,
            sender: "You",
            timestamp,
            status: "sent",
        };

        setMessages((prev) => ({
            ...prev,
            [selectedGroup.id]: [...(prev[selectedGroup.id] || []), newMsg],
        }));

        setNewMessage("");
    };

    const groupMessagesByDate = (msgs = []) => {
        const grouped = {};
        msgs.forEach((msg) => {
            const date = formatDate(msg.timestamp);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });
        return grouped;
    };

    const filteredGroups = groupsList.filter((g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedMessages = selectedGroup
        ? groupMessagesByDate(messages[selectedGroup.id] || [])
        : {};

    return (
        <Modal
            title="Group Chat"
            className="custom-blur-modal"
            blur={true}
            open={toggleModalOpenGroupChat.open}
            onCancel={() => {
                setToggleModalOpenGroupChat({
                    open: false,
                    data: null,
                });
                setSelectedGroup(null);
            }}
            footer={[
                <Button
                    key="submit"
                    type="default"
                    shape="round"
                    size="large"
                    onClick={() => {
                        setToggleModalOpenGroupChat({
                            open: false,
                            data: null,
                        });
                    }}
                >
                    Close
                </Button>,
            ]}
            width={1100}
            closable={true}
        >
            <div
                className="modal-message-container"
                style={{ display: "flex" }}
            >
                <div
                    className="group-list"
                    style={{ width: "300px", marginRight: "16px" }}
                >
                    <Title level={4}>Groups</Title>
                    <Input
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        style={{ marginBottom: 12 }}
                    />
                    <List
                        dataSource={filteredGroups}
                        renderItem={(group) => (
                            <List.Item
                                key={group.id}
                                className={`group-item ${
                                    selectedGroup?.id === group.id
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => setSelectedGroup(group)}
                                style={{
                                    cursor: "pointer",
                                    background:
                                        selectedGroup?.id === group.id
                                            ? "#f0f5ff"
                                            : "transparent",
                                    borderRadius: 6,
                                }}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={group.avatar} />}
                                    title={<span>{group.name}</span>}
                                    description={`${group.members.length} members`}
                                />
                            </List.Item>
                        )}
                    />
                </div>

                <div className="chat-window" style={{ flex: 1 }}>
                    {selectedGroup ? (
                        <>
                            <Title level={5} className="chat-header">
                                <Button
                                    type="link"
                                    shape="default"
                                    onClick={() => setSelectedGroup(null)}
                                    style={{ marginRight: 12 }}
                                    icon={
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    }
                                />
                                <Avatar src={selectedGroup.avatar} />
                                <b style={{ marginLeft: 8 }}>
                                    {selectedGroup.name}
                                </b>
                                <div
                                    style={{ fontSize: "12px", color: "#888" }}
                                >
                                    {selectedGroup.members
                                        .map((m) => m.name)
                                        .join(", ")}
                                </div>
                            </Title>

                            {/* Messages */}
                            <div
                                className="messages-container"
                                style={{
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                }}
                            >
                                {Object.entries(groupedMessages).map(
                                    ([date, dateMessages]) => (
                                        <div key={date}>
                                            <div className="empty-chat-message flex flex-col items-center justify-center py-10">
                                                <div className="flex items-center -space-x-8">
                                                    <Avatar
                                                        size={56}
                                                        src="https://wallpaper.forfun.com/fetch/62/629c409637a4efc5fc0dc0c3114fd435.jpeg"
                                                        className="border-2 border-white shadow-md"
                                                    />
                                                    <Avatar
                                                        size={72}
                                                        src="https://static.beebom.com/wp-content/uploads/2025/03/cha-hae-in-solo-leveling.jpg?w=1250&quality=75"
                                                        className="border-2 border-white shadow-md z-10"
                                                    />
                                                    <Avatar
                                                        size={56}
                                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdBCfmXFkG8CuyRB-_w6LqfTKJISRudOCdhw&s"
                                                        className="border-2 border-white shadow-md"
                                                    />
                                                </div>
                                                <p className="mt-4 text-gray-700 text-sm font-medium text-center">
                                                    Group Chat Created{" "}
                                                    <span className="ml-1">
                                                        You can now contact each
                                                        other.
                                                    </span>
                                                </p>
                                            </div>
                                            <div
                                                className="date-divider"
                                                style={{
                                                    textAlign: "center",
                                                    margin: "12px 0",
                                                }}
                                            >
                                                <Text type="secondary">
                                                    {date}
                                                </Text>
                                            </div>
                                            <List
                                                dataSource={dateMessages}
                                                renderItem={(msg) => (
                                                    <List.Item
                                                        className={`message-item ${
                                                            msg.sender === "You"
                                                                ? "sent"
                                                                : "received"
                                                        }`}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                msg.sender ===
                                                                "You"
                                                                    ? "flex-end"
                                                                    : "flex-start",
                                                        }}
                                                    >
                                                        <div
                                                            className="message-content"
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "flex-end",
                                                            }}
                                                        >
                                                            {msg.sender !==
                                                                "You" && (
                                                                <Avatar
                                                                    src={
                                                                        selectedGroup.members.find(
                                                                            (
                                                                                m
                                                                            ) =>
                                                                                m.name ===
                                                                                msg.sender
                                                                        )
                                                                            ?.avatar
                                                                    }
                                                                    className="message-avatar"
                                                                    style={{
                                                                        marginRight: 8,
                                                                    }}
                                                                />
                                                            )}
                                                            <div
                                                                className="message-bubble"
                                                                style={{
                                                                    background:
                                                                        msg.sender ===
                                                                        "You"
                                                                            ? "#e6f7ff"
                                                                            : "#fafafa",
                                                                    padding:
                                                                        "8px 12px",
                                                                    borderRadius: 12,
                                                                    maxWidth:
                                                                        "70%",
                                                                }}
                                                            >
                                                                {msg.sender !==
                                                                    "You" && (
                                                                    <div
                                                                        style={{
                                                                            fontSize: 12,
                                                                            fontWeight:
                                                                                "bold",
                                                                            marginBottom: 4,
                                                                        }}
                                                                    >
                                                                        {
                                                                            msg.sender
                                                                        }
                                                                    </div>
                                                                )}
                                                                <div className="message-text">
                                                                    {msg.text}
                                                                </div>
                                                                <div
                                                                    className="message-meta"
                                                                    style={{
                                                                        fontSize: 10,
                                                                        color: "#999",
                                                                        marginTop: 4,
                                                                        textAlign:
                                                                            "right",
                                                                    }}
                                                                >
                                                                    {formatTime(
                                                                        msg.timestamp
                                                                    )}
                                                                    {msg.sender ===
                                                                        "You" && (
                                                                        <span
                                                                            className="message-status"
                                                                            style={{
                                                                                marginLeft: 6,
                                                                            }}
                                                                        >
                                                                            {msg.status ===
                                                                                "sent" && (
                                                                                <CheckOutlined />
                                                                            )}
                                                                            {msg.status ===
                                                                                "delivered" && (
                                                                                <CheckOutlined />
                                                                            )}
                                                                            {msg.status ===
                                                                                "seen" && (
                                                                                <CheckCircleOutlined
                                                                                    style={{
                                                                                        color: "#1890ff",
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                    )
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div
                                className="message-input-container"
                                style={{
                                    display: "flex",
                                    marginTop: 12,
                                    gap: 8,
                                }}
                            >
                                <Input
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    placeholder="Type a message..."
                                    onPressEnter={handleSend}
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={handleSend}
                                >
                                    Send
                                </Button>
                            </div>
                        </>
                    ) : !hasOpened ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a group to start chatting
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No messages yet
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
