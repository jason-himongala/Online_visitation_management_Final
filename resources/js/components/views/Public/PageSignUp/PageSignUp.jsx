import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Flex,
    Form,
    Layout,
    notification,
    Row,
    Typography,
} from "antd";

import { POST } from "../../../providers/useAxiosQuery";
import { appLogo, encrypt } from "../../../providers/appConfig";
import validateRules from "../../../providers/validateRules";
import FloatInput from "../../../providers/FloatInput";
import FloatInputPassword from "../../../providers/FloatInputPassword";
import ModalUploadProfilePicture from "./components/ModalUploadProfilePicture";

export default function PageSignUp() {
    const [
        toggleModalUploadProfilePicture,
        setToggleModalUploadProfilePicture,
    ] = useState({
        open: false,
        file: null,
        src: null,
        is_camera: null,
        fileName: null,
    });

    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const { mutate: mutateSignUp, isLoading: isLoadingSignUp } = POST(
        "api/profiles_signup"
    );
    const onFinish = (values) => {
        let data = new FormData();
        Object.keys(values).forEach((key) => {
            data.append(key, values[key]);
        });
        if (toggleModalUploadProfilePicture.file) {
            data.append(
                "profile_picture",
                toggleModalUploadProfilePicture.file,
                toggleModalUploadProfilePicture.fileName
            );
        }
        mutateSignUp(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Sign up successful.",
                        description:
                            "You can now log in with your credentials.",
                    });
                    navigate("/login");
                } else {
                    notification.error({
                        message:
                            res.message || "Sign up failed. Please try again.",
                    });
                }
            },
            onError: (err) => {
                notification.error({
                    message:
                        err.response?.data?.message ||
                        "Sign up failed. Please try again.",
                });
            },
        });
    };

    return (
        <Layout.Content className="flex justify-center items-center h-full">
            <Row gutter={[20, 20]} className="w-full" justify="center">
                <Card className="page-login-card w-lg">
                    <Flex align="center" justify="center">
                        <img src={appLogo} className="w-50" />
                    </Flex>
                    <Typography.Title level={3} className="text-center mb-5!">
                        Sign Up
                    </Typography.Title>

                    <Form layout="vertical" onFinish={onFinish} form={form}>
                        <Form.Item
                            name="firstname"
                            rules={[validateRules.required()]}
                        >
                            <FloatInput label="First Name" />
                        </Form.Item>
                        <Form.Item
                            name="lastname"
                            rules={[validateRules.required()]}
                        >
                            <FloatInput label="Last Name" />
                        </Form.Item>
                        <Form.Item
                            name="username"
                            rules={[validateRules.required()]}
                        >
                            <FloatInput label="Username" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[validateRules.required()]}
                        >
                            <FloatInput label="Email" />
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
                        <Form.Item
                            name="confirm_password"
                            dependencies={["password"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Passwords do not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <FloatInputPassword
                                label="Confirm Password"
                                autoComplete="new-password"
                            />
                        </Form.Item>

                        <Col lg={24} className="text-center mb-5">
                            <Button
                                type="primary"
                                block
                                shape="round"
                                onClick={() =>
                                    setToggleModalUploadProfilePicture(
                                        (ps) => ({
                                            ...ps,
                                            open: true,
                                        })
                                    )
                                }
                            >
                                Upload Profile Picture{" "}
                            </Button>
                            <ModalUploadProfilePicture
                                toggleModalUploadProfilePicture={
                                    toggleModalUploadProfilePicture
                                }
                                setToggleModalUploadProfilePicture={
                                    setToggleModalUploadProfilePicture
                                }
                                // params={params}
                            />
                        </Col>
                        <br />

                        <Flex
                            align="center"
                            vertical="center"
                            justify="between"
                        >
                            <Button
                                type="primary"
                                shape="round"
                                block
                                loading={isLoadingSignUp}
                                htmlType="submit"
                            >
                                Sign Up
                            </Button>
                        </Flex>
                        <Typography.Paragraph className="mt-5 text-center">
                            Already have an account?{" "}
                            <a href="/login" className="font-semibold">
                                Log In
                            </a>
                        </Typography.Paragraph>
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
                    </Form>
                </Card>
            </Row>
        </Layout.Content>
    );
}
