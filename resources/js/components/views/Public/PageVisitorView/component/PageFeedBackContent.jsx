import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Card,
    Col,
    Row,
    Typography,
    Form,
    Button,
    Checkbox,
    Table,
    notification,
} from "antd";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import dayjs from "dayjs";
import { UserId } from "../../../../providers/appConfig";
import { useTableScrollOnTop } from "../../../../providers/CustomTableFilter";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import FloatInput from "../../../../providers/FloatInput";
import notificationErrors from "../../../../providers/notificationErrors";
import ModalPreviewPdf from "../../../../providers/ModalPreviewPdf";
import regionsSelection from "../../../../providers/regionsSelect";
import FloatSelect from "../../../../providers/FloatSelect";

export default function PageFeedbackContent(props) {
    const { status, id } = props;
    const [form] = Form.useForm();
    const location = window.location;
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    // const [cc1Value, setCc1Value] = useState("");

    const [toggleModalPreviewPdf, setToggleModalPreviewPdf] = useState({
        open: false,
        data: null,
    });

    const { data: dataDelegates } = GET(
        `api/profile_delegates?visitation_information_id=${id}`,
        "profile_delegates_filter",
    );

    const { mutate: mutateVisitorForm, loading: isLoadingFeedback } = POST(
        `api/feedback`,
        "feedback_form",
    );

    const dataSource = [
        {
            id: "0",
            question: "SQD0. I am satisfied with the service that I availed.",
        },
        {
            id: "1",
            question:
                "SQD1. I spent a reasonable amount of time for my transaction.",
        },
        {
            id: "2",
            question:
                "SQD2. The office followed the transaction’s requirements and steps based on the information provided.",
        },
        {
            id: "3",
            question:
                "SQD3. The steps (including payment) I needed to do for my transaction were easy and simple.",
        },
        {
            id: "4",
            question:
                "SQD4. I easily found information about my transaction from the office’s website.",
        },
        {
            id: "5",
            question:
                "SQD5. I paid a reasonable amount of fees for my transaction. (If service was free, mark the N/A column)",
        },
        {
            id: "6",
            question: "SQD6. I am confident my online transaction was secure.",
        },
        {
            id: "7",
            question:
                "SQD7. The office’s online support was available, and (if asked questions) online support was quick to respond.",
        },
    ];

    const options = [
        { key: "sd", label: "Strongly Disagree" },
        { key: "d", label: "Disagree" },
        { key: "nsd", label: "Neither Strongly  Not Disagree" },
        { key: "a", label: "Agree" },
        { key: "sa", label: "Strongly Agree" },
        { key: "na", label: "N/A" },
    ];

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
        let data = new FormData();
        let userId = UserId();

        Object.keys(values).forEach((key) => {
            let bolFields = [
                "client_type",
                "gender",
                "cc1_checkbox",
                "cc2_checkbox",
                "cc3_checkbox",
                ...dataSource.map((item) => `answer_${item.id}`),
            ];

            let value = values[key];
            data.append("user_id", userId);
            data.append("remarks", "Submitted");
            data.append("visitation_information_id", id);

            if (key === "date") {
                value = value ? dayjs(value).format("YYYY-MM-DD") : "";
            }
            if (bolFields.includes(key)) {
                value = value ? value.toString() : "";
            }

            data.append(key, value);
        });

        mutateVisitorForm(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Thank you for your feedback!",
                        description:
                            "You can now download your Certificate of Appearance below.",
                    });
                    setIsSubmitted(true);
                } else {
                    notification.error({
                        message: "Thank you for your feedback!",
                        description:
                            "You can now download your Certificate of Appearance below.",
                    });
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
        });
    };

    useTableScrollOnTop("tbl_feedback", location.pathname);

    const [singleChecked, setSingleChecked] = useState("");

    const handleSingleCheck = (value) => {
        setSingleChecked(value);
        form.setFieldsValue({ [value]: value });
    };

    return (
        <Col xs={24} md={14} lg={14} xl={14} xxl={12}>
            <Card
                className="rounded-tl-none rounded-bl-none rounded-br-lg rounded-tr-lg shadow-lg border-green-800"
                title={
                    <div className="text-center text-lg font-bold text-white">
                        CLIENT SATISFACTION MEASUREMENT SURVEY
                    </div>
                }
                headStyle={{
                    backgroundColor: "#0d5b10",
                    borderColor: "#0d5b10",
                    color: "#fff",
                }}
                bodyStyle={{ overflowY: "auto" }}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={[12, 12]}>
                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="mb-2 font-bold"
                            >
                                Client type:
                            </Typography.Title>
                            <Form.Item
                                name="client_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select client type.",
                                    },
                                ]}
                            >
                                <Checkbox.Group
                                    onChange={(checkedValuesClient) => {
                                        if (checkedValuesClient.length > 1) {
                                            const client =
                                                checkedValuesClient[
                                                    checkedValuesClient.length -
                                                        1
                                                ];
                                            form.setFieldsValue({
                                                client_type: [client],
                                            });
                                        }
                                    }}
                                >
                                    <Row>
                                        <Col span={8}>
                                            <Checkbox value="citizen">
                                                Citizen
                                            </Checkbox>
                                        </Col>
                                        <Col span={8}>
                                            <Checkbox value="business">
                                                Business
                                            </Checkbox>
                                        </Col>
                                        <Col span={8}>
                                            <Checkbox value="government">
                                                Government
                                            </Checkbox>
                                        </Col>
                                        <Col span={8}>
                                            <Checkbox value="others">
                                                Others
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Date"
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select date.",
                                    },
                                ]}
                            >
                                <FloatDatePicker
                                    placeholder="Date"
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="mb-2 font-bold"
                            >
                                Sex:
                            </Typography.Title>
                            <Form.Item
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select gender.",
                                    },
                                ]}
                            >
                                <Checkbox.Group
                                    onChange={(checkedValues) => {
                                        if (checkedValues.length > 1) {
                                            const last =
                                                checkedValues[
                                                    checkedValues.length - 1
                                                ];
                                            form.setFieldsValue({
                                                gender: [last],
                                            });
                                        }
                                    }}
                                >
                                    <Row>
                                        <Col span={8}>
                                            <Checkbox value="male">
                                                Male
                                            </Checkbox>
                                        </Col>
                                        <Col span={8}>
                                            <Checkbox value="female">
                                                Female
                                            </Checkbox>
                                        </Col>
                                        <Col span={8}>
                                            <Checkbox value="others">
                                                Others
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Age"
                                name="age"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter age.",
                                    },
                                ]}
                            >
                                <FloatInput placeholder="Age" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Region of residences"
                                name="region_of_residences"
                            >
                                <FloatSelect
                                    placeholder="Region of residences"
                                    options={regionsSelection}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Offices/Person Visited"
                                name="offices_person_visited"
                            >
                                <FloatInput placeholder="Offices/Person Visited" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Other Information/Concerns"
                                name="other_info_concerns"
                            >
                                <FloatInput placeholder="Other Information/Concerns" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Typography.Paragraph strong>
                                CC1. Which of the following best describes your
                                awareness of a Citizen’s Charter?
                            </Typography.Paragraph>
                            <Form.Item
                                name="cc1_checkbox"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select CC1.",
                                    },
                                ]}
                            >
                                <Checkbox.Group
                                    onChange={(checkedC1) => {
                                        if (checkedC1.length > 1) {
                                            const cc1_checkbox =
                                                checkedC1[checkedC1.length - 1];
                                            form.setFieldsValue({
                                                cc1_checkbox: [cc1_checkbox],
                                            });
                                        }
                                    }}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Checkbox
                                                value="1. I know what a Citizen’s
                                                Charter is and I saw this
                                                office’s Citizen’s Charter."
                                            >
                                                1. I know what a Citizen’s
                                                Charter is and I saw this
                                                office’s Citizen’s Charter.
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox
                                                value="2. I know what a Citizen’s
                                                Charter is but I did not see
                                                this office’s Citizen’s Charter."
                                            >
                                                2. I know what a Citizen’s
                                                Charter is but I did not see
                                                this office’s Citizen’s Charter.
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox
                                                value="3. I learned of the Citizen’s
                                                Charter only when I saw this
                                                office’s Citizen’s Charter."
                                            >
                                                3. I learned of the Citizen’s
                                                Charter only when I saw this
                                                office’s Citizen’s Charter.
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox
                                                value="4. I do not know what a
                                                Citizen’s Charter is and I did
                                                not see one in this office."
                                            >
                                                4. I do not know what a
                                                Citizen’s Charter is and I did
                                                not see one in this office.
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Typography.Paragraph strong className="mt-4">
                                CC2. If aware of Citizen’s Charter (answered 1–3
                                in CC1), would you say that the CC of this
                                office was …?
                            </Typography.Paragraph>
                            <Form.Item name="cc2_checkbox">
                                <Checkbox.Group
                                    onChange={(checkedC2) => {
                                        if (checkedC2.length > 1) {
                                            const cc2_checkbox =
                                                checkedC2[checkedC2.length - 1];
                                            form.setFieldsValue({
                                                cc2_checkbox: [cc2_checkbox],
                                            });
                                        }
                                    }}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Checkbox value="1. Easy to see">
                                                1. Easy to see
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="2. Somewhat easy to see">
                                                2. Somewhat easy to see
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="3. Difficult to see">
                                                3. Difficult to see
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="4. Not visible at all">
                                                4. Not visible at all
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="5. N/A">
                                                5. N/A
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Typography.Paragraph strong className="mt-4">
                                CC3. If aware of Citizen’s Charter (answered 1–3
                                in CC1), how much did the CC help you in your
                                transaction?
                            </Typography.Paragraph>
                            <Form.Item name="cc3_checkbox">
                                <Checkbox.Group
                                    onChange={(checkedC3) => {
                                        if (checkedC3.length > 1) {
                                            const cc3_checkbox =
                                                checkedC3[checkedC3.length - 1];
                                            form.setFieldsValue({
                                                cc3_checkbox: [cc3_checkbox],
                                            });
                                        }
                                    }}
                                >
                                    <Row>
                                        <Col span={24}>
                                            <Checkbox value="1. Helped very much">
                                                1. Helped very much
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="2. Somewhat helped">
                                                2. Somewhat helped
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="3. Did not help">
                                                3. Did not help
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="4. N/A">
                                                4. N/A
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Typography.Paragraph strong>
                                INSTRUCTIONS: For SQD 0-8, please check the
                                column that best corresponds to your answer.
                            </Typography.Paragraph>
                            <Table
                                dataSource={dataSource}
                                id="tbl_feedback"
                                rowKey="id"
                                pagination={false}
                                bordered
                                scroll={{ x: "max-content" }}
                                sticky
                                className="overflow-x-auto"
                            >
                                <Table.Column
                                    title="Question"
                                    width={400}
                                    dataIndex="question"
                                    render={(text) => (
                                        <div className="break-words max-w-xs font-semibold">
                                            {text}
                                        </div>
                                    )}
                                />
                                {options.map((opt) => (
                                    <Table.Column
                                        key={opt.key}
                                        width={180}
                                        title={
                                            <div className="text-center whitespace-nowrap min-w-[10px]">
                                                {opt.label}
                                            </div>
                                        }
                                        render={(_, record) => (
                                            <Form.Item
                                                name={`answer_${record.id}`}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `Answer ${record.id} is required.`,
                                                    },
                                                ]}
                                                style={{ margin: 0 }}
                                            >
                                                <Checkbox.Group
                                                    className="w-full flex justify-center"
                                                    options={[
                                                        {
                                                            label: "",
                                                            value: opt.key,
                                                        },
                                                    ]}
                                                    onChange={(val) =>
                                                        form.setFieldsValue({
                                                            [`answer_${record.id}`]:
                                                                val,
                                                        })
                                                    }
                                                />
                                            </Form.Item>
                                        )}
                                    />
                                ))}
                            </Table>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Suggestions (optional)"
                                name="suggestions"
                            >
                                <FloatInput placeholder="Suggestions on how we can improve" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Email address (optional)"
                                name="email_address"
                            >
                                <FloatInput placeholder="Email address" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} className="text-center">
                            <Form.Item>
                                {status?.toLowerCase() !== "approved" && (
                                    <Typography.Text
                                        type="danger"
                                        className="block mb-2! text-red-600"
                                    >
                                        You can only submit when status is
                                        approved.
                                        <Button
                                            type="link"
                                            className="p-0!"
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
                                    loading={isLoadingFeedback}
                                    className="bg-green-700 border-green-800 hover:bg-green-800 hover:border-green-900 font-bold"
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
                {isSubmitted && dataDelegates?.data && (
                    <>
                        <Table
                            dataSource={dataDelegates && dataDelegates.data}
                            pagination={false}
                            rowKey={(record) => record.id}
                            className="mt-4"
                        >
                            <Table.Column
                                title="Delegates Name"
                                dataIndex="fullname"
                                key="fullname"
                            />
                        </Table>

                        <br />
                        <div className="text-center mt-4">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() =>
                                    setToggleModalPreviewPdf({
                                        open: true,
                                        url: `api/generate_visitation_certificates?visitation_information_id=${id}`,
                                    })
                                }
                                className="bg-green-700 border-green-800 hover:bg-green-800"
                            >
                                Download Certificate of Appearance
                            </Button>
                        </div>
                    </>
                )}
                <ModalPreviewPdf
                    setToggleModalPreviewPdf={setToggleModalPreviewPdf}
                    toggleModalPreviewPdf={toggleModalPreviewPdf}
                />
            </Card>
        </Col>
    );
}
