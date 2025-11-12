import { createContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faPlus,
} from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";
import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    Flex,
    Row,
    Typography,
    Form,
    Divider,
    Table,
} from "antd";

import { GET } from "../../../../providers/useAxiosQuery";
import { useTableScrollOnTop } from "../../../../providers/CustomTableFilter";
import ModalFormEvent from "./ModalFormEvent";
import PageEventContextCalendar from "./PageEventContextCalendar";
import FloatSelect from "../../../../providers/FloatSelect";
import { useLocation } from "react-router-dom";
import { role, UserId } from "../../../../providers/appConfig";

export default function PageEventContentCalendar() {
    const UserIds = UserId("");
    const userRole = role("");

    const { data: dataUser } = GET(
        `api/users?id=${UserIds}`,
        "user_detail",
        () => {},
        false
    );

    const currentUser =
        dataUser?.data?.[0] ||
        dataUser?.data?.find((user) => user.id == UserIds);

    console.log("Current User:", currentUser);
    console.log("User Department ID:", currentUser?.department_id);

    const [toggleModalFormEvent, setToggleModalFormEvent] = useState({
        open: false,
        data: null,
    });
    const location = useLocation();

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [activeView, setActiveView] = useState("calendar");

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

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "title",
        sort_order: "asc",
        isTrash: 0,
        department_id: null,
    });

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
                        onClick={() =>
                            setToggleModalFormEvent({ open: true, data: item })
                        }
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

    const { data: departments } = GET(
        `api/departments`,
        "department_list",
        () => {},
        false
    );

    const onChangeTableFilter = (key, value) => {
        setTableFilter({
            ...tableFilter,
            [key]: value,
        });
    };

    useTableScrollOnTop("tbl_appointment", location);

    useEffect(() => {
        if (
            currentUser?.department_id &&
            tableFilter.department_id !== currentUser.department_id
        ) {
            setTableFilter((prev) => ({
                ...prev,
                department_id: currentUser.department_id,
            }));
        }
    }, [currentUser?.department_id]);

    // ✅ FIX: create form instance and set value after user is fetched
    const [form] = Form.useForm();

    useEffect(() => {
        if (currentUser?.department_id) {
            form.setFieldsValue({
                department_id: currentUser.department_id,
            });
        }
    }, [currentUser, form]);

    return (
        <PageEventContextCalendar.Provider
            value={{
                toggleModalFormEvent,
                setToggleModalFormEvent,
            }}
        >
            <div className="page-event-content-calendar">
                <Row gutter={[20, 20]} justify="center">
                    {userRole && userRole !== "Pico" && (
                        <Col span={24}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={<FontAwesomeIcon icon={faPlus} />}
                                    onClick={() =>
                                        setToggleModalFormEvent({
                                            open: true,
                                            data: null,
                                        })
                                    }
                                >
                                    Create Appointment Schedule
                                </Button>
                            </div>
                        </Col>
                    )}

                    <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                department_id:
                                    currentUser?.department_id || null,
                            }}
                        >
                            <Form.Item name="department_id">
                                <FloatSelect
                                    className="w-full"
                                    options={
                                        departments?.data
                                            ?.filter((dept) => {
                                                if (
                                                    currentUser?.department_id
                                                ) {
                                                    return (
                                                        dept.id ==
                                                        currentUser.department_id
                                                    );
                                                }
                                                return true;
                                            })
                                            ?.map((dept) => ({
                                                label: dept.department_name,
                                                value: dept.id,
                                            })) || []
                                    }
                                    label="Department"
                                    placeholder="Department"
                                    allowClear={false}
                                    disabled={userRole !== "Pico"}
                                    onChange={(value) =>
                                        onChangeTableFilter(
                                            "department_id",
                                            value
                                        )
                                    }
                                />
                            </Form.Item>
                        </Form>

                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Table
                                id="tbl_appointment"
                                dataSource={(
                                    dataAppointmentSchedules?.data || []
                                ).filter(
                                    (item) =>
                                        !currentUser?.department_id ||
                                        item.department_id ===
                                            currentUser.department_id
                                )}
                                pagination={false}
                                rowKey="id"
                                size="small"
                                style={{ width: "100%" }}
                            >
                                <Table.Column
                                    title="Type"
                                    dataIndex="appointment_type"
                                    key="appointment_type"
                                    render={(text) => (
                                        <Badge
                                            color={
                                                text === "Not Available"
                                                    ? "red"
                                                    : text === "Available"
                                                    ? "green"
                                                    : "blue"
                                            }
                                            text={text}
                                        />
                                    )}
                                />
                                <Table.Column
                                    title="Date"
                                    dataIndex="date"
                                    key="date"
                                    render={(text) =>
                                        dayjs(text).format("MMM DD, YYYY")
                                    }
                                />
                                <Table.Column
                                    title="Time"
                                    dataIndex="available_time"
                                    key="available_time"
                                />
                                <Table.Column
                                    title="Department"
                                    dataIndex="department_name"
                                    key="department_name"
                                />
                            </Table>
                        </Col>
                    </Col>

                    <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                        <Row gutter={[20, 20]}>
                            <Col span={24}>
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

                            <Col span={24}>
                                <Card>
                                    <Calendar
                                        value={currentDate}
                                        onChange={setCurrentDate}
                                        cellRender={dateCellRender}
                                        className="responsive-calendar"
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <ModalFormEvent currentUser={currentUser} />
                </Row>
            </div>
        </PageEventContextCalendar.Provider>
    );
}
