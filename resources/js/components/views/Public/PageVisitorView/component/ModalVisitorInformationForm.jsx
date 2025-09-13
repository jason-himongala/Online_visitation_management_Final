import { useState } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Modal,
    notification,
    Row,
    Upload,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-regular-svg-icons";
import validateRules from "../../../../providers/validateRules";
import imageFileToBase64 from "../../../../providers/imageFileToBase64";
import FloatInput from "../../../../providers/FloatInput";

export default function ModalVisitorInformationForm(props) {
    const {
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
    } = props;
    const [form] = Form.useForm();
    const [imageUrlLogo, setImageUrlLogo] = useState({
        imageFileToBase64Data: null,
        file: null,
    });
    return (
        <Modal
            title="Visitor Information"
            closeIcon={<FontAwesomeIcon icon={faXmark} />}
            open={toggleModalVisitorInformationForm.open}
            onCancel={() => {
                setToggleModalVisitorInformationForm({
                    open: false,
                    data: null,
                });
            }}
            forceRender
            footer={[
                <Button
                    shape="round"
                    onClick={() => {
                        setToggleModalVisitorInformationForm({
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
                >
                    Submit Request
                </Button>,
            ]}
        >
            <Form>
                <Row gutter={[20, 0]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="email"
                            rules={[validateRules.required()]}
                        >
                            <FloatInput
                                label="Your Email Address"
                                required
                                placeholder="Your Email Address"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item name="purpose_of_visit">
                            <FloatInput
                                label="Purpose of Visit"
                                required
                                placeholder="Purpose of Visit"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="pdf_file"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e?.fileList;
                            }}
                        >
                            <Upload
                                style={{ width: "100%" }}
                                className="event-logo-upload"
                                listType="text"
                                accept="application/pdf"
                                showUploadList={false}
                                beforeUpload={async (file) => {
                                    const isPDF =
                                        file.type === "application/pdf";
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isPDF) {
                                        notification.error({
                                            message: "Official Request Letter",
                                            description:
                                                "Only PDF files are allowed!",
                                        });
                                        return Upload.LIST_IGNORE;
                                    }
                                    if (!isLt2M) {
                                        notification.error({
                                            message: "Official Request Letter",
                                            description:
                                                "PDF must be smaller than 2MB!",
                                        });
                                        return Upload.LIST_IGNORE;
                                    }
                                    setImageUrlLogo({
                                        imageFileToBase64Data: null,
                                        file,
                                    });
                                    return false;
                                }}
                                maxCount={1}
                            >
                                <Card
                                    hoverable
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Button>Choose File</Button>
                                    {imageUrlLogo.file && (
                                        <span
                                            style={{
                                                marginLeft: 16,
                                                color: "#1677ff",
                                            }}
                                        >
                                            {imageUrlLogo.file.name}
                                        </span>
                                    )}
                                </Card>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
