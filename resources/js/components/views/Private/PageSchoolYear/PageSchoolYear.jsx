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
import ModalFormSchoolYear from "./component/ModalFormSchoolYear";

export default function PageSchoolYear() {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [toggleModalSchoolYear, setToggleModalSchoolYear] = useState({
        open: false,
        data: null,
    });

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "date_formated",
        sort_order: "asc",
        isTrash: 0,
    });

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/school_year?${new URLSearchParams(tableFilter)}`,
        "school_year_list"
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

    const {
        mutate: mutateArchiveSchoolYear,
        loading: isLoadingArchiveSchoolYear,
    } = POST(`api/school_year_archive`, "school_year_list");

    const handleSelectedArchived = () => {
        mutateArchiveSchoolYear(
            {
                isTrash: tableFilter.isTrash,
                ids: selectedRowKeys,
            },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        notification.success({
                            message: "School Year",
                            description: res.message,
                        });
                        setSelectedRowKeys([]);
                        refetchSource();
                    } else {
                        notification.error({
                            message: "School Year",
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
    const location = useLocation();

    useTableScrollOnTop("tbl_school_year", location);

    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                <Row gutter={[20, 20]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Button
                            shape="round"
                            type="primary"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={() =>
                                setToggleModalSchoolYear({
                                    open: true,
                                    data: null,
                                })
                            }
                        >
                            Add School Year
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
                                                        ? "School Years"
                                                        : "School Year"}{" "}
                                                    ?
                                                </>
                                            }
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => {
                                                handleSelectedArchived();
                                            }}
                                            disabled={
                                                isLoadingArchiveSchoolYear
                                            }
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
                                                    isLoadingArchiveSchoolYear
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
                            id="tbl_school_year"
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
                                                    setToggleModalSchoolYear({
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
                                key="created_at_formatted"
                                dataIndex="created_at_formatted"
                                width={150}
                            />

                            <Table.Column
                                title="Sy From"
                                key="data_formated_sy_from_year"
                                dataIndex="data_formated_sy_from_year"
                                sorter={true}
                                width={150}
                            />
                            <Table.Column
                                title="Sy To"
                                key="data_formated_sy_to_year"
                                dataIndex="data_formated_sy_to_year"
                                sorter={true}
                                width={150}
                            />
                            <Table.Column
                                title="Status"
                                key="status"
                                dataIndex="status"
                                width={100}
                                sorter={true}
                                render={(text, record) => {
                                    return (
                                        <span>
                                            {record.status === 0
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    );
                                }}
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
                                    tblIdWrapper="tbl_wrapper_position"
                                />
                            </Flex>
                        </div>
                    </Col>
                </Row>
            </Col>

            <Col xs={24} sm={24} md={24} lg={10} xl={12}>
                <ModalFormSchoolYear
                    toggleModalSchoolYear={toggleModalSchoolYear}
                    setToggleModalSchoolYear={setToggleModalSchoolYear}
                />
            </Col>
        </Row>
    );
}
