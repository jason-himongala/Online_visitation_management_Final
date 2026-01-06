import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faBuilding,
    faClock,
} from "@fortawesome/pro-regular-svg-icons";
import {
    Button,
    Col,
    Form,
    Modal,
    notification,
    Row,
    List,
    Tag,
    Typography,
} from "antd";
import dayjs from "dayjs";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import { UserId } from "../../../../providers/appConfig";
import FloatInput from "../../../../providers/FloatInput";

export default function ModalVisitorInformationForm(props) {
    const userId = UserId();

    const {
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
        selectedAppointments,
        setSelectedAppointments,
    } = props;

    const [form] = Form.useForm();

    const { data: userData } = GET(`api/profiles/${userId}`, "profile_user");

    const { mutate: mutateVisitorInfo, loading: isLoadingSubmit } = POST(
        `api/visitation_information`,
        "visitation_information_submit"
    );

    const handleSubmit = (values) => {
        const appointmentsData = selectedAppointments.map((appointment) => {
            const appointmentScheduleId =
                appointment.appointment_schedule_id ||
                appointment.schedule_id ||
                appointment.appointmentScheduleId ||
                appointment.id;

            return {
                appointment_schedule_id: appointmentScheduleId,
                department_id: appointment.department_id,
                date: appointment.date,
                time: appointment.time || appointment.available_time,
                department_name:
                    appointment.department_name || appointment.department,
                important_notes: appointment.important_notes || null,
            };
        });

        let data = {
            ...values,
            profile_id: userId ?? null,
            appointments: appointmentsData,
            purpose_of_visit: values.purpose_of_visit || null,
            total_appointments: selectedAppointments.length,
        };

        mutateVisitorInfo(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Application Submitted",
                        description:
                            res.message ||
                            `Successfully submitted ${selectedAppointments.length} appointment(s)`,
                    });

                    setToggleModalVisitorInformationForm({
                        open: false,
                        data: null,
                        selectedAppointments: [],
                    });

                    setSelectedAppointments([]);

                    form.resetFields();
                } else {
                    notification.error({
                        message: "Something went wrong",
                        description: res.message,
                    });
                }
            },
            onError: (err) => {
                notification.error({
                    message: "Error",
                    description:
                        err.message ||
                        "Something went wrong while submitting the request",
                });
            },
        });
    };

    const handleRemoveAppointment = (appointmentId) => {
        const updatedAppointments = selectedAppointments.filter(
            (app) => app.id !== appointmentId
        );

        if (updatedAppointments.length === 0) {
            setToggleModalVisitorInformationForm({
                open: false,
                data: null,
                selectedAppointments: [],
            });
            setSelectedAppointments([]);
            notification.info({
                message: "All appointments removed",
                description:
                    "Modal closed because no appointments are selected.",
            });
            return;
        }

        setSelectedAppointments(updatedAppointments);

        if (toggleModalVisitorInformationForm.data?.id === appointmentId) {
            setToggleModalVisitorInformationForm((prev) => ({
                ...prev,
                data: updatedAppointments[0],
            }));
        }

        notification.info({
            message: "Appointment Removed",
            description:
                "The appointment has been removed from your selection.",
        });
    };

    useEffect(() => {
        if (userData && !form.getFieldValue("email")) {
            form.setFieldsValue({
                email: userData?.data?.user?.email || "",
            });
        }
    }, [userData, form]);

    const getModalTitle = () => {
        if (!toggleModalVisitorInformationForm.data) {
            return "Visitor Information";
        }

        const firstAppointment = toggleModalVisitorInformationForm.data;
        const totalSelected = selectedAppointments.length;

        return `Visitor Information - ${totalSelected} Appointment${
            totalSelected > 1 ? "s" : ""
        } Selected`;
    };

    return (
        <Modal
            title={getModalTitle()}
            closeIcon={<FontAwesomeIcon icon={faXmark} />}
            open={toggleModalVisitorInformationForm.open}
            onCancel={() => {
                setToggleModalVisitorInformationForm({
                    open: false,
                    data: null,
                    selectedAppointments: [],
                });
            }}
            width={800}
            footer={[
                <Button
                    shape="round"
                    key="cancel"
                    onClick={() => {
                        setToggleModalVisitorInformationForm({
                            open: false,
                            data: null,
                            selectedAppointments: [],
                        });
                    }}
                >
                    CANCEL
                </Button>,
                <Button
                    shape="round"
                    type="primary"
                    key="submit"
                    loading={isLoadingSubmit}
                    onClick={() => form.submit()}
                >
                    Submit {selectedAppointments.length} Appointment
                    {selectedAppointments.length !== 1 ? "s" : ""}
                </Button>,
            ]}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Typography.Title level={5} className="mb-4">
                            Selected Appointments ({selectedAppointments.length}
                            )
                        </Typography.Title>

                        <List
                            bordered
                            dataSource={selectedAppointments}
                            renderItem={(appointment) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="text"
                                            danger
                                            size="small"
                                            onClick={() =>
                                                handleRemoveAppointment(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon
                                                    icon={faBuilding}
                                                    className="text-blue-500"
                                                />
                                                <span>
                                                    {
                                                        appointment.department_name
                                                    }
                                                </span>
                                                <Tag
                                                    color={
                                                        appointment.appointment_type ===
                                                        "Available"
                                                            ? "green"
                                                            : "blue"
                                                    }
                                                >
                                                    {
                                                        appointment.appointment_type
                                                    }
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Typography.Text type="secondary">
                                                        Date:
                                                    </Typography.Text>
                                                    <Typography.Text strong>
                                                        {dayjs(
                                                            appointment.date
                                                        ).format(
                                                            "MMM DD, YYYY"
                                                        )}
                                                    </Typography.Text>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FontAwesomeIcon
                                                        icon={faClock}
                                                        className="text-gray-400"
                                                    />
                                                    <Typography.Text strong>
                                                        {
                                                            appointment.available_time
                                                        }
                                                    </Typography.Text>
                                                </div>
                                                {appointment.important_notes && (
                                                    <Tag color="warning">
                                                        Note:{" "}
                                                        {
                                                            appointment.important_notes
                                                        }
                                                    </Tag>
                                                )}
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>

                    <Col span={24}>
                        <Typography.Title level={5} className="mb-4">
                            Your Information
                        </Typography.Title>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="email"
                            label="Your Email Address"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email address",
                                },
                                {
                                    type: "email",
                                    message:
                                        "Please enter a valid email address",
                                },
                            ]}
                        >
                            <FloatInput
                                label="Your Email Address"
                                required
                                placeholder="Your Email Address"
                                disabled={!!userData?.data?.user?.email}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="purpose_of_visit"
                            label="Purpose of Visit"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter the purpose of visit",
                                },
                                {
                                    min: 10,
                                    message:
                                        "Purpose should be at least 10 characters",
                                },
                            ]}
                        >
                            <FloatInput
                                label="Purpose of Visit"
                                required
                                placeholder="Please describe the purpose of your visit in detail"
                                textArea
                                rows={3}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <Typography.Text strong className="text-yellow-800">
                                Important Information:
                            </Typography.Text>
                            <ul className="mt-2 text-yellow-700">
                                <li>
                                    You have selected{" "}
                                    {selectedAppointments.length} appointment
                                    {selectedAppointments.length !== 1
                                        ? "s"
                                        : ""}
                                    .
                                </li>
                                <li>
                                    All appointments will be submitted as a
                                    single request.
                                </li>
                                <li>
                                    You will receive confirmation emails for
                                    each appointment.
                                </li>
                                <li>
                                    Please arrive 15 minutes before your
                                    scheduled time.
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
