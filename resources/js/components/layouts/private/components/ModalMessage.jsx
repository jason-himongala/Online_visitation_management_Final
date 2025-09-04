import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, List, Avatar, Typography } from "antd";
import {
    SendOutlined,
    CheckOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import "../../../../../sass/pages/modal-message/modal-message.scss";
import { faA, faArrowLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Title, Text } = Typography;

const usersList = [
    {
        id: 1,
        name: "Alice Johnson",
        avatar: "https://i.pravatar.cc/40?img=1",
        status: "online",
    },
    {
        id: 2,
        name: "Bob Smith",
        avatar: "https://i.pravatar.cc/40?img=2",
        status: "away",
    },
    {
        id: 3,
        name: "Charlie Brown",
        avatar: "https://i.pravatar.cc/40?img=3",
        status: "offline",
    },
];

function ModalMessage({ isOpen, onClose }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [typingUsers, setTypingUsers] = useState({}); // Track typing status per user
    const [showTypingResponse, setShowTypingResponse] = useState(false); // Track if we should show typing indicator for response
    const typingTimeouts = useRef({}); // Track timeouts per user
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, typingUsers, showTypingResponse]);

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

    const getStatusColor = (status) => {
        switch (status) {
            case "online":
                return "#52c41a";
            case "away":
                return "#faad14";
            case "offline":
            default:
                return "#d9d9d9";
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);

        if (!selectedUser) return;

        // Set typing status for the current user
        if (!typingUsers[selectedUser.id]) {
            setTypingUsers((prev) => ({
                ...prev,
                [selectedUser.id]: true,
            }));
        }

        // Clear existing timeout for this user
        if (typingTimeouts.current[selectedUser.id]) {
            clearTimeout(typingTimeouts.current[selectedUser.id]);
        }

        // Set new timeout to clear typing status
        typingTimeouts.current[selectedUser.id] = setTimeout(() => {
            setTypingUsers((prev) => ({
                ...prev,
                [selectedUser.id]: false,
            }));
        }, 2000);
    };

    const handleSend = () => {
        if (newMessage.trim() === "" || !selectedUser) return;

        setTypingUsers((prev) => ({
            ...prev,
            [selectedUser.id]: false,
        }));

        if (typingTimeouts.current[selectedUser.id]) {
            clearTimeout(typingTimeouts.current[selectedUser.id]);
            delete typingTimeouts.current[selectedUser.id];
        }

        const timestamp = Date.now();
        const newMsg = {
            id: timestamp,
            text: newMessage,
            sender: "You",
            timestamp,
            status: "sent",
        };

        setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedUser.id]: [
                ...(prevMessages[selectedUser.id] || []),
                newMsg,
            ],
        }));
        setNewMessage("");

        setTimeout(() => {
            setMessages((prevMessages) => {
                const updatedMessages = [
                    ...(prevMessages[selectedUser.id] || []),
                ];
                const lastMsgIndex = updatedMessages.findIndex(
                    (msg) => msg.id === timestamp
                );
                if (lastMsgIndex !== -1) {
                    updatedMessages[lastMsgIndex] = {
                        ...updatedMessages[lastMsgIndex],
                        status: "delivered",
                    };
                }

                return {
                    ...prevMessages,
                    [selectedUser.id]: updatedMessages,
                };
            });
        }, 500);

        // Show typing indicator before sending response
        setTimeout(() => {
            setShowTypingResponse(true);

            // After showing typing indicator for 1.5 seconds, send the response
            setTimeout(() => {
                setShowTypingResponse(false);
                const responseTimestamp = Date.now();
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [selectedUser.id]: [
                        ...(prevMessages[selectedUser.id] || []),
                        {
                            id: responseTimestamp,
                            text: "Maayong adlaw",
                            sender: selectedUser.name,
                            timestamp: responseTimestamp,
                        },
                    ],
                }));

                setTimeout(() => {
                    setMessages((prevMessages) => {
                        const updatedMessages = [
                            ...(prevMessages[selectedUser.id] || []),
                        ];
                        const lastMsgIndex = updatedMessages.findIndex(
                            (msg) => msg.id === timestamp
                        );
                        if (lastMsgIndex !== -1) {
                            updatedMessages[lastMsgIndex] = {
                                ...updatedMessages[lastMsgIndex],
                                status: "seen",
                            };
                        }

                        return {
                            ...prevMessages,
                            [selectedUser.id]: updatedMessages,
                        };
                    });
                }, 300);
            }, 1500);
        }, 1000);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const filteredUsers = usersList.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupMessagesByDate = (messages = []) => {
        const grouped = {};
        messages.forEach((message) => {
            const date = formatDate(message.timestamp);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
        });
        return grouped;
    };

    const groupedMessages = selectedUser
        ? groupMessagesByDate(messages[selectedUser.id])
        : {};

    return (
        <Modal
            title="Messages"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={1100}
            closable={true}
        >
            <div className="modal-message-container">
                <div className="user-list">
                    <Title level={4} className="chat-title">
                        Chats
                    </Title>
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <List
                        dataSource={filteredUsers}
                        renderItem={(user) => (
                            <List.Item
                                key={user.id}
                                className={`user-item ${
                                    selectedUser?.id === user.id
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => setSelectedUser(user)}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div style={{ position: "relative" }}>
                                            <Avatar src={user.avatar} />
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        getStatusColor(
                                                            user.status
                                                        ),
                                                    border: "2px solid #fff",
                                                    display: "block",
                                                }}
                                            />
                                        </div>
                                    }
                                    title={<span>{user.name}</span>}
                                />
                            </List.Item>
                        )}
                    />
                </div>

                <div className="chat-window">
                    {selectedUser ? (
                        <>
                            <Title level={5} className="chat-header">
                                <Button
                                    type="link"
                                    shape="default"
                                    onClick={() => setSelectedUser(null)}
                                    style={{ marginBottom: 16 }}
                                    icon={
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    }
                                ></Button>
                                <div
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        marginRight: 8,
                                    }}
                                >
                                    <Avatar src={selectedUser.avatar} />
                                    <span
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            right: 0,
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: getStatusColor(
                                                selectedUser.status
                                            ),
                                            border: "2px solid #fff",
                                            display: "block",
                                        }}
                                    />
                                </div>
                                <b>{selectedUser.name}</b>
                            </Title>
                            <div className="messages-container">
                                {Object.entries(groupedMessages).map(
                                    ([date, dateMessages]) => (
                                        <div key={date}>
                                            <div className="date-divider">
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
                                                    >
                                                        <div className="message-content">
                                                            {msg.sender !==
                                                                "You" && (
                                                                <Avatar
                                                                    src={
                                                                        selectedUser.avatar
                                                                    }
                                                                    className="message-avatar"
                                                                />
                                                            )}
                                                            <div className="message-bubble">
                                                                <div className="message-text">
                                                                    {msg.text}
                                                                </div>
                                                                <div className="message-meta">
                                                                    <span className="message-time">
                                                                        {formatTime(
                                                                            msg.timestamp
                                                                        )}
                                                                    </span>
                                                                    {msg.sender ===
                                                                        "You" && (
                                                                        <span className="message-status">
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

                                {showTypingResponse && (
                                    <div className="typing-indicator">
                                        <Avatar
                                            src={selectedUser.avatar}
                                            size="small"
                                            className="typing-avatar"
                                        />
                                        <div className="typing-bubble">
                                            <div className="typing-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            <div className="message-input-container">
                                <Input
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    placeholder="Type a message..."
                                    onPressEnter={handleSend}
                                    className="message-input"
                                    autoFocus
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
                    ) : (
                        <div className="empty-chat-message">
                            <Title level={4}>
                                Select a conversation to start chatting
                            </Title>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default ModalMessage;
