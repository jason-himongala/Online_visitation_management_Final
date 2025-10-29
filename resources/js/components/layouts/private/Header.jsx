import { use, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Badge, Dropdown, Image, Layout, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/pro-light-svg-icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
    faBell,
    faMessages,
    faMessageMinus,
} from "@fortawesome/pro-solid-svg-icons";

import {
    apiUrl,
    defaultProfile,
    role,
    userData,
} from "../../providers/appConfig";
import ModalMessage from "./components/ModalMessage";
import { GET, POST } from "../../providers/useAxiosQuery";

export default function Header(props) {
    const { width, sideMenuCollapse, setSideMenuCollapse } = props;
    const [toggleModalOpenGroupChat, setToggleModalOpenGroupChat] = useState({
        open: false,
        data: null,
    });

    const [profilePicture, setProfilePicture] = useState(defaultProfile);

    const { data: dataUserNotifications, refetch: refetchSource } = GET(
        `api/user_notifications`,
        ["user_notifications_list", "visitation_information_submit"]
    );

    useEffect(() => {
        refetchSource();
    }, []);

    const { mutate: mutateVisitorInfo } = POST(
        `api/user_notifications`,
        "visitation_information_submit"
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (userData().profile_picture) {
            let profile_picture = userData().profile_picture.split("//");

            if (
                profile_picture[0] === "http:" ||
                profile_picture[0] === "https:"
            ) {
                setProfilePicture(userData().profile_picture);
            } else {
                setProfilePicture(apiUrl(userData().profile_picture));
            }
        }

        return () => {};
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        window.location.reload();
    };

    const menuNotification = () => {
        const notifications = Array.isArray(dataUserNotifications)
            ? dataUserNotifications
            : dataUserNotifications?.data || [];

        const dataUserNotificationsFiltered = notifications.filter(
            (item) => item.read === 0 && item.status === 1
        );

        const handleMarkAsRead = (notification) => {
            mutateVisitorInfo(
                {
                    id: notification.id,
                    read: 1,
                },
                {
                    onSuccess: () => {
                        notification.read = 1;
                        refetchSource();
                    },
                }
            );
        };

        const items = [
            {
                label: "Notifications",
                key: "0",
                className: "notification-header",
            },
            { type: "divider" },
        ];

        if (dataUserNotificationsFiltered.length > 0) {
            dataUserNotificationsFiltered.forEach((notification, index) => {
                items.push({
                    key: `notification-${notification.id || index}`,
                    label: (
                        <div
                            className="notification-wrapper"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleMarkAsRead(notification)}
                        >
                            <Typography.Text className="notification-title">
                                Notification #{notification.id}
                            </Typography.Text>
                            <br />
                            <Typography.Text
                                className="notification-time"
                                type="secondary"
                            >
                                {notification.created_at}
                            </Typography.Text>
                        </div>
                    ),
                });
            });

            items.push(
                { type: "divider" },
                {
                    key: "view-all",
                    label: (
                        <Typography.Link>
                            View All Notifications
                        </Typography.Link>
                    ),
                }
            );
        } else {
            items.push({
                label: "No notifications",
                key: "no-notifications",
                disabled: true,
            });
        }

        return items;
    };

    const menuProfile = () => {
        const items = [
            {
                key: "/account/details",
                className: "menu-item-profile-details",
                label: (
                    <div className="menu-item-details-wrapper">
                        <Image
                            preview={false}
                            src={profilePicture}
                            alt={userData().firstname}
                        />

                        <div className="info-wrapper">
                            <Typography.Text className="info-username">
                                {`${userData().firstname} ${
                                    userData().lastname
                                }`}
                            </Typography.Text>

                            <br />
                            <Typography.Text className="info-role">
                                {role()}
                            </Typography.Text>
                        </div>
                    </div>
                ),
            },
            {
                key: "/edit-profile",
                icon: <FontAwesomeIcon icon={faEdit} />,
                label: <Link to="/edit-profile">Edit Account Profile</Link>,
            },
        ];

        items.push({
            key: "/signout",
            className: "ant-menu-item-logout",
            icon: <FontAwesomeIcon icon={faPowerOff} />,
            label: (
                <Typography.Link onClick={handleLogout}>
                    Sign Out
                </Typography.Link>
            ),
        });

        return items;
    };

    return (
        <Layout.Header>
            <div className="header-left-menu">
                {width < 768 ? (
                    <div className="menu-left-icon menu-left-icon-menu-collapse-on-close">
                        {sideMenuCollapse ? (
                            <MenuUnfoldOutlined
                                onClick={() => setSideMenuCollapse(false)}
                                className="menuCollapseOnClose"
                            />
                        ) : (
                            <MenuFoldOutlined
                                onClick={() => setSideMenuCollapse(true)}
                                className="menuCollapseOnClose"
                            />
                        )}
                    </div>
                ) : null}
            </div>

            <div className="header-right-menu">
                {role() !== "Super Admin" && (
                    <FontAwesomeIcon
                        className="menu-submenu-message"
                        icon={faMessages}
                        onClick={() =>
                            setToggleModalOpenGroupChat({ open: true })
                        }
                    />
                )}

                {/* <Dropdown
                    menu={{
                        items: menuNotification(),
                    }}
                    placement="bottomRight"
                    overlayClassName="menu-submenu-notification-popup"
                    trigger={["click"]}
                >
                    <Badge
                        count={
                            dataUserNotifications
                                ? (Array.isArray(dataUserNotifications)
                                      ? dataUserNotifications
                                      : dataUserNotifications.data || []
                                  ).filter(
                                      (item) =>
                                          item.read === 0 && item.status === 1
                                  ).length
                                : 0
                        }
                        size="small"
                        color="red"
                        offset={[0, 5]}
                        showZero={false}
                    >
                        <FontAwesomeIcon
                            className="menu-submenu-notification"
                            icon={faBell}
                        />
                    </Badge>
                </Dropdown> */}

                <Dropdown
                    menu={{
                        items: menuProfile(),
                    }}
                    placement="bottomRight"
                    overlayClassName="menu-submenu-profile-popup"
                    trigger={["click"]}
                >
                    <Image
                        preview={false}
                        rootClassName="menu-submenu-profile"
                        src={profilePicture}
                        alt={userData().firstname}
                    />
                </Dropdown>
            </div>

            <ModalMessage
                toggleModalOpenGroupChat={toggleModalOpenGroupChat}
                setToggleModalOpenGroupChat={setToggleModalOpenGroupChat}
            />
        </Layout.Header>
    );
}

Header.propTypes = {
    width: PropTypes.number,
    sideMenuCollapse: PropTypes.bool,
    setSideMenuCollapse: PropTypes.func,
};
