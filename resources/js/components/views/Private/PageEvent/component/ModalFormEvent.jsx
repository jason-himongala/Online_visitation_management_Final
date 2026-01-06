import { useContext, useEffect } from "react";
import { Button, Checkbox, Col, Form, Modal, notification, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import FloatSelect from "../../../../providers/FloatSelect";
import validateRules from "../../../../providers/validateRules";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import notificationErrors from "../../../../providers/notificationErrors";
import PageEventContextCalendar from "./PageEventContextCalendar";
import FloatTextArea from "../../../../providers/FloatTextArea";
import { role } from "../../../../providers/appConfig";

export default function ModalFormEvent({ currentUser }) {
    const UserRolle = role();
    const { toggleModalFormEvent, setToggleModalFormEvent } = useContext(
        PageEventContextCalendar
    );

    const [form] = Form.useForm();

    const { data: departments } = GET(
        `api/departments`,
        "departments_list",
        () => {},
        false
    );

    const { mutate: mutateAppointmentSc, isLoading: isLoadingEvent } = POST(
        `api/appointment_schedule`,
        "appointment_schedule_list"
    );

    const onFinish = (values) => {
        const data = new FormData();

        Object.keys(values).forEach((key) => {
            let value = values[key];
            if (key === "date") {
                value = value ? dayjs(value).format("YYYY-MM-DD") : "";
            }
            if (key === "important_visit") {
                value = value ? 1 : 0;
            }
            data.append(key, value);
        });

        mutateAppointmentSc(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Appointment Schedule",
                        description: res.message,
                    });
                    setToggleModalFormEvent({ open: false, data: null });
                    form.resetFields();
                } else {
                    notification.error({
                        message: "Something went wrong",
                        description: res.message,
                    });
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
        });
    };

    useEffect(() => {
        if (toggleModalFormEvent.open) {
            const currentDate = dayjs();

            if (toggleModalFormEvent.data) {
                const {
                    department_id,
                    appointment_type,
                    available_time,
                    date,
                    important_notes,
                    important_visit,
                } = toggleModalFormEvent.data;

                form.setFieldsValue({
                    department_id:
                        department_id || currentUser?.department_id || null,
                    appointment_type: appointment_type || null,
                    available_time: available_time || null,
                    date: date ? dayjs(date) : currentDate,
                    important_notes: important_notes || null,
                    important_visit: important_visit === 1,
                });
            } else {
                form.setFieldsValue({
                    department_id: currentUser?.department_id || null,
                    date: currentDate,
                    appointment_type: null,
                    available_time: null,
                    important_notes: null,
                    important_visit: false,
                });
            }
        } else {
            form.resetFields();
        }
    }, [toggleModalFormEvent.open, toggleModalFormEvent.data]);

    return (
        <Modal
            title="Appointment Schedule Form"
            closeIcon={<FontAwesomeIcon icon={faXmark} />}
            open={toggleModalFormEvent.open}
            onCancel={() => {
                form.resetFields();
                setToggleModalFormEvent({ open: false, data: null });
            }}
            forceRender
            footer={[
                <>
                    <Button
                        shape="round"
                        onClick={() => {
                            form.resetFields();
                            setToggleModalFormEvent({
                                open: false,
                                data: null,
                            });
                        }}
                        key={1}
                    >
                        CANCEL
                    </Button>
                    ,
                    {UserRolle !== "Pico" ? (
                        <Button
                            shape="round"
                            type="primary"
                            className="ant-btn-primary"
                            onClick={() => form.submit()}
                            key={2}
                            loading={isLoadingEvent}
                            disabled={isLoadingEvent}
                        >
                            SUBMIT
                        </Button>
                    ) : null}
                </>,
            ]}
        >
            <Form
                form={form}
                onFinish={onFinish}
                initialValues={{
                    department_id: currentUser?.department_id || null,
                }}
            >
                <Row gutter={[20, 0]}>
                    <Col xs={24}>
                        <Form.Item
                            name="department_id"
                            rules={[validateRules.required()]}
                        >
                            <FloatSelect
                                label="Department"
                                placeholder="Department"
                                required
                                disabled={Boolean(currentUser?.department_id)}
                                options={
                                    departments?.data
                                        ? departments.data.map((item) => ({
                                              label: item.department_name,
                                              value: item.id,
                                          }))
                                        : []
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="appointment_type"
                            rules={[validateRules.required()]}
                        >
                            <FloatSelect
                                label="Available Type"
                                required
                                options={[
                                    { label: "Available", value: "Available" },
                                    {
                                        label: "Not Available",
                                        value: "Not Available",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="available_time"
                            rules={[validateRules.required()]}
                        >
                            <FloatSelect
                                label="Available Time"
                                placeholder="Available Time"
                                required
                                options={[
                                    {
                                        label: "AM (Around 6:00 - 11:59am)",
                                        value: "AM (Around 6:00 - 11:59am)",
                                    },
                                    {
                                        label: "PM (Around 12:00 - 11:59pm)",
                                        value: "PM (Around 12:00 - 11:59pm)",
                                    },
                                    {
                                        label: "8:00am-12pm/1:00pm-5:00pm",
                                        value: "8:00am-12pm/1:00pm-5:00pm",
                                    },
                                    {
                                        label: "Whole Day",
                                        value: "Whole Day",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="date"
                            rules={[validateRules.required()]}
                        >
                            <FloatDatePicker label="Start Date" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="important_visit"
                            valuePropName="checked"
                        >
                            <Checkbox>Official visit</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item shouldUpdate>
                            {({ getFieldValue }) =>
                                getFieldValue("important_visit") ? (
                                    <Form.Item name="important_notes">
                                        <FloatTextArea label="Notes" />
                                    </Form.Item>
                                ) : null
                            }
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
