import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Alert,
    Button,
    Card,
    Flex,
    Form,
    Layout,
    Row,
    Typography,
    Modal,
    message as AntMessage,
} from "antd";

import { POST } from "../../../providers/useAxiosQuery";
import { appLogo, encrypt } from "../../../providers/appConfig";
import validateRules from "../../../providers/validateRules";
import FloatInput from "../../../providers/FloatInput";
import FloatInputPassword from "../../../providers/FloatInputPassword";

export default function PageLogin() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactMessage, setContactMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [deactivatedUserId, setDeactivatedUserId] = useState(null);
    const navigate = useNavigate();

    const { mutate: mutateLogin, isLoading: isLoadingLogin } =
        POST("api/login");

    const { mutate: mutateContact, isLoading: isLoadingContact } = POST(
        `api/submit_contact`,
        "submit_contact_list",
    );

    const onFinish = (values) => {
        mutateLogin(values, {
            onSuccess: (res) => {
                if (res.data) {
                    if (res.data.deactivated_at) {
                        setDeactivatedUserId(res.data.id);
                        setErrorMessage(
                            `Your account has been deactivated. <a href="#" id="contact-link">Contact support</a>`,
                        );
                        return;
                    }
                    localStorage.userdata = encrypt(JSON.stringify(res.data));
                    localStorage.token = res.token;
                    if (res.data.role === "Visitor") {
                        navigate("/home");
                    }
                    window.location.reload();
                } else {
                    setErrorMessage(res.message);
                }
            },
            onError: (error) => {
                console.log("Error: ", error);
                setErrorMessage(error.response.data.message);
            },
        });
    };

    useEffect(() => {
        const handler = (e) => {
            if (e.target.id === "contact-link") {
                e.preventDefault();
                setShowContactModal(true);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const handleSendContact = () => {
        if (!contactMessage.trim() || !deactivatedUserId) return;
        setSending(true);
        mutateContact(
            { user_id: deactivatedUserId, message: contactMessage },
            {
                onSuccess: () => {
                    setSending(false);
                    setShowContactModal(false);
                    setContactMessage("");
                    AntMessage.success(
                        "Your message has been sent. Our team will contact you soon.",
                    );
                },
                onError: (error) => {
                    setSending(false);
                    AntMessage.error(
                        "Failed to send message. Please try again.",
                    );
                },
            },
        );
    };

    return (
        <>
            <Layout.Content className="flex justify-center items-center h-full">
                <Row gutter={[20, 20]} className="w-full" justify="center">
                    <Card className="page-login-card w-lg">
                        <Flex align="center" justify="center">
                            <img src={appLogo} className="w-25" />
                        </Flex>
                        <Typography.Title
                            level={3}
                            className="text-center mb-5!"
                        >
                            Login
                        </Typography.Title>

                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="email"
                                rules={[validateRules.required()]}
                            >
                                <FloatInput label="Username/Email" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[validateRules.required()]}
                            >
                                <FloatInputPassword
                                    label="Password"
                                    autoComplete="new-password"
                                />
                            </Form.Item>

                            <Flex
                                align="center"
                                vertical="center"
                                justify="between"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    shape="round"
                                    loading={isLoadingLogin}
                                >
                                    Log in
                                </Button>
                            </Flex>

                            <Typography.Paragraph className="mt-5 text-center">
                                {errorMessage && (
                                    <Alert
                                        className="mt-5!"
                                        type="error"
                                        message={
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: errorMessage,
                                                }}
                                            />
                                        }
                                    />
                                )}
                                Don't have an account?{" "}
                                <a href="/sign-up" className="font-semibold">
                                    Sign Up
                                </a>
                            </Typography.Paragraph>
                        </Form>
                    </Card>
                </Row>
            </Layout.Content>
            <Modal
                open={showContactModal}
                onCancel={() => setShowContactModal(false)}
                footer={null}
                title="Contact Support"
            >
                <p>
                    For account reactivation or support, please leave a message
                    below and our team will contact you.
                </p>
                <FloatInput
                    type="text"
                    className="w-full border rounded px-2 py-1 mb-3"
                    placeholder="Enter your message or email"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                />
                <Button
                    type="primary"
                    block
                    onClick={handleSendContact}
                    loading={sending || isLoadingContact}
                    disabled={!contactMessage.trim() || !deactivatedUserId}
                >
                    Send
                </Button>
            </Modal>
        </>
    );
}
