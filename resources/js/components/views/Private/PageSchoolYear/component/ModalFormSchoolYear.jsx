import { useEffect } from "react";
import dayjs from "dayjs";
import { Modal, Button, Form, notification } from "antd";

import { POST } from "../../../../../../providers/useAxiosQuery";
import notificationErrors from "../../../../../../providers/notificationErrors";
import FloatDatePicker from "../../../../../../providers/FloatDatePicker";

export default function ModalFormSchoolYear(props) {
    const { toggleModalSchoolYear, setToggleModalSchoolYear } = props;

    const [form] = Form.useForm();

    const { mutate: mutateSchoolYear, loading: loadingSchoolYear } = POST(
        `api/school_year`,
        "school_year_list"
    );

    const onFinish = (values) => {
        let data = {
            ...values,
            id: toggleModalSchoolYear.data?.id || "",
            sy_from: values.sy_from
                ? dayjs(values.sy_from).format("YYYY-MM-DD")
                : null,
            sy_to: values.sy_to
                ? dayjs(values.sy_to).format("YYYY-MM-DD")
                : null,

            status: toggleModalSchoolYear.data?.status || 0,
        };

        mutateSchoolYear(data, {
            onSuccess: (res) => {
                if (res.success) {
                    setToggleModalSchoolYear({ open: false, data: null });
                    form.resetFields();
                    notification.success({
                        message: "School Year",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "School Year",
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
        if (toggleModalSchoolYear.open) {
            form.setFieldsValue({
                ...toggleModalSchoolYear.data,
                sy_from: toggleModalSchoolYear.data?.sy_from
                    ? dayjs(toggleModalSchoolYear.data.sy_from, "YYYY")
                    : null,
                sy_to: toggleModalSchoolYear.data?.sy_to
                    ? dayjs(toggleModalSchoolYear.data.sy_to, "YYYY")
                    : null,
            });
        }

        return () => {};
    }, [toggleModalSchoolYear]);
    return (
        <Modal
            title="Form School Year"
            open={toggleModalSchoolYear.open}
            onCancel={() => {
                setToggleModalSchoolYear({
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
                        setToggleModalSchoolYear({
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
                    loading={loadingSchoolYear}
                >
                    SUBMIT
                </Button>,
            ]}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="sy_from">
                    <FloatDatePicker
                        format="YYYY"
                        label="Year From"
                        placeholder="Year From"
                        picker="year"
                    />
                </Form.Item>

                <Form.Item name="sy_to">
                    <FloatDatePicker
                        format="YYYY"
                        label="Year To"
                        placeholder="Year To"
                        required={true}
                        picker="year"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
