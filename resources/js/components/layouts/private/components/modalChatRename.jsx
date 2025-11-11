import React, { useEffect, useState } from "react";

import { Button, Modal, Form } from "antd";
import { POST } from "../../../providers/useAxiosQuery";
import FloatInput from "../../../providers/FloatInput";

export default function ModalChatRename({
    toggleModalChatRename,
    setToggleModalChatRename,
    selectedGroup,
}) {
    const [form] = Form.useForm();

    const { mutate: mutateChangeChat, loading: isLoadingChangeChat } = POST(
        `api/chat`,
        ["chat_member_list_rename", "post_visitor_chat_message"]
    );

    const handleChangeGroupChat = (values) => {
        const payload = {
            title_of_groupchat: values.title_of_groupchat,
            id: toggleModalChatRename.data.id,
        };

        mutateChangeChat(payload, {
            onSuccess: (res) => {
                if (res.success) {
                    setToggleModalChatRename({ open: false, data: null });
                    form.resetFields();
                }
            },
        });
    };

    const handleClose = () => {
        setToggleModalChatRename({ open: false, data: null });
        form.resetFields();
    };

    useEffect(() => {
        if (toggleModalChatRename.open) {
            form.setFieldsValue({
                ...toggleModalChatRename.data,
            });
        }
    }, [toggleModalChatRename.data]);

    return (
        <Modal
            title="Rename Group Chat"
            className="custom-blur-modal"
            open={toggleModalChatRename?.open}
            onCancel={handleClose}
            footer={[
                <Button
                    key="close"
                    type="default"
                    shape="round"
                    size="large"
                    disabled={isLoadingChangeChat}
                    onClick={handleClose}
                >
                    Close
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    shape="round"
                    size="large"
                    loading={isLoadingChangeChat}
                    onClick={() => form.submit()}
                >
                    Submit
                </Button>,
            ]}
            closable
        >
            <Form
                layout="vertical"
                onFinish={handleChangeGroupChat}
                form={form}
            >
                <Form.Item
                    name="title_of_groupchat"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a chat name",
                        },
                    ]}
                >
                    <FloatInput placeholder="Enter Chat Name" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
