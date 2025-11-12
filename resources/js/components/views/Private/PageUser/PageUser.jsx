import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Button, Col, Flex, Card, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";

import { GET } from "../../../providers/useAxiosQuery";
import TableUser from "./components/TableUser";
import {
    TableGlobalSearchAnimated,
    TablePageSize,
    TablePagination,
    TableShowingEntriesV2,
} from "../../../providers/CustomTableFilter";
import useTableScrollOnTop from "../../../providers/useTableScrollOnTop";

export default function PageUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at",
        sort_order: "desc",
        status: "Active",
        from: location.pathname,
    });

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/users?${new URLSearchParams(tableFilter)}`,
        ["users_active_list", "check_user_permission"]
    );

    useEffect(() => {
        refetchSource();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFilter]);

    useTableScrollOnTop("tbl_user", location);

    return (
        <Card>
            <Row gutter={[20, 20]} id="tbl_wrapper">
                <Col xs={24}>
                    <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => navigate(`/user-profile/add`)}
                        name="btn_add"
                        shape="round"
                    >
                        Add User
                    </Button>
                </Col>

                <Col xs={24}>
                    <Flex
                        className="tbl-top-filter"
                        justify="space-between"
                        align="center"
                    >
                        <Flex gap={10} align="center">
                            <Button
                                className="btn-active-archived"
                                type={
                                    tableFilter.status === "Active"
                                        ? "primary"
                                        : ""
                                }
                                shape="round"
                                onClick={() =>
                                    setTableFilter((prev) => ({
                                        ...prev,
                                        status: "Active",
                                        page: 1,
                                    }))
                                }
                            >
                                Active
                            </Button>

                            <Button
                                className="btn-active-archived"
                                type={
                                    tableFilter.status === "Deactivated"
                                        ? "primary"
                                        : ""
                                }
                                shape="round"
                                onClick={() =>
                                    setTableFilter((prev) => ({
                                        ...prev,
                                        status: "Deactivated",
                                        page: 1,
                                    }))
                                }
                            >
                                Deactivated
                            </Button>
                        </Flex>

                        <TablePageSize
                            tableFilter={tableFilter}
                            setTableFilter={setTableFilter}
                        />
                    </Flex>
                </Col>

                <Col xs={24}>
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
                                                Are you sure you want to <br />
                                                {tableFilter.status === "Active"
                                                    ? "deactivate"
                                                    : "activate"}{" "}
                                                the selected{" "}
                                                {selectedRowKeys.length > 1
                                                    ? "users"
                                                    : "user"}
                                                ?
                                            </>
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => {
                                            handleSelectedArchived();
                                        }}
                                    >
                                        <Button
                                            name="btn_active_archive"
                                            danger={
                                                tableFilter.status === "Active"
                                            }
                                            type="primary"
                                            className={
                                                tableFilter.status ===
                                                "Deactivated"
                                                    ? "btn-success"
                                                    : ""
                                            }
                                        >
                                            {tableFilter.status === "Active"
                                                ? "DEACTIVATE"
                                                : "ACTIVATE"}{" "}
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
                                    total={dataSource?.data?.total}
                                    showLessItems={true}
                                    showSizeChanger={false}
                                    tblIdWrapper="tbl_wrapper_position"
                                />
                            </Flex>
                        </Flex>
                    </div>
                </Col>

                <Col xs={24}>
                    <TableUser
                        dataSource={dataSource}
                        tableFilter={tableFilter}
                        setTableFilter={setTableFilter}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectedRowKeys}
                    />
                </Col>

                <Col xs={24}>
                    <Flex
                        justify="space-between"
                        align="center"
                        className="tbl-bottom-filter"
                    >
                        <div />
                        <Flex align="center">
                            <TableShowingEntriesV2 />
                            <TablePagination
                                tableFilter={tableFilter}
                                setTableFilter={setTableFilter}
                                showLessItems={true}
                                showSizeChanger={false}
                                tblIdWrapper="tbl_wrapper"
                                total={dataSource?.data?.total}
                            />
                        </Flex>
                    </Flex>
                </Col>
            </Row>
        </Card>
    );
}
