import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faList,
    faTimes,
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
    Tag,
    Typography,
} from "antd";

import { GET } from "../../../../providers/useAxiosQuery";
import { useTableScrollOnTop } from "../../../../providers/CustomTableFilter";
import FloatSelect from "../../../../providers/FloatSelect";
import ModalVisitorInformationForm from "./ModalVisitorInformationForm";
import ModalApplicationList from "./ModalApplicationList";

export default function PageVisitorRequestContent(props) {
    const { width } = props;
    const location = useLocation();

    const [
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
    ] = useState({
        open: false,
        data: null,
        selectedAppointments: [],
    });

    const [toggleModalApplicationList, setToggleModalApplicationList] =
        useState({
            open: false,
            data: null,
        });

    const [tableFilter, setTableFilter] = useState({
        department_ids: [],
    });

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedAppointments, setSelectedAppointments] = useState([]);

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

    const handleClearSelection = () => {
        setSelectedAppointments([]);
        notification.info({
            message: "Selection Cleared",
            description: "All selected appointments have been cleared.",
        });
    };

    const { data: Usersdepartments } = GET(
        `api/users`,
        "department_list",
        () => {},
        false,
    );

    const { data: dataAppointmentSchedules } = GET(
        `api/appointment_schedule`,
        "appointment_schedule_list",
        () => {},
        false,
    );

    const getEventData = (date, events) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        return events.filter((event) => {
            const matchDate =
                dayjs(event.date).format("YYYY-MM-DD") === dateStr;
            const matchDept =
                !tableFilter.department_ids.length ||
                tableFilter.department_ids.includes(event.department_id);
            return matchDate && matchDept;
        });
    };

    const handleCellClick = (item) => {
        if (item.appointment_type === "Not Available") {
            notification.error({
                message: "Unavailable",
                description: "This appointment slot is not available.",
            });
            return;
        }

        const isSelected = selectedAppointments.some(
            (selected) => selected.id === item.id,
        );

        if (isSelected) {
            setSelectedAppointments((prev) =>
                prev.filter((selected) => selected.id !== item.id),
            );
            notification.info({
                message: "Removed",
                description: `Removed ${item.department_name} - ${item.available_time}`,
            });
        } else {
            const sameDeptTime = selectedAppointments.find(
                (selected) =>
                    selected.department_id === item.department_id &&
                    selected.available_time === item.available_time &&
                    selected.date === item.date,
            );

            if (sameDeptTime) {
                notification.warning({
                    message: "Already Selected",
                    description:
                        "You have already selected this time slot for this department.",
                });
                return;
            }

            setSelectedAppointments((prev) => [...prev, item]);
            notification.success({
                message: "Added",
                description: `Added ${item.department_name} - ${item.available_time}`,
            });
        }
    };

    const dateCellRender = (value) => {
        const eventData = getEventData(
            value,
            dataAppointmentSchedules?.data || [],
        );

        return (
            <ul
                style={{
                    paddingLeft: 0,
                    listStyle: "none",
                    textAlign: "center",
                }}
            >
                {eventData.map((item, index) => {
                    const isSelected = selectedAppointments.some(
                        (selected) => selected.id === item.id,
                    );
                    const isImportant =
                        item.important_visit === 1 && item.important_notes;

                    return (
                        <li
                            key={index}
                            style={{
                                cursor: "pointer",
                                marginBottom: 6,
                                padding: 6,
                                borderRadius: 6,
                                // backgroundColor: isSelected
                                //     ? "#e6f7ff"
                                //     : "transparent",
                                // border: isSelected
                                //     ? "2px solid #1890ff"
                                //     : "1px solid #f0f0f0",
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => handleCellClick(item)}
                        >
                            <Typography.Text
                                className="text-sm font-semibold"
                                style={{
                                    color:
                                        item.appointment_type ===
                                        "Not Available"
                                            ? "#ff4d4f"
                                            : item.appointment_type ===
                                                "Available"
                                              ? "#52c41a"
                                              : "#1890ff",
                                }}
                            >
                                {item.appointment_type}
                                <br />
                                <Typography.Text className="text-xs">
                                    {item.available_time}
                                </Typography.Text>
                            </Typography.Text>

                            {isImportant && (
                                <div style={{ marginTop: 4 }}>
                                    <Badge
                                        status="warning"
                                        text={
                                            <span className="text-xs font-bold">
                                                {item.important_notes}
                                            </span>
                                        }
                                    />
                                </div>
                            )}

                            {isSelected && (
                                <div className="mt-2">
                                    <Tag color="blue" className="text-xs">
                                        Selected
                                    </Tag>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    useTableScrollOnTop("tbl_page_visitor", location);

    return (
        <>
            <Row gutter={[25, 40]}>
                <Col span={24}>
                    <Card></Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form>
                        <Form.Item name="department_ids">
                            <FloatSelect
                                label="Select Office(s)"
                                placeholder="Select Office(s)"
                                options={
                                    Usersdepartments?.data
                                        ? Usersdepartments.data
                                              .filter(
                                                  (item) =>
                                                      item.department_name &&
                                                      item.department_id,
                                              )
                                              .map((item) => ({
                                                  label: item.department_name,
                                                  value: item.department_id,
                                              }))
                                        : []
                                }
                                allowClear
                                onChange={(values) =>
                                    setTableFilter({
                                        department_ids: values || [],
                                    })
                                }
                            />
                        </Form.Item>
                    </Form>
                </Col>

                <Col xs={24} md={7}>
                    <Card>
                        <Typography.Title
                            level={4}
                            style={{ textAlign: "center" }}
                        >
                            Selected Appointments
                        </Typography.Title>

                        {selectedAppointments.length > 0 ? (
                            <>
                                <Table
                                    bordered
                                    pagination={false}
                                    size="small"
                                    rowKey="id"
                                    dataSource={selectedAppointments}
                                    scroll={{ y: 300 }}
                                >
                                    <Table.Column
                                        title="Date"
                                        dataIndex="date"
                                        render={(date) =>
                                            dayjs(date).format("MMM DD, YYYY")
                                        }
                                    />
                                    <Table.Column
                                        title="Office"
                                        dataIndex="department_name"
                                    />
                                    <Table.Column
                                        title="Time"
                                        dataIndex="available_time"
                                    />
                                    <Table.Column
                                        title="Action"
                                        render={(_, record) => (
                                            <Button
                                                type="text"
                                                danger
                                                size="small"
                                                icon={
                                                    <FontAwesomeIcon
                                                        icon={faTimes}
                                                    />
                                                }
                                                onClick={() =>
                                                    handleCellClick(record)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    />
                                </Table>

                                <br />

                                <Flex justify="space-between" className="mt-4">
                                    <Button
                                        type="default"
                                        danger
                                        onClick={handleClearSelection}
                                    >
                                        Clear All
                                    </Button>

                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            if (
                                                selectedAppointments.length ===
                                                0
                                            ) {
                                                notification.warning({
                                                    message:
                                                        "No appointments selected",
                                                    description:
                                                        "Please select at least one appointment slot.",
                                                });
                                                return;
                                            }
                                            setToggleModalVisitorInformationForm(
                                                {
                                                    open: true,
                                                    data: selectedAppointments[0],
                                                    selectedAppointments:
                                                        selectedAppointments,
                                                },
                                            );
                                        }}
                                    >
                                        Preview Request
                                    </Button>
                                </Flex>
                            </>
                        ) : (
                            <Typography.Text
                                type="secondary"
                                className="block text-center py-8"
                            >
                                No appointments selected. Click on available
                                time slots in the calendar to select.
                            </Typography.Text>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={17}>
                    <Card>
                        <Flex
                            justify="space-between"
                            align="center"
                            className="mb-4"
                        >
                            <Flex align="center" gap={20}>
                                <Button
                                    onClick={handleToday}
                                    className="px-5 py-2 border border-green-700 text-green-700 rounded-full"
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        onClick={handlePrevMonth}
                                        className="mr-2"
                                    />
                                    Today
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        onClick={handleNextMonth}
                                        className="ml-2"
                                    />
                                </Button>

                                <Typography.Title level={3} className="m-0">
                                    {currentDate.format("MMMM YYYY")}
                                </Typography.Title>
                            </Flex>

                            {selectedAppointments.length > 0 && (
                                <Tag color="blue" className="text-lg px-4 py-1">
                                    {selectedAppointments.length} appointment(s)
                                    selected
                                </Tag>
                            )}
                        </Flex>

                        <Calendar
                            value={currentDate}
                            fullscreen
                            onChange={setCurrentDate}
                            cellRender={dateCellRender}
                        />
                    </Card>
                </Col>
            </Row>

            <ModalVisitorInformationForm
                toggleModalVisitorInformationForm={
                    toggleModalVisitorInformationForm
                }
                setToggleModalVisitorInformationForm={
                    setToggleModalVisitorInformationForm
                }
                selectedAppointments={selectedAppointments}
                setSelectedAppointments={setSelectedAppointments}
            />

            <ModalApplicationList
                toggleModalApplicationList={toggleModalApplicationList}
                setToggleModalApplicationList={setToggleModalApplicationList}
            />
        </>
    );
}
