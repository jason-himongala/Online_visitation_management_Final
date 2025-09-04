import { useEffect } from "react";
import { Modal, Button, Form, notification } from "antd";

import { POST } from "../../../../../../providers/useAxiosQuery";
import validateRules from "../../../../../../providers/validateRules";
import FloatInput from "../../../../../../providers/FloatInput";
import notificationErrors from "../../../../../../providers/notificationErrors";

export default function ModalFormSubject(props) {
    const { toggleModalSubject, setToggleModalSubject } = props;

    const [form] = Form.useForm();

    const { mutate: mutateSubject, isLoading: isLoadingSubject } = POST(
        `api/subject`,
        "subject_list"
    );

    const onFinish = (values) => {
        console.log("onFinish", values);

        let data = {
            ...values,
            id:
                toggleModalSubject.data && toggleModalSubject.data.id
                    ? toggleModalSubject.data.id
                    : "",
        };

        mutateSubject(data, {
            onSuccess: (res) => {
                console.log("res", res);
                if (res.success) {
                    setToggleModalSubject({
                        open: false,
                        data: null,
                    });
                    form.resetFields();
                    notification.success({
                        message: "Subject",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "Subject",
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
        if (toggleModalSubject.open) {
            form.setFieldsValue({
                ...toggleModalSubject.data,
            });
        }

        return () => {};
    }, [toggleModalSubject]);

    return (
        <Modal
            title="Form Subject"
            open={toggleModalSubject.open}
            onCancel={() => {
                setToggleModalSubject({
                    open: false,
                    data: null,
                });
                form.resetFields();
            }}
            forceRender
            footer={[
                <Button
                    size="large"
                    key={1}
                    shape="round"
                    onClick={() => {
                        setToggleModalSubject({
                            open: false,
                            data: null,
                        });
                        form.resetFields();
                    }}
                >
                    CANCEL
                </Button>,
                <Button
                    type="primary"
                    size="large"
                    shape="round"
                    key={2}
                    onClick={() => form.submit()}
                    loading={isLoadingSubject}
                >
                    SUBMIT
                </Button>,
            ]}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="subject" rules={[validateRules.required()]}>
                    <FloatInput
                        label="Subject"
                        placeholder="Subject"
                        required={true}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
