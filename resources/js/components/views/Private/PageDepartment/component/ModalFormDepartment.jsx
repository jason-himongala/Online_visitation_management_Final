import { useEffect } from "react";
import { Modal, Button, Form, notification } from "antd";

import { POST } from "../../../../providers/useAxiosQuery";
import FloatInput from "../../../../providers/FloatInput";
import notificationErrors from "../../../../providers/notificationErrors";
import validateRules from "../../../../providers/validateRules";

export default function ModalFormDepartment(props) {
    const { toggleModalDepartment, setToggleModalDepartment } = props;

    const [form] = Form.useForm();

    const { mutate: mutateDepartment, loading: loadingDepartment } = POST(
        `api/department`,
        "department_list"
    );

    const onFinish = (values) => {
        let data = {
            ...values,
            id:
                toggleModalDepartment.data && toggleModalDepartment.data.id
                    ? toggleModalDepartment.data.id
                    : "",
        };

        mutateDepartment(data, {
            onSuccess: (res) => {
                if (res.success) {
                    setToggleModalDepartment({
                        open: false,
                        data: null,
                    });
                    form.resetFields();
                    notification.success({
                        message: "Department",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "Department",
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
        if (toggleModalDepartment.open) {
            form.setFieldsValue({
                ...toggleModalDepartment.data,
            });
        }

        return () => {};
    }, [toggleModalDepartment]);

    return (
        <Modal
            title="Form Department"
            open={toggleModalDepartment.open}
            onCancel={() => {
                setToggleModalDepartment({
                    open: false,
                    data: null,
                });
                form.resetFields();
            }}
            forceRender
            footer={[
                <Button
                    className="btn-main-primary outlined"
                    size="large"
                    shape="round"
                    key={1}
                    onClick={() => {
                        setToggleModalDepartment({
                            open: false,
                            data: null,
                        });
                        form.resetFields();
                    }}
                >
                    CANCEL
                </Button>,
                <Button
                    className="ant-btn-primary"
                    type="primary"
                    shape="round"
                    size="large"
                    key={2}
                    onClick={() => form.submit()}
                    loading={loadingDepartment}
                >
                    SUBMIT
                </Button>,
            ]}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="department_name"
                    rules={[validateRules.required()]}
                >
                    <FloatInput
                        label="Department Name"
                        placeholder="Department Name"
                        required={true}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
