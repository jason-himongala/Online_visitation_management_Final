import { Card, Col, Row, Typography, Form, Button } from "antd";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import FloatTimePicker from "../../../../providers/FloatTimePicker";
import FloatInput from "../../../../providers/FloatInput";

export default function PageVisitationContent() {
    const [form] = Form.useForm();

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
                {/* Important Note */}
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

                <Form form={form} layout="vertical">
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
                                name="preferredDate"
                            >
                                <FloatDatePicker format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Preferred Time of Visit"
                                name="preferredTime"
                            >
                                <FloatTimePicker format="h:mm a" use12Hours />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Alternate Date of Visit"
                                name="alternateDate"
                            >
                                <FloatDatePicker format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Alternate Time of Visit"
                                name="alternateTime"
                            >
                                <FloatTimePicker format="h:mm a" use12Hours />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item label="Purpose of Visit" name="purpose">
                                <FloatInput placeholder="Purpose of Visit" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Selected Faculty Centered Office/Organization to Visit"
                                name="office"
                            >
                                <FloatInput placeholder="Selected Faculty Centered Office Organization to Visit" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Manner of Engagement (in-person or virtual)"
                                name="engagement"
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
                                name="agency"
                            >
                                <FloatInput placeholder="Name of Institution Agency" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Name and Contact Details of the Contact Person"
                                name="contactPerson"
                            >
                                <FloatInput placeholder="Name and Contact Details of the Contact Person" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Number of Delegates(s)"
                                name="delegatesCount"
                            >
                                <FloatInput placeholder="Number of Delegates(s)" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Names and Positions of the Delegates"
                                name="delegates"
                            >
                                <FloatInput placeholder="Names and Positions of the Delegates" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Topics for Discussion"
                                name="topics"
                            >
                                <FloatInput placeholder="Topics for Discussion" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Other Information/Concerns"
                                name="otherInfo"
                            >
                                <FloatInput placeholder="Other Information Concern" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Submit Button */}
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
