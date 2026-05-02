import React, { useState, useEffect, useMemo } from "react";
import {
    Modal,
    Form,
    Row,
    Col,
    Button,
    Upload,
    notification,
    Spin,
    Typography,
    Card,
    Divider,
    Input,
    Tag,
    Space,
    Progress,
    List,
} from "antd";
import {
    InboxOutlined,
    PaperClipOutlined,
    FileOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBuilding,
    faClock,
    faPaperPlane,
    faTimes,
    faXmark,
} from "@fortawesome/pro-regular-svg-icons";

import FloatInput from "../../../../providers/FloatInput";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import { UserId } from "../../../../providers/appConfig";
import dayjs from "dayjs";
import FloatSelect from "../../../../providers/FloatSelect";

const { Dragger } = Upload;
const { Text } = Typography;
const { TextArea } = Input;

export default function ModalVisitorInformationForm(props) {
    const userId = UserId();

    const {
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
        selectedAppointments,
        setSelectedAppointments,
    } = props;

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);

    const { data: userData } = GET(`api/profiles/${userId}`, [
        "profile_user",
        toggleModalVisitorInformationForm.open,
    ]);

    const { mutate: mutateVisitorInfo, loading: isLoadingSubmit } = POST(
        `api/visitation_information`,
        "visitation_information_submit",
    );

    useEffect(() => {
        if (toggleModalVisitorInformationForm.open) {
            setFileList([]);
            form.resetFields();
        }
    }, [toggleModalVisitorInformationForm.open, form]);

    const handleRemoveAppointment = (appointmentId) => {
        const updatedAppointments = selectedAppointments.filter(
            (app) => app.id !== appointmentId,
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
        if (toggleModalVisitorInformationForm.open) {
            form.resetFields(["email"]);
            const email = userData?.data?.user?.email || "";
            if (email) {
                form.setFieldsValue({ email });
            }
        }
    }, [toggleModalVisitorInformationForm.open, userData, form]);

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

    const beforeUpload = (file) => {
        console.log("Before upload check:", file);

        const isPDF = file.type === "application/pdf";
        const isWord =
            file.type === "application/msword" ||
            file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        const hasValidExtension =
            file.name.toLowerCase().endsWith(".pdf") ||
            file.name.toLowerCase().endsWith(".doc") ||
            file.name.toLowerCase().endsWith(".docx");

        if (!(isPDF || isWord || hasValidExtension)) {
            notification.error({
                message: "Invalid file type",
                description:
                    "Only PDF (.pdf) and Word (.doc, .docx) files are allowed.",
            });
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            notification.error({
                message: "File too large",
                description: "File must be smaller than 5MB.",
            });
            return Upload.LIST_IGNORE;
        }

        return false;
    };

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

        if (fileList.length === 0) {
            notification.error({
                message: "File Required",
                description: "Please upload a PDF or Word document",
            });
            return;
        }

        const fileEntry = fileList[0];
        const file = fileEntry.originFileObj || fileEntry;

        if (!file || !(file instanceof File)) {
            notification.error({
                message: "Invalid File",
                description: "Please select a valid file",
            });
            return;
        }

        const formData = new FormData();

        appointmentsData.forEach((appt, idx) => {
            formData.append(
                `appointments[${idx}][appointment_schedule_id]`,
                appt.appointment_schedule_id,
            );
            formData.append(
                `appointments[${idx}][department_id]`,
                appt.department_id,
            );
            formData.append(`appointments[${idx}][date]`, appt.date);
            formData.append(`appointments[${idx}][time]`, appt.time);
            formData.append(
                `appointments[${idx}][department_name]`,
                appt.department_name,
            );
            formData.append(
                `appointments[${idx}][important_notes]`,
                appt.important_notes ?? "",
            );
        });

        formData.append("profile_id", userId);
        formData.append("purpose_of_visit_id", values.purpose_of_visit_id);

        formData.append(
            "purpose_of_visit",
            values.purpose_of_visit || "Visitor Request",
        );

        formData.append("email", values.email);

        formData.append("status", "pending");

        formData.append("file_upload", file, file.name);

        selectedAppointments.forEach((appointment, index) => {
            // Use the correct field names expected by your controller
            formData.append(`profile_id_array[]`, userId);

            // For visitation_information_id, you might need to generate or get this
            // If you don't have it, you might need to create visitation_information first
            // Let's assume we use appointment_schedule_id for now
            formData.append(
                `visitaion_information_id_array[]`,
                appointment.id || appointment.appointment_schedule_id,
            );

            // Add department_id if available
            if (appointment.department_id) {
                formData.append(`department_id[]`, appointment.department_id);
            }
        });

        console.log("=== FormData Contents ===");
        for (let pair of formData.entries()) {
            const key = pair[0];
            const value =
                key === "file_upload"
                    ? `File: ${pair[1].name} (${pair[1].size} bytes)`
                    : pair[1];
            console.log(key + ":", value);
        }

        setIsUploading(true);
        setUploadPercent(0);

        mutateVisitorInfo(formData, {
            onSuccess: (response) => {
                setIsUploading(false);
                setUploadPercent(100);

                console.log("Server response:", response);

                if (response.success) {
                    notification.success({
                        message: "Success!",
                        description:
                            response.message ||
                            "Visitor request submitted successfully",
                        duration: 5,
                    });

                    form.resetFields();
                    setFileList([]);
                    setSelectedAppointments([]);

                    setTimeout(() => {
                        setToggleModalVisitorInformationForm({
                            open: false,
                            data: null,
                            selectedAppointments: [],
                        });
                    }, 1500);
                } else {
                    notification.error({
                        message: "Submission Failed",
                        description:
                            response.message || "Failed to submit request",
                        duration: 5,
                    });

                    if (response.errors) {
                        Object.entries(response.errors).forEach(
                            ([field, messages]) => {
                                messages.forEach((message) => {
                                    notification.error({
                                        message: `Validation Error: ${field}`,
                                        description: message,
                                    });
                                });
                            },
                        );
                    }
                }
            },
            onError: (error) => {
                setIsUploading(false);
                console.error("Submission error:", error);

                let errorMessage =
                    "Failed to submit request. Please try again.";

                if (error.response) {
                    const serverError = error.response.data;
                    console.error("Server error response:", serverError);
                    errorMessage = serverError.message || errorMessage;
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    errorMessage =
                        "No response from server. Please check your connection.";
                } else {
                    console.error("Error setting up request:", error.message);
                    errorMessage = error.message || errorMessage;
                }

                notification.error({
                    message: "Submission Error",
                    description: errorMessage,
                });
            },
        });
    };

    const handleFileChange = (info) => {
        console.log("File change info:", info);
        setFileList(info.fileList || []);
    };

    const handleRemoveFile = () => {
        setFileList([]);
    };

    const { data: dataPurpose } = GET(
        `api/purpose_of_visits`,
        "purpose_of_visits_list",
    );
    const { data: dataSchoolPurpose } = GET(
        `api/school_purposes`,
        "school_purposes_lisrt",
    );
    const [selectedSchoolPurposeId, setSelectedSchoolPurposeId] =
        useState(null);

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
                    loading={isLoadingSubmit || isUploading}
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
                                                    appointment.id,
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
                                                            appointment.date,
                                                        ).format(
                                                            "MMM DD, YYYY",
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
                        <Form.Item name="school_purpose_id">
                            <FloatSelect
                                label="School Purpose"
                                placeholder="School Purpose"
                                options={
                                    dataSchoolPurpose?.data?.map((purpose) => ({
                                        value: purpose.id,
                                        label: purpose.school_purpose,
                                    })) || []
                                }
                                onChange={(value) => {
                                    setSelectedSchoolPurposeId(value);
                                    form.setFieldsValue({
                                        purpose_of_visit_id: undefined,
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item name="purpose_of_visit_id">
                            <FloatSelect
                                label="Purpose of Visit"
                                placeholder="Purpose of Visit"
                                required
                                options={
                                    dataPurpose?.data
                                        ?.filter(
                                            (purpose) =>
                                                purpose.school_purpose_id ===
                                                selectedSchoolPurposeId,
                                        )
                                        .map((purpose) => ({
                                            value: purpose.id,
                                            label: purpose.purpose_of_visit,
                                        })) || []
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <div style={{ marginBottom: 24 }}>
                            <Text
                                strong
                                style={{ display: "block", marginBottom: 8 }}
                            >
                                Attachment (Required) *
                            </Text>
                            <Text
                                type="secondary"
                                style={{
                                    display: "block",
                                    marginBottom: 16,
                                    fontSize: "12px",
                                }}
                            >
                                Upload a PDF or Word document. Maximum file
                                size: 5MB.
                            </Text>

                            {isUploading ? (
                                <Card
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    <Spin size="large" />
                                    <div style={{ marginTop: 16 }}>
                                        <Progress
                                            percent={uploadPercent}
                                            status="active"
                                            strokeColor={{
                                                "0%": "#108ee9",
                                                "100%": "#87d068",
                                            }}
                                        />
                                    </div>
                                    <Text
                                        type="secondary"
                                        style={{
                                            display: "block",
                                            marginTop: 8,
                                        }}
                                    >
                                        Uploading your file... Please wait.
                                    </Text>
                                </Card>
                            ) : fileList.length > 0 ? (
                                <Card
                                    style={{
                                        backgroundColor: "#e6f7ff",
                                        border: "1px solid #91d5ff",
                                        position: "relative",
                                    }}
                                >
                                    <Space style={{ width: "100%" }}>
                                        <FileOutlined
                                            style={{
                                                fontSize: "24px",
                                                color: "#1890ff",
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <Text
                                                strong
                                                style={{ display: "block" }}
                                            >
                                                {fileList[0].name}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: "12px" }}
                                            >
                                                {(
                                                    fileList[0].size / 1024
                                                ).toFixed(2)}{" "}
                                                KB •{" "}
                                                {fileList[0].type ===
                                                "application/pdf"
                                                    ? "PDF Document"
                                                    : fileList[0].type.includes(
                                                            "word",
                                                        )
                                                      ? "Word Document"
                                                      : "Document"}
                                            </Text>
                                        </div>
                                        <Button
                                            type="text"
                                            danger
                                            size="small"
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
                                            }
                                            onClick={handleRemoveFile}
                                            disabled={isUploading}
                                        />
                                    </Space>
                                </Card>
                            ) : (
                                <Dragger
                                    name="file_upload"
                                    multiple={false}
                                    maxCount={1}
                                    fileList={fileList}
                                    accept=".pdf,.doc,.docx"
                                    beforeUpload={beforeUpload}
                                    onChange={handleFileChange}
                                    showUploadList={false}
                                    disabled={isUploading}
                                >
                                    <div style={{ padding: "40px 20px" }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined
                                                style={{
                                                    fontSize: "48px",
                                                    color: "#1890ff",
                                                }}
                                            />
                                        </p>
                                        <p
                                            className="ant-upload-text"
                                            style={{
                                                fontSize: "16px",
                                                marginBottom: 8,
                                            }}
                                        >
                                            Click or drag file to upload
                                        </p>
                                        <p
                                            className="ant-upload-hint"
                                            style={{
                                                fontSize: "12px",
                                                color: "#666",
                                            }}
                                        >
                                            Supports PDF, DOC, DOCX files.
                                            Maximum 5MB.
                                        </p>
                                    </div>
                                </Dragger>
                            )}
                        </div>
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
