import { useNavigate } from "react-router-dom";
import { Table, Button, notification, Popconfirm, Flex } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faPencil,
    faTrash,
} from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";

import { POST } from "../../../../providers/useAxiosQuery";
import notificationErrors from "../../../../providers/notificationErrors";

export default function TableUser(props) {
    const { dataSource, setTableFilter } = props;

    const navigate = useNavigate();

    const { mutate: mutateToggleUserStatus, loading: loadingToggleUserStatus } =
        POST(`api/user_toggle_status`, "users_active_list");

    const handleToggleStatus = (record) => {
        mutateToggleUserStatus(record, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "User",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "User",
                        description: res.message,
                    });
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
        });
    };

    const onChangeTable = (pagination, filters, sorter) => {
        setTableFilter((ps) => ({
            ...ps,
            sort_field: sorter.columnKey,
            sort_order: sorter.order ? sorter.order.replace("end", "") : null,
            page: 1,
            page_size: "50",
        }));
    };

    return (
        <Table
            id="tbl_user"
            className="ant-table-default ant-table-striped"
            dataSource={dataSource && dataSource.data.data}
            rowKey={(record) => record.id}
            pagination={false}
            bordered={false}
            onChange={onChangeTable}
            scroll={{ x: "max-content" }}
            sticky
        >
            <Table.Column
                title="Action"
                key="action"
                dataIndex="action"
                align="center"
                render={(text, record) => (
                    <Flex gap={10} justify="center">
                        <Button
                            type="link"
                            className="w-auto h-auto p-0 text-blue-500!"
                            onClick={() => {
                                navigate(
                                    `${location.pathname}/edit/${record.id}`
                                );
                            }}
                            name="btn_edit"
                            icon={<FontAwesomeIcon icon={faPencil} />}
                        />
                        <Popconfirm
                            title={
                                record.status === "Active"
                                    ? "Are you sure to deactivate this user?"
                                    : "Are you sure to activate this user?"
                            }
                            onConfirm={() => handleToggleStatus(record)}
                            onCancel={() => {
                                notification.error({
                                    message: "User",
                                    description:
                                        record.status === "Active"
                                            ? "Data not deactivated"
                                            : "Data not activated",
                                });
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="link"
                                className={`w-auto h-auto p-0 ${
                                    record.status === "Active"
                                        ? "text-red-500!"
                                        : "text-green-500!"
                                }`}
                                loading={loadingToggleUserStatus}
                                name={
                                    record.status === "Active"
                                        ? "btn_deactivate"
                                        : "btn_activate"
                                }
                                icon={
                                    record.status === "Active" ? (
                                        <FontAwesomeIcon icon={faTrash} />
                                    ) : (
                                        <FontAwesomeIcon icon={faTrash} />
                                    )
                                }
                            >
                                {/* {record.status === "Active" ? "" : "Activate"} */}
                            </Button>
                        </Popconfirm>
                    </Flex>
                )}
                width={150}
            />
            <Table.Column
                title="Start Date"
                key="created_at"
                dataIndex="created_at"
                render={(text, _) =>
                    text ? dayjs(text).format("MM/DD/YYYY") : ""
                }
                width={150}
            />
            <Table.Column
                title="Full Name"
                key="fullname"
                dataIndex="fullname"
                align="center"
                render={(text, record) =>
                    text ? (
                        <Button
                            type="link"
                            className="p-0 w-auto h-auto"
                            onClick={() => {
                                navigate(
                                    `${location.pathname}/edit/${record.id}`
                                );
                            }}
                        >
                            {text}
                        </Button>
                    ) : null
                }
                width={150}
            />
            <Table.Column
                title="Email"
                key="email"
                dataIndex="email"
                align="center"
                render={(text, _) =>
                    text ? (
                        <Button
                            type="link"
                            className="p-0 w-auto h-auto"
                            icon={<FontAwesomeIcon icon={faEnvelope} />}
                            href={`mailto:${text}`}
                        />
                    ) : null
                }
                width={220}
            />
            <Table.Column
                title="Role"
                key="role"
                dataIndex="role"
                width={150}
            />
            <Table.Column
                title="Status"
                key="status"
                dataIndex="status"
                align="center"
                width={150}
                render={(text) =>
                    text === "Active" ? (
                        <span style={{ color: "green", fontWeight: 600 }}>
                            Active
                        </span>
                    ) : (
                        <span style={{ color: "red", fontWeight: 600 }}>
                            Deactivated
                        </span>
                    )
                }
            />
        </Table>
    );
}
