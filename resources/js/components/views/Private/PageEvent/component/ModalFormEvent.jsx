import { use, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal, notification, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import FloatSelect from "../../../../providers/FloatSelect";
import validateRules from "../../../../providers/validateRules";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import notificationErrors from "../../../../providers/notificationErrors";
import PageEventContextCalendar from "./PageEventContextCalendar";

export default function ModalFormEvent({ currentUser }) {
    console.log("currentUser in modal", currentUser);
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

    console.log("departments", departments);

    const { mutate: mutateAppointmentSc, isLoading: isLoadingEvent } = POST(
        `api/appointment_schedule`,
        "appointment_schedule_list"
    );

    const onFinish = (values) => {
        let data = new FormData();

        Object.keys(values).forEach((key) => {
            let value = values[key];

            if (key === "date") {
                value = values[key]
                    ? dayjs(values[key]).format("YYYY-MM-DD")
                    : "";
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
        let date = dayjs().format("YYYY-MM-DD");

        if (toggleModalFormEvent.data) {
            const { department_id, appointment_type, available_time, date } =
                toggleModalFormEvent.data;

            form.setFieldsValue({
                department_id: department_id || null,
                appointment_type: appointment_type || null,
                available_time: available_time || null,
                date: date ? dayjs(date) : dayjs(date),
            });
        } else {
            form.setFieldsValue({ date: dayjs(date) });
            form.resetFields();
        }
    }, [toggleModalFormEvent.data]);

    return (
        <Modal
            title="Appointment Schedule Form"
            closeIcon={<FontAwesomeIcon icon={faXmark} />}
            open={toggleModalFormEvent.open}
            onCancel={() => {
                setToggleModalFormEvent({
                    open: false,
                    data: null,
                });
            }}
            forceRender
            footer={[
                <Button
                    shape="round"
                    onClick={() => {
                        setToggleModalFormEvent({
                            open: false,
                            data: null,
                        });
                    }}
                    key={1}
                >
                    CANCEL
                </Button>,
                <Button
                    shape="round"
                    type="primary"
                    className="ant-btn-primary"
                    onClick={() => form.submit()}
                    key={2}
                    loading={isLoadingEvent}
                >
                    SUBMIT
                </Button>,
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
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
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
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="appointment_type"
                            rules={[validateRules.required()]}
                        >
                            <FloatSelect
                                label="Available Type"
                                required
                                options={[
                                    {
                                        label: "Available",
                                        value: "Available",
                                    },
                                    {
                                        label: "Not Available",
                                        value: "Not Available",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="available_time"
                            rules={[validateRules.required()]}
                        >
                            <FloatSelect
                                label="Available Time"
                                required
                                options={[
                                    {
                                        label: "AM (Around 6:00 - 11:59am)",
                                        value: "AM (Around 6:00 - 11:59am)",
                                    },
                                    {
                                        label: "PM (Around 6:00 - 11:59pm)",
                                        value: "PM (Around 6:00 - 11:59pm)",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item name="date">
                            <FloatDatePicker label="Start Date" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
