import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-regular-svg-icons";
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

import { POST } from "../../../../providers/useAxiosQuery";
import { UserId } from "../../../../providers/appConfig";
import FloatInput from "../../../../providers/FloatInput";

export default function ModalVisitorInformationForm(props) {
    const userId = UserId();
    // console.log("userId", userId);
    const {
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
    } = props;
    const [form] = Form.useForm();
    const [imageUrlLogo, setImageUrlLogo] = useState({
        imageFileToBase64Data: null,
        file: null,
    });

    // console.log(
    //     "toggleModalVisitorInformationForm",
    //     toggleModalVisitorInformationForm
    // );

    const { mutate: mutateVisitorInfo, loading: isLoadingSubmit } = POST(
        `api/visitation_information`,
        "visitation_information_submit"
    );

    const handleSubmit = (values) => {
        let purpose_of_visit = values.purpose_of_visit;
        let profile_id = userId ? userId : null;

        console.log("profile_id", profile_id);
        let appointment_schedule_id =
            toggleModalVisitorInformationForm.data &&
            toggleModalVisitorInformationForm.data.id
                ? toggleModalVisitorInformationForm.data.id
                : null;
        // console.log("onFinish", values);

        let data = {
            ...values,
            appointment_schedule_id: appointment_schedule_id,
            profile_id: profile_id,
            purpose_of_visit,
        };

        mutateVisitorInfo(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Application Submitted",
                        description: res.message,
                    });

                    setToggleModalVisitorInformationForm({
                        open: false,
                        data: null,
                    });

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
                    message: "Email Update",
                    description: "Something went Wrong",
                });
            },
        });
    };

    return (
        <Modal
            title={`Visitor Information -  ${
                toggleModalVisitorInformationForm.data &&
                toggleModalVisitorInformationForm.data.department_name
                    ? toggleModalVisitorInformationForm.data.department_name +
                      " "
                    : ""
            }${
                toggleModalVisitorInformationForm.data &&
                toggleModalVisitorInformationForm.data.available_time
                    ? toggleModalVisitorInformationForm.data.available_time
                    : ""
            } `}
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
                    loading={isLoadingSubmit}
                    className="ant-btn-primary"
                    onClick={() => {
                        form.submit();
                    }}
                    key={2}
                >
                    Submit Request
                </Button>,
            ]}
        >
            <Row gutter={[20, 0]}>
                {/* <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            name="profile_id"
                            rules={[validateRules.required()]}
                        >
                            <FloatInput
                                label="Your Email Address"
                                required
                                placeholder="Your Email Address"
                            />
                        </Form.Item>
                    </Col> */}
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item name="purpose_of_visit">
                            <FloatInput
                                label="Purpose of Visit"
                                required
                                placeholder="Purpose of Visit"
                            />
                        </Form.Item>
                    </Col>
                </Form>
            </Row>
        </Modal>
    );
}
