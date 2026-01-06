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

    const [toggleModalFormEvent, setToggleModalFormEvent] = useState({
        open: false,
        data: null,
    });

    const location = useLocation();

    const [currentDate, setCurrentDate] = useState(dayjs());

    const [tableFilter, setTableFilter] = useState({
        department_id: null,
    });

    const { data: dataAppointmentSchedules } = GET(
        `api/appointment_schedule`,
        "appointment_schedule_list",
        () => {},
        false
    );

    const { data: departments } = GET(
        `api/departments`,
        "department_list",
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
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                {eventData.map((item, index) => {
                    const isImportant =
                        item.important_visit === 1 && item.important_notes;

                    return (
                        <li
                            key={index}
                            onClick={() =>
                                setToggleModalFormEvent({
                                    open: true,
                                    data: item,
                                })
                            }
                            style={{
                                cursor: "pointer",
                                marginBottom: 6,
                                padding: 6,
                                borderRadius: 6,
                                // backgroundColor: isImportant
                                //     ? "#fff7e6"
                                //     : "transparent",
                                // border: isImportant
                                //     ? "1px solid #faad14"
                                //     : "none",
                            }}
                        >
                            <Typography.Text
                                style={{
                                    fontWeight: 600,
                                    color: isImportant
                                        ? "#fa8c16"
                                        : item.appointment_type ===
                                          "Not Available"
                                        ? "red"
                                        : "green",
                                }}
                            >
                                {item.appointment_type}
                            </Typography.Text>
                            <br />
                            <Typography.Text className="text-xs">
                                {item.available_time}
                            </Typography.Text>

                            {isImportant && (
                                <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
                                    Official visit
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    useTableScrollOnTop("tbl_appointment", location);

    const [form] = Form.useForm();

    useEffect(() => {
        if (currentUser?.department_id) {
            form.setFieldsValue({
                department_id: currentUser.department_id,
            });
            setTableFilter({
                department_id: currentUser.department_id,
            });
        }
    }, [currentUser]);

    return (
        <PageEventContextCalendar.Provider
            value={{
                toggleModalFormEvent,
                setToggleModalFormEvent,
            }}
        >
            <Row gutter={[20, 20]}>
                {userRole !== "Pico" && (
                    <Col span={24}>
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
                    </Col>
                )}

                <Col xs={24} md={8}>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            department_id: currentUser?.department_id || null,
                        }}
                    >
                        <Form.Item name="department_id">
                            <FloatSelect
                                label="Department"
                                options={
                                    Array.isArray(departments?.data)
                                        ? departments.data.map((dept) => ({
                                              label: dept.department_name,
                                              value: dept.id,
                                          }))
                                        : []
                                }
                                disabled={userRole !== "Pico"}
                                onChange={(value) =>
                                    setTableFilter({
                                        department_id: value,
                                    })
                                }
                            />
                        </Form.Item>
                    </Form>

                    <Table
                        id="tbl_appointment"
                        size="small"
                        pagination={false}
                        rowKey="id"
                        dataSource={
                            dataAppointmentSchedules?.data?.filter(
                                (item) =>
                                    !tableFilter.department_id ||
                                    item.department_id ===
                                        tableFilter.department_id
                            ) || []
                        }
                        rowClassName={(record) =>
                            record.important_visit === 1 &&
                            record.important_notes
                                ? "important-row"
                                : ""
                        }
                    >
                        <Table.Column
                            title="Type"
                            dataIndex="appointment_type"
                            render={(text) => (
                                <Badge
                                    color={
                                        text === "Not Available"
                                            ? "red"
                                            : "green"
                                    }
                                    text={text}
                                />
                            )}
                        />
                        <Table.Column
                            title="Date"
                            dataIndex="date"
                            render={(text) =>
                                dayjs(text).format("MMM DD, YYYY")
                            }
                        />
                        <Table.Column title="Time" dataIndex="available_time" />
                        <Table.Column
                            title="Official visit"
                            render={(_, record) =>
                                record.important_visit === 1 &&
                                record.important_notes ? (
                                    <Badge color="gold" text="Official visit" />
                                ) : (
                                    "-"
                                )
                            }
                        />
                    </Table>
                </Col>

                <Col xs={24} md={16}>
                    <Flex justify="space-between" align="center">
                        <Button onClick={() => setCurrentDate(dayjs())}>
                            Today
                        </Button>

                        <Typography.Title level={3}>
                            {currentDate.format("MMMM YYYY")}
                        </Typography.Title>

                        <div>
                            <FontAwesomeIcon
                                icon={faChevronLeft}
                                onClick={() =>
                                    setCurrentDate(
                                        currentDate.subtract(1, "month")
                                    )
                                }
                                className="mr-3 cursor-pointer"
                            />
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                onClick={() =>
                                    setCurrentDate(currentDate.add(1, "month"))
                                }
                                className="cursor-pointer"
                            />
                        </div>
                    </Flex>

                    <Card>
                        <Calendar
                            value={currentDate}
                            onChange={setCurrentDate}
                            cellRender={dateCellRender}
                        />
                    </Card>
                </Col>

                <ModalFormEvent currentUser={currentUser} />
            </Row>
        </PageEventContextCalendar.Provider>
    );
}
