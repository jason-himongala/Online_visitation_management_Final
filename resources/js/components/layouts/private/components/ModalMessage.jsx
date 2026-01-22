import { useState, useRef, useEffect, useMemo } from "react";
import {
    faArrowLeft,
    faArchive,
    faInbox,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    SendOutlined,
    CheckOutlined,
    CheckCircleOutlined,
    EditOutlined,
    DownOutlined,
} from "@ant-design/icons";
import {
    Modal,
    Input,
    Button,
    List,
    Avatar,
    Typography,
    Collapse,
    Popconfirm,
} from "antd";

import { GET, POST } from "../../../providers/useAxiosQuery";
import { role, UserId } from "../../../providers/appConfig";
import ModalChatRename from "./modalChatRename";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function ModalMessage(props) {
    const userId = UserId();
    const userRole = role();

    const { setToggleModalOpenGroupChat, toggleModalOpenGroupChat } = props;

    const [toggleModalChatRename, setToggleModalChatRename] = useState({
        open: false,
        data: null,
    });

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [hasOpened, setHasOpened] = useState(false);
    const [archivedGroups, setArchivedGroups] = useState(() => {
        const saved = localStorage.getItem("archivedGroupsAdmin");
        return saved ? JSON.parse(saved) : [];
    });
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(
            "archivedGroupsAdmin",
            JSON.stringify(archivedGroups),
        );
    }, [archivedGroups]);

    const { data: dataChatMember } = GET(
        `api/chat_members`,
        "chat_member_list_rename",
        () => {},
        false,
    );

    const { mutate: mutateVisitorInfo, loading: isLoadingChat } = POST(
        `api/conversations_chat`,
        "post_visitor_chat_message",
    );

    const { data: dataChatMessages, refetch: refetchChatMessages } = GET(
        selectedGroup
            ? `api/conversations_chat?chat_id=${selectedGroup.chat_id}`
            : null,
        "post_visitor_chat_message" +
            (selectedGroup ? selectedGroup.chat_id : ""),
    );
    useEffect(() => {
        if (selectedGroup) {
            setMessages((prev) => ({
                ...prev,
                [selectedGroup.chat_id]: [],
            }));
        }
    }, [selectedGroup]);

    useEffect(() => {
        if (selectedGroup && dataChatMessages?.data) {
            const myProfileId = selectedGroup.members.find(
                (m) => m.profile?.user_id === userId,
            )?.profile?.id;

            const mappedMessages = dataChatMessages.data.map((msg) => {
                const senderMember = selectedGroup.members.find(
                    (m) => m.profile?.id === msg.profile_id,
                );
                const isCurrentUser = msg.profile_id === myProfileId;
                return {
                    id: msg.id,
                    text: msg.chat_message,
                    sender: isCurrentUser
                        ? "You"
                        : senderMember?.name ||
                          msg.sender?.username ||
                          "Unknown",
                    timestamp: msg.created_at
                        ? new Date(msg.created_at).getTime()
                        : Date.now(),
                    status: msg.status || "sent",
                };
            });

            setMessages((prev) => ({
                ...prev,
                [selectedGroup.chat_id]: mappedMessages,
            }));
        }
    }, [dataChatMessages, selectedGroup, userId]);

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

    const filteredGroupChats = useMemo(() => {
        if (
            userRole === "Pico" ||
            userRole === "Admin" ||
            userRole === "Department"
        ) {
            return groupChats;
        }

        return groupChats.filter((group) =>
            group.members.some((m) => m.profile?.user_id === userId),
        );
    }, [groupChats, userId, userRole]);

    const activeFilteredGroups = filteredGroupChats.filter(
        (g) =>
            !archivedGroups.includes(g.chat_id) &&
            (g.chat?.title_of_groupchat || "Group Chat")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const archivedFilteredGroups = filteredGroupChats.filter(
        (g) =>
            archivedGroups.includes(g.chat_id) &&
            (g.chat?.title_of_groupchat || "Group Chat")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const handleArchive = (chatId, e) => {
        e.stopPropagation();
        setArchivedGroups((prev) => [...prev, chatId]);
        if (selectedGroup?.chat_id === chatId) {
            setSelectedGroup(null);
        }
    };

    const handleUnarchive = (chatId, e) => {
        e.stopPropagation();
        setArchivedGroups((prev) => prev.filter((id) => id !== chatId));
    };

    const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

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

    const groupMessagesByDate = (msgs = []) => {
        const grouped = {};
        msgs.forEach((msg) => {
            const date = formatDate(msg.timestamp);
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(msg);
        });
        return grouped;
    };

    const renderMessageWithLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                let url = part;
                if (!url.startsWith("http")) {
                    url = "https://" + url;
                }
                return (
                    <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        style={{
                            color: "#1890ff",
                            textDecoration: "underline",
                            wordBreak: "break-all",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const handleSend = async () => {
        if (newMessage.trim() === "" || !selectedGroup) return;

        const currentMember = selectedGroup.members.find(
            (m) => m.profile?.user_id === userId,
        );
        const chat_id = selectedGroup.chat_id;
        const profile_id = currentMember?.profile?.id;
        const chat_member_id = currentMember?.id;

        const payload = {
            profile_id,
            chat_member_id,
            chat_id,
            chat_message: newMessage,
        };

        mutateVisitorInfo(payload, {
            onSuccess: () => {
                refetchChatMessages();
                setNewMessage("");

                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            },
        });

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

    const groupedMessages = selectedGroup
        ? groupMessagesByDate(
              [...(messages[selectedGroup.chat_id] || [])].sort(
                  (a, b) => a.timestamp - b.timestamp,
              ),
          )
        : {};
    useEffect(() => {
        if (selectedGroup?.chat_id) {
            refetchChatMessages();
        }
    }, [selectedGroup?.chat_id, refetchChatMessages]);

    useEffect(() => {
        let interval;
        if (selectedGroup?.chat_id) {
            interval = setInterval(() => {
                refetchChatMessages();
            }, 8000);
        }
        return () => clearInterval(interval);
    }, [selectedGroup?.chat_id]);

    return (
        <Modal
            title="Group Chat"
            className="custom-blur-modal"
            open={toggleModalOpenGroupChat.open}
            onCancel={() => {
                setToggleModalOpenGroupChat({ open: false, data: null });
                setSelectedGroup(null);
            }}
            footer={null}
            width={1500}
            bodyStyle={{ height: "70vh", padding: 0 }}
            maskStyle={{
                backdropFilter: "blur(1px)",
                backgroundColor: "rgba(0,0,0,0.3)",
            }}
        >
            <div style={{ display: "flex", height: "100%" }}>
                <div
                    style={{
                        width: 350,
                        borderRight: "1px solid #f0f0f0",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ padding: "16px" }}>
                        <Title level={4}>Groups</Title>
                        <Input
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </div>
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        <List
                            dataSource={activeFilteredGroups}
                            renderItem={(group) => (
                                <List.Item
                                    key={group.chat_id}
                                    className={
                                        selectedGroup?.chat_id === group.chat_id
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() => setSelectedGroup(group)}
                                    style={{
                                        cursor: "pointer",
                                        background:
                                            selectedGroup?.chat_id ===
                                            group.chat_id
                                                ? "#e6f7ff"
                                                : "transparent",
                                        padding: "12px 24px",
                                    }}
                                    actions={
                                        userRole === "Pico" ||
                                        userRole === "Admin" ||
                                        userRole === "Department"
                                            ? [
                                                  <Popconfirm
                                                      title="Archive this chat?"
                                                      onConfirm={(e) =>
                                                          handleArchive(
                                                              group.chat_id,
                                                              e,
                                                          )
                                                      }
                                                      onCancel={(e) =>
                                                          e.stopPropagation()
                                                      }
                                                      okText="Yes"
                                                      cancelText="No"
                                                  >
                                                      <Button
                                                          type="text"
                                                          icon={
                                                              <FontAwesomeIcon
                                                                  icon={
                                                                      faArchive
                                                                  }
                                                              />
                                                          }
                                                          onClick={(e) =>
                                                              e.stopPropagation()
                                                          }
                                                      />
                                                  </Popconfirm>,
                                              ]
                                            : []
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar src={group.chat?.avatar} />
                                        }
                                        title={
                                            <span>
                                                {group.chat
                                                    ?.title_of_groupchat ||
                                                    "Group Chat"}
                                            </span>
                                        }
                                        description={`${group.members.length} members`}
                                    />
                                </List.Item>
                            )}
                        />
                        {(userRole === "Pico" ||
                            userRole === "Admin" ||
                            userRole === "Department") && (
                            <Collapse
                                bordered={false}
                                expandIcon={({ isActive }) => (
                                    <DownOutlined rotate={isActive ? 180 : 0} />
                                )}
                                style={{ background: "transparent" }}
                            >
                                <Panel
                                    header={`Archived (${archivedFilteredGroups.length})`}
                                    key="1"
                                >
                                    <List
                                        dataSource={archivedFilteredGroups}
                                        renderItem={(group) => (
                                            <List.Item
                                                key={group.chat_id}
                                                onClick={() =>
                                                    setSelectedGroup(group)
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    background:
                                                        selectedGroup?.chat_id ===
                                                        group.chat_id
                                                            ? "#e6f7ff"
                                                            : "transparent",
                                                    padding: "12px 24px",
                                                }}
                                                actions={[
                                                    <Popconfirm
                                                        title="Unarchive this chat?"
                                                        onConfirm={(e) =>
                                                            handleUnarchive(
                                                                group.chat_id,
                                                                e,
                                                            )
                                                        }
                                                        onCancel={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faInbox
                                                                    }
                                                                />
                                                            }
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        />
                                                    </Popconfirm>,
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            src={
                                                                group.chat
                                                                    ?.avatar
                                                            }
                                                        />
                                                    }
                                                    title={
                                                        <span>
                                                            {group.chat
                                                                ?.title_of_groupchat ||
                                                                "Group Chat"}
                                                        </span>
                                                    }
                                                    description={`${group.members.length} members`}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            </Collapse>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {selectedGroup ? (
                        <>
                            <div
                                style={{
                                    padding: "10px 16px",
                                    borderBottom: "1px solid #f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Button
                                        type="link"
                                        onClick={() => setSelectedGroup(null)}
                                        style={{ marginRight: 12 }}
                                        icon={
                                            <FontAwesomeIcon
                                                icon={faArrowLeft}
                                            />
                                        }
                                    />
                                    <Avatar src={selectedGroup.chat?.avatar} />
                                    <div style={{ marginLeft: 12 }}>
                                        <b style={{ display: "block" }}>
                                            {selectedGroup.chat
                                                ?.title_of_groupchat ||
                                                "Group Chat"}
                                        </b>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#888",
                                            }}
                                        >
                                            {selectedGroup.members
                                                .map((m) => m.name)
                                                .join(", ")}
                                        </div>
                                    </div>
                                </div>
                                {(userRole === "Pico" ||
                                    userRole === "Admin" ||
                                    userRole === "Department") && (
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setToggleModalChatRename({
                                                open: true,
                                                data: {
                                                    id: selectedGroup.chat_id,
                                                    title_of_groupchat:
                                                        selectedGroup.chat
                                                            ?.title_of_groupchat,
                                                },
                                            });
                                        }}
                                        style={{
                                            opacity: 0.7,
                                            fontSize: "16px",
                                        }}
                                    />
                                )}
                            </div>

                            <div
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    padding: "0 16px",
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
                                                ),
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
                                                        className={
                                                            msg.sender === "You"
                                                                ? "sent"
                                                                : "received"
                                                        }
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                msg.sender ===
                                                                "You"
                                                                    ? "flex-end"
                                                                    : "flex-start",
                                                            border: "none",
                                                            padding: "4px 0",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "flex-end",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            {msg.sender !==
                                                                "You" && (
                                                                <Avatar
                                                                    src={
                                                                        selectedGroup.members.find(
                                                                            (
                                                                                m,
                                                                            ) =>
                                                                                m.name ===
                                                                                msg.sender,
                                                                        )
                                                                            ?.avatar
                                                                    }
                                                                />
                                                            )}
                                                            <div
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
                                                                        "100%",
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
                                                                <div>
                                                                    {renderMessageWithLinks(
                                                                        msg.text,
                                                                    )}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize: 10,
                                                                        color: "#999",
                                                                        marginTop: 4,
                                                                        textAlign:
                                                                            "right",
                                                                    }}
                                                                >
                                                                    {formatTime(
                                                                        msg.timestamp,
                                                                    )}
                                                                    {msg.sender ===
                                                                        "You" && (
                                                                        <span
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
                                    ),
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    padding: "12px 16px",
                                    gap: 8,
                                    borderTop: "1px solid #f0f0f0",
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
                                    loading={isLoadingChat}
                                >
                                    Send
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a group to start chatting
                        </div>
                    )}
                </div>
            </div>

            <ModalChatRename
                toggleModalChatRename={toggleModalChatRename}
                setToggleModalChatRename={setToggleModalChatRename}
                selectedGroup={selectedGroup}
            />
        </Modal>
    );
}
