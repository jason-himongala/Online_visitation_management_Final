import React, { useState, useRef, useEffect, useMemo } from "react";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    SendOutlined,
    CheckOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { Modal, Input, Button, List, Avatar, Typography } from "antd";
import { GET } from "../../../../providers/useAxiosQuery";
import { UserId } from "../../../../providers/appConfig";

const { Title, Text } = Typography;

export default function ModalGroupChatView(props) {
    const userId = UserId();
    const { setToggleModalOpenGroupChat, toggleModalOpenGroupChat } = props;
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState({});
    const { data: dataChatMember } = GET(
        `api/chat_members`,
        "chat_members_list",
        () => {},
        false
    );
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
    const groupChats = useMemo(() => {
        const groups = {};

        dataChatMember?.data.forEach((item) => {
            const chatId = item.chat_id;

            if (!groups[chatId]) {
                groups[chatId] = {
                    chat_id: chatId,
                    chat: item.chat,
                    members: [],
                };
            }

            const username = item.profile?.user?.username || "Unknown";
            const avatar = item.profile?.attachments?.[0]?.file_path
                ? "/" + item.profile.attachments[0].file_path
                : null;

            groups[chatId].members.push({
                ...item,
                user_id: item.profile?.user_id,
                name: username,
                avatar: avatar,
            });
        });

        return Object.values(groups);
    }, [dataChatMember]);

    console.log("groupChats", groupChats);

    const filteredGroupChats = useMemo(() => {
        return groupChats.filter((group) =>
            group.members.some((m) => m.profile?.user_id === userId)
        );
    }, [groupChats, userId]);

    const filteredGroups = filteredGroupChats.filter((g) =>
        (g.chat?.title_of_groupchat || "Group Chat")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

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
            [selectedGroup.chat_id]: [
                ...(prev[selectedGroup.chat_id] || []),
                newMsg,
            ],
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

    const groupedMessages = selectedGroup
        ? groupMessagesByDate(messages[selectedGroup.chat_id] || [])
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
                                key={group.chat_id}
                                className={`group-item ${
                                    selectedGroup?.chat_id === group.chat_id
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => setSelectedGroup(group)}
                                style={{
                                    cursor: "pointer",
                                    background:
                                        selectedGroup?.chat_id === group.chat_id
                                            ? "#f0f5ff"
                                            : "transparent",
                                    borderRadius: 6,
                                }}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={group.chat?.avatar} />}
                                    title={
                                        <span>
                                            {group.chat?.title_of_groupchat ||
                                                "Group Chat"}
                                        </span>
                                    }
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
                                <Avatar src={selectedGroup.chat?.avatar} />
                                <b style={{ marginLeft: 8 }}>
                                    {selectedGroup.chat?.title_of_groupchat ||
                                        "Group Chat"}
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
                                {(!messages[selectedGroup.chat_id] ||
                                    messages[selectedGroup.chat_id].length ===
                                        0) && (
                                    <div className="empty-chat-message flex flex-col items-center justify-center py-10">
                                        <div className="flex items-center -space-x-8">
                                            {selectedGroup.members.map(
                                                (member, idx) => (
                                                    <Avatar
                                                        key={member.id}
                                                        size={
                                                            idx === 1 ? 72 : 56
                                                        }
                                                        src={member.avatar}
                                                        className={`border-2 border-white shadow-md${
                                                            idx === 1
                                                                ? " z-10"
                                                                : ""
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <p className="mt-4 text-gray-700 text-sm font-medium text-center">
                                            Group Chat Created{" "}
                                            <span className="ml-1">
                                                You can now contact each other.
                                            </span>
                                        </p>
                                    </div>
                                )}
                                {Object.entries(groupedMessages).map(
                                    ([date, dateMessages]) => (
                                        <div key={date}>
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
