import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faList,
} from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";
import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    Flex,
    Form,
    notification,
    Row,
    Table,
    Typography,
} from "antd";

import { GET } from "../../../../providers/useAxiosQuery";

import { useTableScrollOnTop } from "../../../../providers/CustomTableFilter";
import FloatSelect from "../../../../providers/FloatSelect";
import ModalVisitorInformationForm from "./ModalVisitorInformationForm";
import ModalApplicationList from "./ModalApplicationList";

export default function PageVisitorRequestContent(props) {
    const { width } = props;

    const [
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
    ] = useState({
        open: false,
        data: null,
    });

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "title",
        sort_order: "asc",
        isTrash: 0,
        department_id: "",
    });

    const [toggleModalApplicationList, setToggleModalApplicationList] =
        useState({
            open: false,
            data: null,
        });

    const handleOpenModalVisitorInformationForm = () => {
        setToggleModalVisitorInformationForm({ open: true, data: null });
    };

    const [currentDate, setCurrentDate] = useState(dayjs());
    const location = useLocation();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(currentDate.subtract(1, "month"));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(currentDate.add(1, "month"));
    };

    const handleToday = () => {
        setCurrentDate(dayjs());
    };

    const { data: Usersdepartments } = GET(
        `api/users`,
        "department_list",
        () => {},
        false
    );

    const { data: dataAppointmentSchedules } = GET(
        `api/appointment_schedule`,
        "appointment_schedule_list",
        () => {},
        false
    );

    const getEventData = (date, events) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        return events.filter((event) => {
            const matchDate =
                dayjs(event.date).format("YYYY-MM-DD") === dateStr;
            const matchDept =
                !tableFilter.department_id ||
                event.department_id === tableFilter.department_id;
            return matchDate && matchDept;
        });
    };

    const dateCellRender = (value) => {
        const eventData = getEventData(
            value,
            dataAppointmentSchedules?.data || []
        );
        return (
            <ul
                style={{
                    paddingLeft: 0,
                    listStyle: "none",
                    textAlign: "center",
                }}
            >
                {eventData.map((item, index) => (
                    <li
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (item.appointment_type === "Not Available") {
                                notification.error({
                                    message: "Unavailable",
                                    description:
                                        "This appointment slot is not available.",
                                });
                                return;
                            }
                            setToggleModalVisitorInformationForm({
                                open: true,
                                data: item,
                            });
                        }}
                    >
                        <Typography.Text
                            className="text-sm font-semibold"
                            style={{
                                color:
                                    item.appointment_type === "Not Available"
                                        ? "red"
                                        : item.appointment_type === "Available"
                                        ? "green"
                                        : "inherit",
                                display: "inline-block",
                                textAlign: "center",
                            }}
                        >
                            {item.appointment_type}
                            <br />
                            <Typography.Text className="text-xs">
                                {item.available_time}
                            </Typography.Text>
                        </Typography.Text>
                    </li>
                ))}
            </ul>
        );
    };

    useTableScrollOnTop("tbl_page_visitor", location);

    const onChangeTableFilter = (key, value) => {
        setTableFilter({
            ...tableFilter,
            [key]: value,
        });
    };

    return (
        <Row gutter={[25, 40]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card>
                    <Form>
                        <Form.Item name="department_id">
                            <FloatSelect
                                placeholder="Select Office"
                                label="Select Office"
                                options={
                                    Usersdepartments?.data
                                        ? Usersdepartments.data
                                              .filter(
                                                  (item) =>
                                                      item.department_name !==
                                                          null &&
                                                      item.department_id !==
                                                          null
                                              )
                                              .map((item) => ({
                                                  label: item.department_name,
                                                  value: item.department_id,
                                              }))
                                        : []
                                }
                                onChange={(value) =>
                                    onChangeTableFilter("department_id", value)
                                }
                                allowClear
                            />
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col xs={7} sm={7} md={7} lg={7} xl={7}>
                <Card>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                            className="mt-4"
                        >
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Typography.Title level={4}>
                                        Application List
                                    </Typography.Title>
                                </div>
                            </Col>
                            <Table
                                dataSource={(
                                    dataAppointmentSchedules?.data || []
                                ).filter(
                                    (item) =>
                                        !tableFilter.department_id ||
                                        item.department_id ===
                                            tableFilter.department_id
                                )}
                                bordered
                                rowKey={(record) => record.key}
                                pagination={false}
                                size="middle"
                            >
                                <Table.Column
                                    title="Date"
                                    dataIndex="date"
                                    key="date"
                                    width={100}
                                />
                                <Table.Column
                                    title="Office"
                                    dataIndex="department_name"
                                    key="department_name"
                                    width={100}
                                />
                            </Table>{" "}
                        </Col>
                    </Row>
                </Card>
            </Col>

            <Col xs={17} sm={17} md={17} lg={17} xl={17}>
                <Card>
                    <Row gutter={20} className="w-full">
                        <Col xs={24} sm={18} md={18} lg={24}>
                            <Flex
                                justify="start"
                                align="center"
                                className="mb-4 gap-4"
                            >
                                <Button
                                    onClick={handleToday}
                                    className="px-5 py-2 border border-green-700 text-green-700 rounded-full flex items-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        onClick={handlePrevMonth}
                                        className="mr-2 cursor-pointer"
                                    />
                                    Today
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        onClick={handleNextMonth}
                                        className="ml-2 cursor-pointer"
                                    />
                                </Button>

                                <Typography.Title
                                    level={3}
                                    className="m-0 text-center flex-1 font-bold"
                                >
                                    {currentDate.format("MMMM YYYY")}
                                </Typography.Title>
                            </Flex>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Card>
                                <Calendar
                                    value={currentDate}
                                    fullscreen
                                    onChange={setCurrentDate}
                                    cellRender={dateCellRender}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>

            <ModalVisitorInformationForm
                toggleModalVisitorInformationForm={
                    toggleModalVisitorInformationForm
                }
                setToggleModalVisitorInformationForm={
                    setToggleModalVisitorInformationForm
                }
            />

            <ModalApplicationList
                toggleModalApplicationList={toggleModalApplicationList}
                setToggleModalApplicationList={setToggleModalApplicationList}
            />
        </Row>
    );
}
