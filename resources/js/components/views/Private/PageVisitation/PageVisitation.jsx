import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    faEdit,
    faEye,
    faPlus,
    faTrash,
    faFolder,
    faFile,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    Card,
    Col,
    Flex,
    Modal,
    Popconfirm,
    Row,
    Table,
    Tag,
    notification,
} from "antd";
import dayjs from "dayjs";

import { GET, POST } from "../../../providers/useAxiosQuery";
import {
    TableGlobalSearchAnimated,
    TablePageSize,
    TablePagination,
    TableShowingEntriesV2,
    useTableScrollOnTop,
} from "../../../providers/CustomTableFilter";
import PageVisitationContent from "./component.jsx/PageVisitionContent";
import { role } from "../../../providers/appConfig";

export default function PageVisitation() {
    const navigate = useNavigate();
    const location = useLocation();

    const userRole = role();

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "id",
        sort_order: "desc",
        isTrash: 0,
        status: "",
    });

    const [toggleModalVisitationForm, setToggleModalVisitationForm] = useState({
        open: false,
        data: null,
    });

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/visitation_forms?${new URLSearchParams(tableFilter)}`,
        "profile_list",
    );

    const onChangeTable = (pagination, filters, sorter) => {
        console.log("pagination", pagination);
        setTableFilter((prevState) => ({
            ...prevState,
            page: 1,
            page_size: "50",
        }));
    };

    useEffect(() => {
        refetchSource();
    }, [tableFilter]);

    useTableScrollOnTop("tbl_profiles", location.pathname);

    return (
        <Card>
            <Row gutter={[20, 20]} id="tbl_wrapper">
                <Col xs={24} sm={24} md={24}>
                    <Flex
                        className="tbl-top-filter"
                        justify="space-between"
                        align="center"
                    >
                        <TableGlobalSearchAnimated
                            tableFilter={tableFilter}
                            setTableFilter={setTableFilter}
                        />

                        <Flex align="center">
                            <TableShowingEntriesV2 />
                            <TablePagination
                                tableFilter={tableFilter}
                                setTableFilter={setTableFilter}
                                total={
                                    dataSource &&
                                    dataSource.data &&
                                    dataSource.data.total > 0
                                        ? dataSource.data.total
                                        : 0
                                }
                                showLessItems={true}
                                showSizeChanger={false}
                                tblIdWrapper="tbl_wrapper"
                            />
                        </Flex>
                    </Flex>
                </Col>

                <Col xs={24} sm={24} md={24}>
                    <Table
                        id="tbl_profiles"
                        dataSource={
                            dataSource && dataSource.data.data
                                ? dataSource.data.data
                                : []
                        }
                        rowKey={(record) => record.id}
                        pagination={false}
                        bordered
                        onChange={onChangeTable}
                        scroll={{ x: "max-content" }}
                        sticky
                    >
                        <Table.Column
                            title="View"
                            key="action"
                            dataIndex="action"
                            align="center"
                            width={100}
                            render={(_text, record) => {
                                return (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        gap={5}
                                    >
                                        <Button
                                            type="link"
                                            name="btn_edit"
                                            onClick={() => {
                                                setToggleModalVisitationForm({
                                                    open: true,
                                                    data: record,
                                                });
                                            }}
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    style={{ color: "#1677ff" }}
                                                />
                                            }
                                        />
                                    </Flex>
                                );
                            }}
                        />

                        <Table.Column
                            title="Name"
                            key="fullname"
                            dataIndex="fullname"
                            sorter
                            width={180}
                            render={(_text, record) => {
                                const profile =
                                    record.visitation_information?.profile;
                                return (
                                    <span>
                                        {profile?.firstname || ""}{" "}
                                        {profile?.lastname || ""}
                                    </span>
                                );
                            }}
                        />
                        <Table.Column
                            title="Date"
                            key="created_at_formatted"
                            dataIndex="created_at_formatted"
                            sorter
                            width={150}
                        />
                    </Table>
                </Col>

                <Col xs={24} sm={24} md={24}>
                    <Flex
                        className="tbl-bottom-filter"
                        justify="end"
                        align="center"
                    >
                        <TableShowingEntriesV2 />
                        <TablePagination
                            tableFilter={tableFilter}
                            setTableFilter={setTableFilter}
                            total={
                                dataSource &&
                                dataSource.data &&
                                dataSource.data.total > 0
                                    ? dataSource.data.total
                                    : 0
                            }
                            showLessItems={true}
                            showSizeChanger={false}
                            tblIdWrapper="tbl_wrapper"
                        />
                    </Flex>
                </Col>
            </Row>

            <PageVisitationContent
                toggleModalVisitationForm={toggleModalVisitationForm}
                setToggleModalVisitationForm={setToggleModalVisitationForm}
                userRole={userRole}
                tableFilter={tableFilter}
            />
        </Card>
    );
}
