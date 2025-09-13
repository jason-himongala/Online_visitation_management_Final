import { useState } from "react";
import {
    Card,
    Col,
    Row,
    Typography,
    Form,
    Button,
    Checkbox,
    Table,
    Radio,
} from "antd";

import FloatDatePicker from "../../../../providers/FloatDatePicker";
import FloatInput from "../../../../providers/FloatInput";
import { useTableScrollOnTop } from "../../../../providers/CustomTableFilter";

export default function PageFeedbackContent(props) {
    const { width } = props;
    const [form] = Form.useForm();
    const location = window.location;

    const dataSource = [
        {
            id: "0",
            question: "SQD0. I am satisfied with the service that I availed.",
            width: 100,
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
        { key: "nsd", label: "Neither Strongly Nor Disagree" },
        { key: "a", label: "Agree" },
        { key: "sa", label: "Strongly Agree" },
        { key: "na", label: "N/A" },
    ];
    const [answers, setAnswers] = useState({});

    const handleChange = (rowId, value) => {
        setAnswers((prev) => ({ ...prev, [rowId]: value }));
    };

    useTableScrollOnTop("tbl_feedback", location.pathname);

    return (
        <Col xs={24} md={14} lg={14} xl={14} xxl={12}>
            <Card
                width={1000}
                className="rounded-ss-none rounded-es-none rounded-se-lg rounded-ee-lg shadow-lg border-green-800"
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
                bodyStyle={{
                    // 👈 set desired height
                    overflowY: "auto", // 👈 makes inside scrollable
                }}
            >
                <Row gutter={[0, 0]}>
                    <Col xs={24} className="mt-2">
                        <Typography.Title
                            level={4}
                            className="!text-blue-600 !mb-2 text-left"
                        >
                            NOTE!
                        </Typography.Title>

                        <Typography.Paragraph className="text-center leading-relaxed">
                            This Client satisfaction Management (CSM) tracks the
                            client experiences of government experiences.
                            Pesonal information shared will be kept confidential
                            and you always have the option not to answer Your
                            feedback on your recently concluded transaction will
                            help this office provide a better services.
                        </Typography.Paragraph>
                    </Col>
                </Row>

                <Form form={form} layout="vertical">
                    <Row gutter={[12, 12]}>
                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="!mb-2 !font-bold"
                            >
                                Client type:
                            </Typography.Title>

                            <Checkbox.Group>
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
                                            Goverment
                                        </Checkbox>
                                    </Col>

                                    <Col span={8}>
                                        <Checkbox value="others">
                                            Others
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Col>
                    </Row>

                    <br />
                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item label="Date" name="office">
                                <FloatDatePicker placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="!mb-2 !font-bold"
                            >
                                Sex:
                            </Typography.Title>

                            <Checkbox.Group>
                                <Row>
                                    <Col span={8}>
                                        <Checkbox value="male">Male</Checkbox>
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
                        </Col>

                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item label="Age" name="age">
                                <FloatInput placeholder="Age" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                label="Region of residences"
                                name="regionOfResidences"
                            >
                                <FloatInput placeholder="Region of residences" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                label="Offices/Person Visited:"
                                name="delegates"
                            >
                                <FloatInput placeholder="Offices/Person Visited" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                label="Other Information/Concerns"
                                name="otherInfo"
                            >
                                <FloatInput placeholder="Other Information Concern" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <div className="!mb-2 !font-bold border border-gray-400 p-2 rounded"></div>
                        </Col>
                    </Row>
                    <Typography.Paragraph strong>
                        CC1. Which of the following best describes your
                        awareness of a Citizen’s Charter?
                    </Typography.Paragraph>

                    <Checkbox.Group>
                        <Row>
                            <Col span={24}>
                                <Checkbox value="cc1_1">
                                    1. I know what a Citizen’s Charter is and I
                                    saw this office’s Citizen’s Charter.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc1_2">
                                    2. I know what a Citizen’s Charter is but I
                                    did not see this office’s Citizen’s Charter.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc1_3">
                                    3. I learned of the Citizen’s Charter only
                                    when I saw this office’s Citizen’s Charter.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc1_4">
                                    4. I do not know what a Citizen’s Charter is
                                    and I did not see one in this office.
                                </Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>

                    <Typography.Paragraph strong className="mt-4">
                        CC2. If aware of Citizen’s Charter (answered 1–3 in
                        CC1), would you say that the CC of this office was …?
                    </Typography.Paragraph>

                    <Checkbox.Group>
                        <Row>
                            <Col span={24}>
                                <Checkbox value="cc2_1">
                                    1. Easy to see
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc2_2">
                                    2. Somewhat easy to see
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc2_3">
                                    3. Difficult to see
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc2_4">
                                    4. Not visible at all
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc2_5">5. N/A</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>

                    <Typography.Paragraph strong className="mt-4">
                        CC3. If aware of Citizen’s Charter (answered 1–3 in
                        CC1), how much did the CC help you in your transaction?
                    </Typography.Paragraph>

                    <Checkbox.Group>
                        <Row>
                            <Col span={24}>
                                <Checkbox value="cc3_1">
                                    1. Helped very much
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc3_2">
                                    2. Somewhat helped
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc3_3">
                                    3. Did not help
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value="cc3_4">4. N/A</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Typography.Paragraph strong>
                            INSTRUCTIONS: For SQD 0-8, please put a check mark
                            (✓) on the column that best corresponds to your
                            answer.
                        </Typography.Paragraph>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} scroll>
                        <Table
                            dataSource={dataSource}
                            id="tbl_feedback"
                            rowKey="id"
                            pagination={false}
                            bordered
                            scroll={{ x: "max-content" }}
                            sticky
                        >
                            <Table.Column
                                title="Question"
                                width={400}
                                dataIndex="question"
                                render={(text) => (
                                    <div className="whitespace-pre-line break-words max-w-xs font-semibold">
                                        {text}
                                    </div>
                                )}
                            />

                            {options.map((opt) => (
                                <Table.Column
                                    width={opt.key === "na" ? 80 : 120}
                                    key={opt.key}
                                    title={
                                        <div className="whitespace-pre-line text-center">
                                            {opt.label}
                                        </div>
                                    }
                                    render={(_, record) => (
                                        <div className="flex justify-center">
                                            <Checkbox
                                                checked={
                                                    answers[record.id] ===
                                                    opt.key
                                                }
                                                onChange={() =>
                                                    handleChange(
                                                        record.id,
                                                        opt.key
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            ))}
                        </Table>
                    </Col>
                    <br />
                    <Col xs={24}>
                        <Form.Item
                            label="Suggestions on how we can further improve our services(optional)"
                            name="suggestions"
                        >
                            <FloatInput placeholder="Suggestions on how we can further improve our services(optional) " />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item label="Email address(optional)" name="email">
                            <FloatInput placeholder="Email address(optional)" />
                        </Form.Item>
                    </Col>

                    <Row justify="center">
                        <Col>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    shape="round"
                                    className="bg-green-700 border-green-800 hover:bg-green-800 hover:border-green-900 text-center font-bold"
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
