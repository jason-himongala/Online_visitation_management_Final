import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/pro-regular-svg-icons";
import { Card, Col, Row, Typography, Form, Button, notification } from "antd";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import { UserId } from "../../../../providers/appConfig";
import dayjs from "dayjs";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import FloatTimePicker from "../../../../providers/FloatTimePicker";
import notificationErrors from "../../../../providers/notificationErrors";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";

export default function PageVisitationContent(props) {
    const { status, id } = props;
    // console.log("statusssss", status);

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { data: departments } = GET(
        `api/departments`,
        "department_list",
        () => {},
        false,
    );
    const { mutate: mutateVisitorForm, loading: isLoadingChat } = POST(
        `api/visitation_forms`,
        [
            "visitation_forms_submit",
            "user_notifications",
            "user_notifications_list",
        ],
    );

    const onFinish = (values) => {
        console.log("values", values);

        let data = new FormData();
        let userId = UserId();

        data.append("remarks", "Submitted");

        Object.keys(values).forEach((key) => {
            let value = values[key];

            data.append("user_id", userId);
            data.append("remarks", "Submitted");
            data.append("visitation_information_id", id);
            if (
                key === "preferred_date_of_visit" ||
                key === "alternate_date_of_visit"
            ) {
                value = value ? dayjs(value).format("YYYY-MM-DD") : "";
            } else if (
                key === "preferred_time_of_visit" ||
                key === "alternate_time_of_visit"
            ) {
                value = value ? dayjs(value).format("HH:mm:ss") : "";
            } else if (key === "profile_delegates") {
                value = value ? JSON.stringify(value) : "";
            }

            data.append(key, value);
        });

        mutateVisitorForm(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Visitation Form",
                        description: res.message,
                    });

                    navigate(-1);
                } else {
                    notification.error({
                        message: "Visitation Form",
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
        <Col xs={24} md={16} lg={12} xl={10} xxl={8} align="center">
            <Card
                className="rounded-ss-none rounded-es-none rounded-se-lg rounded-ee-lg shadow-lg border-green-800"
                title={
                    <div className="text-center text-lg font-bold!">
                        CLIENT SATISFACTION MEASUREMENT
                    </div>
                }
                headStyle={{
                    backgroundColor: "#0d5b10",
                    borderColor: "#0d5b10",
                    color: "#fff",
                }}
                justify="center"
            >
                <Row gutter={[0, 0]}>
                    <Col xs={24} className="mt-2">
                        <Typography.Title
                            level={4}
                            className="!text-blue-600 !mb-2 text-left"
                        >
                            IMPORTANT NOTE!
                        </Typography.Title>

                        <Typography.Paragraph className="text-center leading-relaxed">
                            This Visitation Form must be accomplished before the
                            actual date of the visit.
                            <br />
                            Schedule without prior notice.
                            <br />
                            The Caraga State University will not accommodate
                            visitors before or after the approved
                            <br />
                            Schedule without prior notice.
                        </Typography.Paragraph>
                    </Col>
                </Row>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={[12, 0]}>
                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="!mb-2 !font-bold"
                            >
                                I. GENERAL INFORMATION
                            </Typography.Title>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Preferred Date of Visit"
                                name="preferred_date_of_visit"
                            >
                                <FloatDatePicker format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Preferred Time of Visit"
                                name="preferred_time_of_visit"
                            >
                                <FloatTimePicker format="h:mm a" use12Hours />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Alternate Date of Visit"
                                name="alternate_date_of_visit"
                            >
                                <FloatDatePicker format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Alternate Time of Visit"
                                name="alternate_time_of_visit"
                            >
                                <FloatTimePicker format="h:mm a" use12Hours />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Purpose of Visit"
                                name="purpose_of_visit"
                            >
                                <FloatInput placeholder="Purpose of Visit" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={24} sm={24} md={24} xl={24}>
                            <Form.Item
                                label="Selected Faculty Centered Office/Organization to Visit"
                                name="selected_faculty_centered_office_organization_to_visit"
                                style={{ textAlign: "left" }}
                            >
                                <FloatSelect
                                    layout="vertical"
                                    placeholder="Selected Faculty Centered Office Organization to Visit"
                                    allowClear
                                    options={
                                        departments?.data?.map((dept) => ({
                                            label: dept.department_name,
                                            value: dept.id,
                                        })) || []
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={24} sm={24} md={24} xl={24}>
                            <Form.Item
                                label="Manner of Engagement (in-person or virtual)"
                                name="manner_of_engagement"
                            >
                                <FloatInput placeholder="Manner of Engagement (in-person or virtual)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* II. VISITOR INFORMATION */}
                    <Row gutter={[0, 0]}>
                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="!mb-2 !font-bold"
                            >
                                II. VISITOR INFORMATION
                            </Typography.Title>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Name of Institution/Agency"
                                name="name_of_institution_agency"
                            >
                                <FloatInput placeholder="Name of Institution Agency" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={24} sm={24} md={24} xl={24}>
                            <Form.List name="profile_delegates">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(
                                            ({ key, name, ...restField }) => (
                                                <Row
                                                    gutter={[12, 12]}
                                                    key={key}
                                                    style={{
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={24}
                                                        xl={24}
                                                        className="text-right"
                                                    >
                                                        <Button
                                                            type="link"
                                                            danger
                                                            icon={
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTrashAlt
                                                                    }
                                                                />
                                                            }
                                                            onClick={() =>
                                                                remove(name)
                                                            }
                                                        />
                                                    </Col>

                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="First Name"
                                                            name={[
                                                                name,
                                                                "firstname",
                                                            ]}
                                                        >
                                                            <FloatInput placeholder="First Name" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="Last Name"
                                                            name={[
                                                                name,
                                                                "lastname",
                                                            ]}
                                                        >
                                                            <FloatInput placeholder="Last Name" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="Middle Name"
                                                            name={[
                                                                name,
                                                                "middlename",
                                                            ]}
                                                        >
                                                            <FloatInput placeholder="Middle Name" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="Position"
                                                            name={[
                                                                name,
                                                                "position",
                                                            ]}
                                                        >
                                                            <FloatInput placeholder="Position" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            ),
                                        )}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                    />
                                                }
                                            >
                                                Add Delegates
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Topics for Discussion"
                                name="topics_for_discussion"
                            >
                                <FloatInput placeholder="Topics for Discussion" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Other Information/Concerns"
                                name="other_information_concern"
                            >
                                <FloatInput placeholder="Other Information Concern" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="center">
                        <Col>
                            <Form.Item>
                                {status?.toLowerCase() !== "approved" && (
                                    <Typography.Text
                                        type="danger"
                                        style={{
                                            display: "block",
                                            marginBottom: 8,
                                            color: "#ff4d4f",
                                        }}
                                    >
                                        You can only submit when status is
                                        approved.{" "}
                                        <Button
                                            type="link"
                                            style={{ padding: 0 }}
                                            onClick={() =>
                                                navigate("/my-status")
                                            }
                                        >
                                            My Status
                                        </Button>
                                    </Typography.Text>
                                )}
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    shape="round"
                                    className="bg-green-700 border-green-800 hover:bg-green-800 hover:border-green-900 text-center font-bold"
                                    disabled={
                                        status?.toLowerCase() !== "approved"
                                    }
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Col>
    );
}
