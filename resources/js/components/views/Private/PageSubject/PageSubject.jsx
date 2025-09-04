import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { Row, Button, Col, Table, notification, Popconfirm, Flex } from "antd";

import { GET, POST } from "../../../../../providers/useAxiosQuery";
import {
    TableGlobalSearchAnimated,
    TablePageSize,
    TablePagination,
    TableShowingEntriesV2,
    useTableScrollOnTop,
} from "../../../../../providers/CustomTableFilter";
import notificationErrors from "../../../../../providers/notificationErrors";
import ModalFormSubject from "./components/ModalFormSubject";

export default function PageSubject() {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const location = useLocation();

    const [toggleModalSubject, setToggleModalSubject] = useState({
        open: false,
        data: null,
    });

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "subject",
        sort_order: "asc",
        isTrash: 0,
    });

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/subject?${new URLSearchParams(tableFilter)}`,
        "subject_list"
    );

    const onChangeTable = (sorter) => {
        setTableFilter((prevState) => ({
            ...prevState,
            sort_field: sorter.columnKey,
            sort_order: sorter.order ? sorter.order.replace("end", "") : null,
            page: 1,
            page_size: "50",
        }));
    };

    useEffect(() => {
        if (dataSource) {
            refetchSource();
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFilter]);

    const { mutate: mutateArchiveSubject, loading: isLoadingArchiveSubject } =
        POST(`api/subject_archive`, "subject_list");

    const handleSelectedArchived = () => {
        mutateArchiveSubject(
            {
                isTrash: tableFilter.isTrash,
                ids: selectedRowKeys,
            },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        notification.success({
                            message: "Subject",
                            description: res.message,
                        });
                        setSelectedRowKeys([]);
                        refetchSource();
                    } else {
                        notification.error({
                            message: "Subject",
                            description: res.message,
                        });
                    }
                },
                onError: (err) => {
                    notificationErrors(err);
                },
            }
        );
    };
    useTableScrollOnTop("tbl_subject", location);

    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                <Row gutter={[20, 20]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={() =>
                                setToggleModalSubject({
                                    open: true,
                                    data: null,
                                })
                            }
                        >
                            Add Subject
                        </Button>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Flex
                            className="tbl-top-filter"
                            justify="space-between"
                            align="center"
                        >
                            <Flex gap={10} align="center">
                                <Button
                                    className="btn-active-archived"
                                    type={
                                        tableFilter.isTrash === 0
                                            ? "primary"
                                            : ""
                                    }
                                    shape="round"
                                    onClick={() => {
                                        setTableFilter((ps) => ({
                                            ...ps,
                                            isTrash: 0,
                                        }));
                                    }}
                                >
                                    Active
                                </Button>

                                <Button
                                    className="btn-active-archived"
                                    type={
                                        tableFilter.isTrash === 1
                                            ? "primary"
                                            : ""
                                    }
                                    shape="round"
                                    onClick={() => {
                                        setTableFilter((ps) => ({
                                            ...ps,
                                            isTrash: 1,
                                        }));
                                    }}
                                >
                                    Archived
                                </Button>
                            </Flex>

                            <TablePageSize
                                tableFilter={tableFilter}
                                setTableFilter={setTableFilter}
                            />
                        </Flex>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="tbl-top-filter">
                            <Flex justify="space-between" align="center">
                                <Flex gap={15}>
                                    <TableGlobalSearchAnimated
                                        tableFilter={tableFilter}
                                        setTableFilter={setTableFilter}
                                    />
                                    {selectedRowKeys.length > 0 && (
                                        <Popconfirm
                                            title={
                                                <>
                                                    Are you sure you want to
                                                    <br />
                                                    {tableFilter.isTrash === 0
                                                        ? "archive"
                                                        : "restore"}{" "}
                                                    the selected{" "}
                                                    {selectedRowKeys.length > 1
                                                        ? "Subjects"
                                                        : "Subject"}{" "}
                                                    ?
                                                </>
                                            }
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => {
                                                handleSelectedArchived();
                                            }}
                                            disabled={isLoadingArchiveSubject}
                                        >
                                            <Button
                                                shape="round"
                                                type="primary"
                                                name="btn_active_archive"
                                                style={{
                                                    backgroundColor:
                                                        tableFilter.isTrash ===
                                                        0
                                                            ? "#ff4d4f"
                                                            : "#52c41a",
                                                    borderColor:
                                                        tableFilter.isTrash ===
                                                        0
                                                            ? "#ff4d4f"
                                                            : "#52c41a",
                                                    color:
                                                        tableFilter.isTrash ===
                                                        0
                                                            ? "#fff"
                                                            : "#000",
                                                }}
                                                loading={
                                                    isLoadingArchiveSubject
                                                }
                                                danger={
                                                    tableFilter.isTrash === 0
                                                }
                                                className={
                                                    tableFilter.isTrash === 1
                                                        ? "btn-success"
                                                        : ""
                                                }
                                            >
                                                {tableFilter.isTrash === 0
                                                    ? "ARCHIVE"
                                                    : "RESTORE"}{" "}
                                                SELECTED
                                            </Button>
                                        </Popconfirm>
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

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table
                            id="tbl_subject"
                            className="ant-table-default ant-table-striped"
                            dataSource={dataSource && dataSource.data.data}
                            rowKey={(record) => record.id}
                            pagination={false}
                            bordered={false}
                            onChange={onChangeTable}
                            scroll={{ x: "max-content" }}
                            sticky
                            rowSelection={{
                                selectedRowKeys,
                                onChange: (selectedRowKeys) => {
                                    setSelectedRowKeys(selectedRowKeys);
                                },
                            }}
                        >
                            <Table.Column
                                title="Action"
                                key="action"
                                dataIndex="action"
                                align="center"
                                width={100}
                                render={(text, record) => {
                                    return (
                                        <Flex justify="center">
                                            <Button
                                                type="link"
                                                className="color-1"
                                                onClick={() =>
                                                    setToggleModalSubject({
                                                        open: true,
                                                        data: record,
                                                    })
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    style={{ color: "#1677ff" }}
                                                />
                                            </Button>
                                        </Flex>
                                    );
                                }}
                            />

                            <Table.Column
                                title="Created At"
                                key="created_at_format"
                                dataIndex="created_at_format"
                                sorter={true}
                                width={200}
                            />
                            <Table.Column
                                title="Subject Name"
                                key="subject"
                                dataIndex="subject"
                                sorter={true}
                                width={200}
                            />
                        </Table>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="tbl-bottom-filter">
                            <Flex justify="end" align="center" gap={10}>
                                <TableShowingEntriesV2 />
                                <TablePagination
                                    tableFilter={tableFilter}
                                    setTableFilter={setTableFilter}
                                    total={dataSource?.data.total}
                                    showLessItems={true}
                                    showSizeChanger={false}
                                    tblIdWrapper="tbl_wrapper_section"
                                />
                            </Flex>
                        </div>
                    </Col>
                </Row>
            </Col>

            <Col xs={24} sm={24} md={24} lg={10} xl={12}>
                <ModalFormSubject
                    toggleModalSubject={toggleModalSubject}
                    setToggleModalSubject={setToggleModalSubject}
                    refetchSource={refetchSource}
                />
            </Col>
        </Row>
    );
}
