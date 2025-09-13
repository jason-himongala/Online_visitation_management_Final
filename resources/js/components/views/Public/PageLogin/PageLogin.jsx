import { useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Flex,
    Form,
    Layout,
    Row,
    Typography,
} from "antd";

import { POST } from "../../../providers/useAxiosQuery";
import {
    appLogo,
    date,
    encrypt,
    description,
} from "../../../providers/appConfig";
import validateRules from "../../../providers/validateRules";
import FloatInput from "../../../providers/FloatInput";
import FloatInputPassword from "../../../providers/FloatInputPassword";
import { useNavigate } from "react-router-dom";

export default function PageLogin() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const { mutate: mutateLogin, isLoading: isLoadingLogin } =
        POST("api/login");

    const onFinish = (values) => {
        mutateLogin(values, {
            onSuccess: (res) => {
                if (res.data) {
                    localStorage.userdata = encrypt(JSON.stringify(res.data));
                    localStorage.token = res.token;
                    if (res.data.role === "Visitor") {
                        navigate("/home");
                    }
                    if (res.data.role === "Super Admin") {
                        navigate("/dashboard");
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

    return (
        <>
            <Layout.Content
                className="flex flex-col justify-start items-center h-full pt-5"
                style={{
                    backgroundColor: "rgba(13,91,16,0.7)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                }}
            >
                <Flex align="center" justify="center" className="mb-5">
                    <Typography.Title
                        style={{ textAlign: "center", marginTop: "-10px" }}
                        size="large"
                    >
                        <img
                            src={appLogo}
                            className="w-40 "
                            style={{
                                marginLeft: "220px",
                            }}
                        />
                        CARAGA STATE UNIVERSITY
                        <br />
                        <span style={{ color: "#fff" }} marginTop="-15px">
                            <span style={{ color: "#2ADE1D" }}>C</span>ompetence
                            <span style={{ color: "#2ADE1D" }}>
                                {" "}
                                S
                            </span>ervice{" "}
                            <span style={{ color: "#2ADE1D" }}>U</span>
                            prightness
                        </span>
                    </Typography.Title>
                </Flex>

                <Row
                    gutter={[20, 20]}
                    className="w-full mt-auto mb-auto"
                    justify="center"
                >
                    <Card className="page-login-card w-lg">
                        <Flex align="center" justify="center" gap={20}>
                            <Typography.Title level={2} className="mb-0">
                                {isSignUp ? "Sign Up" : "Log in"}
                            </Typography.Title>
                        </Flex>

                        <Flex
                            align="center"
                            justify="center"
                            className="mb-5!"
                            type="flex"
                            gap={20}
                        >
                            <Button
                                className={`btn-main-primary outlined w-100${
                                    isSignUp ? " active" : ""
                                }`}
                                size="large"
                                type={isSignUp ? "primary" : "default"}
                                key={2}
                                style={{ width: "100%" }}
                                onClick={() => setIsSignUp(true)}
                            >
                                Sign Up
                            </Button>
                            <Button
                                className={`btn-main-primary outlined w-100${
                                    !isSignUp ? " active" : ""
                                }`}
                                size="large"
                                type={!isSignUp ? "primary" : "default"}
                                key={1}
                                style={{ width: "100%" }}
                                onClick={() => setIsSignUp(false)}
                            >
                                Login
                            </Button>
                        </Flex>
                        <Button
                            type="default"
                            block
                            shape="round"
                            style={{
                                marginTop: 8,
                                background: "#fff",
                                border: "1px solid #d9d9d9",
                                color: "#444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            icon={
                                <img
                                    src="https://developers.google.com/identity/images/g-logo.png"
                                    alt="Google"
                                    style={{ width: 20, marginRight: 8 }}
                                />
                            }
                            onClick={() => {
                                // handle Google login here
                            }}
                        >
                            Continue with Google
                        </Button>
                        <br />

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

                            {isSignUp && (
                                <Form.Item
                                    name="confirmPassword"
                                    rules={[validateRules.required()]}
                                >
                                    <FloatInputPassword
                                        label="Confirm Password"
                                        autoComplete="new-password"
                                    />
                                </Form.Item>
                            )}

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
                                    // onClick={() => navigate("/visitor")}
                                >
                                    {isSignUp ? "Sign Up" : "Log in"}
                                </Button>
                            </Flex>
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
                        <Flex
                            justify="end"
                            className=""
                            style={{ marginTop: 15 }}
                        >
                            {/* {`© ${date.getFullYear()} ${description}. All Rights
                            Reserved.`} */}
                            {`© ${date.getFullYear()}. All Rights
                            Reserved. CARAGA STATE UNIVERSITY `}
                        </Flex>
                    </Card>
                </Row>
            </Layout.Content>
        </>
    );
}
