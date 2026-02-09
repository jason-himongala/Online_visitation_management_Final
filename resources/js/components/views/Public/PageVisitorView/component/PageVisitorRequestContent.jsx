import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { userData } from "../../../../providers/appConfig";

export default function PageVisitorRequestContent(props) {
    const { width } = props;
    const location = useLocation();
    const profileId = userData().profile_id;
    console.log("profileId:", profileId);

    const [
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
    ] = useState({
        open: false,
        data: null,
        selectedAppointments: [],
    });

    const [
        tableFilterVisitationInformation,
        setTableFilterVisitationInformation,
    ] = useState({
        available_time: "",
    });

    const {
        data: dataAppointmentSchedulesVisitationInformation,
        refetch: refetchAppointmentSchedulesVisitationInformation,
    } = GET(
        `api/visitation_information?${new URLSearchParams(tableFilterVisitationInformation)}`,
        "visitation_information_list",
        () => {},
        false,
    );

    useEffect(() => {
        refetchAppointmentSchedulesVisitationInformation();
        return () => {};
    }, [tableFilterVisitationInformation]);

    const [toggleModalApplicationList, setToggleModalApplicationList] =
        useState({
            open: false,
            data: null,
        });

    const [tableFilter, setTableFilter] = useState({
        department_id: "",
    });

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [currentUserProfileId, setCurrentUserProfileId] = useState(null);

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

    const {
        data: dataAppointmentSchedules,
        refetch: refetchAppointmentSchedules,
    } = GET(
        `api/appointment_schedule?${new URLSearchParams(tableFilter)}`,
        "appointment_schedule_list",
        () => {},
        false,
    );

    useEffect(() => {
        refetchAppointmentSchedules();
        return () => {};
    }, [tableFilter]);

    const getEventData = (date, events) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        return events.filter((event) => {
            const matchDate =
                dayjs(event.date).format("YYYY-MM-DD") === dateStr;
            const matchDept =
                !tableFilter.department_id.length ||
                tableFilter.department_id.includes(event.department_id);
            return matchDate && matchDept;
        });
    };

    const normalizeTime = (timeStr) => {
        if (!timeStr) return "";

        if (timeStr.toLowerCase().includes("whole")) {
            return "Whole Day";
        }

        return timeStr
            .trim()
            .toUpperCase()
            .replace(/\s+/g, " ")
            .replace(/AM/g, "AM")
            .replace(/PM/g, "PM")
            .replace(/^(\d:\d\d)/, "0$1");
    };

    const isTimeSlotInRange = (timeSlot, timeRange) => {
        if (timeRange === "Whole Day") {
            return true;
        }

        const rangeParts = timeRange.split(" - ");
        if (rangeParts.length !== 2) return false;

        const [rangeStart, rangeEnd] = rangeParts;

        const slotParts = timeSlot.split(" - ");
        if (slotParts.length !== 2) return false;

        const [slotStart, slotEndWithPeriod] = slotParts;

        const slotEndMatch = slotEndWithPeriod.match(/(\d+:\d+)\s*([AP]M)/i);
        if (!slotEndMatch) return false;

        const slotEnd = slotEndMatch[1];
        const slotPeriod = slotEndMatch[2].toUpperCase();

        const convertToMinutes = (timeStr) => {
            const time = timeStr.trim();
            const isPM = time.toLowerCase().includes("pm");
            const timeWithoutPeriod = time.replace(/[APMapm]/g, "").trim();

            let [hours, minutes] = timeWithoutPeriod.split(":");
            hours = parseInt(hours);
            minutes = minutes ? parseInt(minutes) : 0;

            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;

            return hours * 60 + minutes;
        };

        const rangeStartMinutes = convertToMinutes(rangeStart);
        const rangeEndMinutes = convertToMinutes(rangeEnd);

        let slotStartMinutes = convertToMinutes(`${slotStart} ${slotPeriod}`);
        let slotEndMinutes = convertToMinutes(`${slotEnd} ${slotPeriod}`);

        return (
            slotStartMinutes >= rangeStartMinutes &&
            slotEndMinutes <= rangeEndMinutes
        );
    };

    const hasAppointment = (appointmentSlot) => {
        if (!dataAppointmentSchedulesVisitationInformation?.data) {
            return false;
        }

        const appointmentDate = dayjs(appointmentSlot.date).format(
            "YYYY-MM-DD",
        );
        const departmentId = appointmentSlot.department_id;
        const slotTime = normalizeTime(appointmentSlot.available_time);

        return dataAppointmentSchedulesVisitationInformation.data.some(
            (appointment) => {
                const appointmentBookingDate = dayjs(
                    appointment.appointment_schedule?.date || appointment.date,
                ).format("YYYY-MM-DD");

                if (
                    appointment.appointment_schedule?.department_id !==
                        departmentId ||
                    appointmentBookingDate !== appointmentDate
                ) {
                    return false;
                }

                const appointmentTimeRange = normalizeTime(
                    appointment.appointment_schedule?.available_time ||
                        appointment.available_time,
                );

                return isTimeSlotInRange(slotTime, appointmentTimeRange);
            },
        );
    };

    const hasAppointmentByCurrentUser = (appointmentSlot) => {
        if (
            !dataAppointmentSchedulesVisitationInformation?.data ||
            !profileId
        ) {
            return false;
        }

        const appointmentDate = dayjs(appointmentSlot.date).format(
            "YYYY-MM-DD",
        );
        const departmentId = appointmentSlot.department_id;
        const slotTime = normalizeTime(appointmentSlot.available_time);

        return dataAppointmentSchedulesVisitationInformation.data.some(
            (appointment) => {
                const appointmentBookingDate = dayjs(
                    appointment.appointment_schedule?.date || appointment.date,
                ).format("YYYY-MM-DD");

                if (
                    appointment.profile_id !== profileId ||
                    appointment.appointment_schedule?.department_id !==
                        departmentId ||
                    appointmentBookingDate !== appointmentDate
                ) {
                    return false;
                }

                const appointmentTimeRange = normalizeTime(
                    appointment.appointment_schedule?.available_time ||
                        appointment.available_time,
                );

                return isTimeSlotInRange(slotTime, appointmentTimeRange);
            },
        );
    };

    const getAppointmentType = (departmentId, date) => {
        if (!dataAppointmentSchedulesVisitationInformation?.data) {
            return null;
        }

        const appointmentDate = dayjs(date).format("YYYY-MM-DD");

        const appointments =
            dataAppointmentSchedulesVisitationInformation.data.filter(
                (appointment) => {
                    const appointmentBookingDate = dayjs(
                        appointment.appointment_schedule?.date ||
                            appointment.date,
                    ).format("YYYY-MM-DD");

                    return (
                        appointment.appointment_schedule?.department_id ===
                            departmentId &&
                        appointmentBookingDate === appointmentDate
                    );
                },
            );

        if (appointments.length === 0) return null;

        const appointmentTimeRanges = appointments.map((appointment) =>
            normalizeTime(
                appointment.appointment_schedule?.available_time ||
                    appointment.available_time,
            ),
        );

        if (appointmentTimeRanges.includes("Whole Day")) {
            return { type: "Whole Day", appointments };
        }

        const timeRangeAppointments = appointmentTimeRanges.filter(
            (range) => range.includes(" - ") && range !== "Whole Day",
        );

        if (timeRangeAppointments.length > 0) {
            return {
                type: "Time Range",
                timeRanges: timeRangeAppointments,
                appointments,
            };
        }

        return { type: "Individual Slots", appointments };
    };

    const handleCellClick = (item) => {
        if (item.appointment_type === "Not Available") {
            notification.error({
                message: "Unavailable",
                description: "This appointment slot is not available.",
            });
            return;
        }

        const hasExistingAppointment = hasAppointment(item);

        if (hasExistingAppointment) {
            const hasCurrentUserAppointment = hasAppointmentByCurrentUser(item);
            const appointmentType = getAppointmentType(
                item.department_id,
                item.date,
            );

            if (appointmentType?.type === "Whole Day") {
                if (hasCurrentUserAppointment) {
                    notification.error({
                        message: "Already Have Appointment (Whole Day)",
                        description:
                            "You already have a Whole Day appointment for this department on this date.",
                    });
                } else {
                    notification.error({
                        message: "Slot Unavailable (Whole Day)",
                        description:
                            "There is a Whole Day appointment for this department on this date.",
                    });
                }
            } else if (appointmentType?.type === "Time Range") {
                if (hasCurrentUserAppointment) {
                    notification.error({
                        message: "Already Have Appointment",
                        description: `You already have an appointment that includes ${item.available_time}.`,
                    });
                } else {
                    notification.error({
                        message: "Slot Unavailable",
                        description: `This time slot is within an existing appointment range.`,
                    });
                }
            } else {
                if (hasCurrentUserAppointment) {
                    notification.error({
                        message: "Already Have Appointment",
                        description: `You already have an appointment for ${item.available_time}.`,
                    });
                } else {
                    notification.error({
                        message: "Slot Unavailable",
                        description: `The ${item.available_time} time slot already has an appointment.`,
                    });
                }
            }
            return;
        }

        const hasConflict = hasAppointmentByCurrentUser(item);

        // console.log("hasConflict:", hasConflict);

        if (hasConflict) {
            notification.error({
                message: "Appointment Conflict",
                description:
                    "You already have an appointment that includes this time slot.",
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
            const hasOverlappingSlot = selectedAppointments.some((selected) => {
                if (
                    selected.department_id !== item.department_id ||
                    selected.date !== item.date
                ) {
                    return false;
                }

                const selectedTime = normalizeTime(selected.available_time);
                const itemTime = normalizeTime(item.available_time);

                return selectedTime === itemTime;
            });

            if (hasOverlappingSlot) {
                notification.warning({
                    message: "Duplicate Selection",
                    description:
                        "You have already selected this exact time slot for this department and date.",
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

    const checkForConflicts = (appointments) => {
        if (
            !profileId ||
            !dataAppointmentSchedulesVisitationInformation?.data
        ) {
            return [];
        }

        const conflicts = [];

        appointments.forEach((appointment) => {
            const hasExistingAppointment = hasAppointment(appointment);
            // console.log("hasExistingAppointment:", hasExistingAppointment);

            if (hasExistingAppointment) {
                conflicts.push({
                    ...appointment,
                    reason: "already_has_appointment",
                });
                return;
            }

            const hasConflict = hasAppointmentByCurrentUser(appointment);

            if (hasConflict) {
                conflicts.push({
                    ...appointment,
                    reason: "user_appointment_conflict",
                });
            }
        });

        return conflicts;
    };

    const handlePreviewRequest = () => {
        if (selectedAppointments.length === 0) {
            notification.warning({
                message: "No appointments selected",
                description: "Please select at least one appointment slot.",
            });
            return;
        }

        const conflicts = checkForConflicts(selectedAppointments);

        if (conflicts.length > 0) {
            notification.error({
                message: "Appointment Conflict",
                description: `Some selected appointments are no longer available. Please remove them and try again.`,
            });

            const conflictIds = conflicts.map((c) => c.id);
            setSelectedAppointments((prev) =>
                prev.filter(
                    (appointment) => !conflictIds.includes(appointment.id),
                ),
            );

            return;
        }

        setToggleModalVisitorInformationForm({
            open: true,
            data: selectedAppointments[0],
            selectedAppointments: selectedAppointments,
        });
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

                    const hasExistingAppointment = hasAppointment(item);

                    const hasCurrentUserAppointment =
                        hasAppointmentByCurrentUser(item);
                    const appointmentType = getAppointmentType(
                        item.department_id,
                        item.date,
                    );

                    const isImportant =
                        item.important_visit === 1 && item.important_notes;

                    const isDisabled = hasExistingAppointment;

                    let appointmentLabel = "Appointment";
                    if (appointmentType?.type === "Whole Day") {
                        appointmentLabel = "Whole Day Appointment";
                    } else if (appointmentType?.type === "Time Range") {
                        appointmentLabel = "Has Appointment";
                    }

                    return (
                        <li
                            key={index}
                            style={{
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                marginBottom: 6,
                                padding: 6,
                                borderRadius: 6,
                                backgroundColor: isDisabled
                                    ? hasCurrentUserAppointment
                                        ? "#fff7e6"
                                        : "#ffe6e6"
                                    : isSelected
                                      ? "#e6f7ff"
                                      : "transparent",
                                border: isDisabled
                                    ? hasCurrentUserAppointment
                                        ? "1px dashed #faad14"
                                        : "1px dashed #ff4d4f"
                                    : isSelected
                                      ? "2px solid #1890ff"
                                      : "1px solid #f0f0f0",
                                opacity: isDisabled ? 0.7 : 1,
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => {
                                if (isDisabled) {
                                    if (hasCurrentUserAppointment) {
                                        notification.warning({
                                            message: "Your Appointment",
                                            description:
                                                appointmentType?.type ===
                                                "Whole Day"
                                                    ? "You have a Whole Day appointment for this department."
                                                    : appointmentType?.type ===
                                                        "Time Range"
                                                      ? "You have an appointment that includes this slot."
                                                      : `You have an appointment for ${item.available_time}.`,
                                        });
                                    } else {
                                        notification.warning({
                                            message: "Has Appointment",
                                            description:
                                                appointmentType?.type ===
                                                "Whole Day"
                                                    ? "There is a Whole Day appointment for this department."
                                                    : appointmentType?.type ===
                                                        "Time Range"
                                                      ? "This slot is within an appointment range."
                                                      : `The ${item.available_time} time slot has an appointment.`,
                                        });
                                    }
                                    return;
                                }
                                handleCellClick(item);
                            }}
                        >
                            <Typography.Text
                                className="text-sm font-semibold"
                                style={{
                                    color: isDisabled
                                        ? "#bfbfbf"
                                        : item.appointment_type ===
                                            "Not Available"
                                          ? "#ff4d4f"
                                          : item.appointment_type ===
                                              "Available"
                                            ? "#52c41a"
                                            : "#1890ff",
                                }}
                            >
                                {hasExistingAppointment
                                    ? appointmentLabel
                                    : item.appointment_type}
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

                            {hasExistingAppointment &&
                                hasCurrentUserAppointment && (
                                    <div className="mt-2">
                                        <Tag
                                            color="orange"
                                            className="text-xs"
                                            style={{
                                                fontSize: "x-small",
                                            }}
                                        >
                                            {appointmentType?.type ===
                                            "Whole Day"
                                                ? "Your Whole Day"
                                                : appointmentType?.type ===
                                                    "Time Range"
                                                  ? "Your Appointment "
                                                  : "Your Appointment"}
                                        </Tag>
                                    </div>
                                )}

                            {hasExistingAppointment &&
                                !hasCurrentUserAppointment && (
                                    <div className="mt-2">
                                        <Tag
                                            color="red"
                                            className="text-xm"
                                            style={{
                                                fontSize: "x-small",
                                            }}
                                        >
                                            {appointmentType?.type ===
                                            "Whole Day"
                                                ? "Whole Day Appointment"
                                                : appointmentType?.type ===
                                                    "Time Range"
                                                  ? "Has Appointment"
                                                  : "Has Appointment"}
                                        </Tag>
                                    </div>
                                )}

                            {isSelected && !hasExistingAppointment && (
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
                    <Card>
                        {/* <Typography.Text type="secondary">
                            Note:
                            <strong>
                                {" "}
                                • "Whole Day" appointments make ALL time slots
                                unavailable.
                                <br />
                                • Time range appointments (e.g., "8:00 AM -
                                12:00 PM") make all time slots within that range
                                unavailable.
                                <br />• Individual time slots have appointments
                                independently if not within a Whole Day or time
                                range appointment.
                            </strong>
                            Your own appointments are highlighted in orange.
                        </Typography.Text> */}
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form>
                        <Form.Item name="department_id">
                            <FloatSelect
                                label="Select Office to Visit"
                                placeholder="Select Office to Visit"
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
                                        department_id: values || [],
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
                                        title="Status"
                                        render={(record) => {
                                            const hasExistingAppointment =
                                                hasAppointment(record);
                                            const hasCurrentUserAppointment =
                                                hasAppointmentByCurrentUser(
                                                    record,
                                                );
                                            const appointmentType =
                                                getAppointmentType(
                                                    record.department_id,
                                                    record.date,
                                                );

                                            if (hasCurrentUserAppointment) {
                                                return (
                                                    <Tag color="orange">
                                                        {appointmentType?.type ===
                                                        "Whole Day"
                                                            ? "Your Whole Day"
                                                            : appointmentType?.type ===
                                                                "Time Range"
                                                              ? "Your Appointment Range"
                                                              : "Your Appointment"}
                                                    </Tag>
                                                );
                                            }

                                            return hasExistingAppointment ? (
                                                <Tag color="red">
                                                    {appointmentType?.type ===
                                                    "Whole Day"
                                                        ? "Whole Day Appointment"
                                                        : appointmentType?.type ===
                                                            "Time Range"
                                                          ? "Has Appointment"
                                                          : "Has Appointment"}
                                                </Tag>
                                            ) : (
                                                <Tag color="green">
                                                    Available
                                                </Tag>
                                            );
                                        }}
                                    />
                                    <Table.Column
                                        title="View"
                                        render={(_, record) => {
                                            const hasExistingAppointment =
                                                hasAppointment(record);
                                            const hasCurrentUserAppointment =
                                                hasAppointmentByCurrentUser(
                                                    record,
                                                );

                                            return (
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
                                                    disabled={
                                                        hasExistingAppointment
                                                    }
                                                >
                                                    {hasCurrentUserAppointment
                                                        ? "Your Appointment"
                                                        : hasExistingAppointment
                                                          ? "Has Appointment"
                                                          : "Remove"}
                                                </Button>
                                            );
                                        }}
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
                                        onClick={handlePreviewRequest}
                                        disabled={
                                            selectedAppointments.length === 0
                                        }
                                    >
                                        Next
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
                dataAppointmentSchedulesVisitationInformation={
                    dataAppointmentSchedulesVisitationInformation
                }
                currentUserProfileId={currentUserProfileId}
            />

            <ModalApplicationList
                toggleModalApplicationList={toggleModalApplicationList}
                setToggleModalApplicationList={setToggleModalApplicationList}
            />
        </>
    );
}
