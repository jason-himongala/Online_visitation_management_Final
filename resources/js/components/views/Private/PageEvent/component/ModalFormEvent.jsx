import { useContext, useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Form,
    Modal,
    notification,
    Row,
    Typography,
    Upload,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";

import { POST } from "../../../../providers/useAxiosQuery";
import { PageEventContextCalendar } from "./PageEventContentCalendar";
import FloatSelect from "../../../../providers/FloatSelect";
import FloatInput from "../../../../providers/FloatInput";
import validateRules from "../../../../providers/validateRules";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import notificationErrors from "../../../../providers/notificationErrors";
import imageFileToBase64 from "../../../../providers/imageFileToBase64";

export default function ModalFormEvent() {
    const { toggleModalFormEvent, setToggleModalFormEvent, dataSchoolYear } =
        useContext(PageEventContextCalendar);

    const [form] = Form.useForm();
    const [imageUrlLogo, setImageUrlLogo] = useState(null);
    const [imageUrlBG, setImageUrlBG] = useState(null);

    const { mutate: mutateEvent, isLoading: isLoadingEvent } = POST(
        `api/events`,
        "event_types"
    );

    const onFinish = (values) => {
        let data = new FormData();

        Object.keys(values).forEach((key) => {
            let value = values[key];

            let bolFields = ["is_unlimited_login"];

            if (key === "datetime_start" || key === "datetime_end") {
                value = values[key]
                    ? dayjs(values[key]).format("YYYY-MM-DD")
                    : "";
            } else if (bolFields.includes(key)) {
                value = values[key] ? 1 : 0;
            }

            data.append(key, value);
        });

        if (imageUrlLogo.file) {
            data.append("logo_file", imageUrlLogo.file);
        }
        // console.log("Image Logo:", imageUrlLogo);

        if (imageUrlBG.file) {
            data.append("bg_file", imageUrlBG.file);
        }

        mutateEvent(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Event",
                        description: res.message,
                    });

                    setToggleModalFormEvent({ open: false, data: null });
                    setImageUrlLogo(null);
                    setImageUrlBG(null);
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

    return (
        <Modal
            title="Event Form"
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
            <Form form={form} onFinish={onFinish}>
                <Row gutter={[20, 0]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="title"
                            rules={[validateRules.required()]}
                        >
                            <FloatInput label="Title" required />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item name="description">
                            <FloatInput label="Description" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="type"
                            rules={[validateRules.required()]}
                        >
                            <FloatSelect
                                label="Available Type"
                                required
                                options={[
                                    {
                                        label: "Attendance",
                                        value: "Attendance",
                                    },
                                    {
                                        label: "Invitation",
                                        value: "Invitation",
                                    },
                                    {
                                        label: "Registration",
                                        value: "Registration",
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
                        <Form.Item name="department_id">
                            <FloatSelect
                                label="Department"
                                placeholder="Department"
                                options={[
                                    {
                                        label: "College of Humanities and Social Sciences",
                                        value: "College of Humanities and Social Sciences",
                                    },
                                    {
                                        label: "College of Agriculture and Agri-Industries",
                                        value: "College of Agriculture and Agri-Industries",
                                    },
                                    {
                                        label: "College of Forestry and Environmental Sciences",
                                        value: "College of Forestry and Environmental Sciences",
                                    },
                                    {
                                        label: "College of Mathematics and Natural Sciences",
                                        value: "College of Mathematics and Natural Sciences",
                                    },
                                    {
                                        label: "College of Computing and Information Sciences",
                                        value: "College of Computing and Information Sciences",
                                    },
                                    {
                                        label: "College of Engineering and Geo-Sciences",
                                        value: "College of Engineering and Geo-Sciences",
                                    },
                                    {
                                        label: "College of Education",
                                        value: "College of Education",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item name="datetime_start">
                            <FloatDatePicker
                                label="Start Date"
                                onChange={() => {
                                    form.resetFields(["datetime_end"]);
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                let datetime_start = getFieldValue(
                                    "datetime_start"
                                )
                                    ? getFieldValue("datetime_start")
                                    : null;

                                return (
                                    <Form.Item name="datetime_end">
                                        <FloatDatePicker
                                            label="End Date"
                                            disabledDate={(current) => {
                                                if (datetime_start) {
                                                    return (
                                                        current &&
                                                        current <
                                                            dayjs(
                                                                datetime_start
                                                            )
                                                    );
                                                } else {
                                                    return current;
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="is_unlimited_login"
                            valuePropName="checked"
                        >
                            <Checkbox>Is Unlimited Login?</Checkbox>
                        </Form.Item>
                    </Col>
                    <Form.Item shouldUpdate noStyle>
                        {({ getFieldValue }) => {
                            let is_unlimited_login = getFieldValue(
                                "is_unlimited_login"
                            )
                                ? getFieldValue("is_unlimited_login")
                                : false;

                            if (is_unlimited_login) {
                                return (
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={24}
                                        xxl={24}
                                    >
                                        <Typography.Text type="secondary">
                                            Note: "Reset Login" means that the
                                            user's "Sign In" and "Sign Out"
                                            status will be reset regardless of
                                            the selected value. This means the
                                            system will revert to "Sign In" even
                                            if the user hasn't signed out yet.
                                        </Typography.Text>
                                        <Form.Item name="reset_login">
                                            <FloatSelect
                                                label="Reset Login"
                                                required
                                                options={[
                                                    {
                                                        label: "No Reset",
                                                        value: "No Reset",
                                                    },
                                                    {
                                                        label: "Every Day (Morning)",
                                                        value: "Every Day (Morning)",
                                                    },
                                                    {
                                                        label: "Every Day (Afternoon)",
                                                        value: "Every Day (Afternoon)",
                                                    },
                                                    {
                                                        label: "Every Day (Evening)",
                                                        value: "Every Day (Evening)",
                                                    },
                                                    {
                                                        label: "Every Odd Days",
                                                        value: "Every Odd Days",
                                                    },
                                                    {
                                                        label: "Every Even Days",
                                                        value: "Every Even Days",
                                                    },
                                                    {
                                                        label: "Every Week",
                                                        value: "Every Week",
                                                    },
                                                    {
                                                        label: "Every 15 Days",
                                                        value: "Every 15 Days",
                                                    },
                                                    {
                                                        label: "Every Month",
                                                        value: "Every Month",
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>
                </Row>
            </Form>
        </Modal>
    );
}
