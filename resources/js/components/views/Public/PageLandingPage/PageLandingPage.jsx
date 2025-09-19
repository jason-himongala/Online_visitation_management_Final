import { useNavigate } from "react-router-dom";
import { Button, Col, Flex, Layout, Typography, Row } from "antd";

import { appLogo } from "../../../providers/appConfig";

export default function PageLandingPage() {
    const navigate = useNavigate();
    return (
        <Layout className="!min-h-screen">
            <Layout.Header className="!bg-white !shadow-md !h-20 !px-6">
                <Flex
                    justify="space-between"
                    align="center"
                    className="!h-full"
                >
                    <Flex align="center">
                        <img
                            src={appLogo}
                            alt="logo"
                            className="!max-w-[60px] !mr-3"
                        />
                        <Typography.Title
                            level={4}
                            className="!m-0 !text-[#0d5b10] !leading-tight !text-center"
                        >
                            CSU
                            <br />
                            Visitation System
                        </Typography.Title>
                    </Flex>

                    <Flex align="center" gap={12}>
                        <Button
                            type="primary"
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </Button>
                        <Button
                            type="default"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    </Flex>
                </Flex>
            </Layout.Header>

            <Layout.Content className="!px-6 !py-12 !min-h-[calc(100vh-160px)] !flex !items-center !justify-center">
                <Row gutter={[32, 32]} align="middle" className="!w-full">
                    <Col xs={24} md={12}>
                        <Typography.Title
                            level={2}
                            className="!mb-4 !font-semibold !leading-snug"
                        >
                            <span className="!text-black">Manage </span>
                            <span className="!text-[#0d5b10]">Visitation </span>
                            <span className="!text-black">Request </span>
                            <span className="!text-[#0d5b10]">Easily</span>
                        </Typography.Title>

                        <Typography.Paragraph className="!text-base !text-gray-600 !mb-6">
                            Stream the visitation process with our user-friendly
                            application.
                        </Typography.Paragraph>

                        <Button
                            type="primary"
                            size="large"
                            className="!bg-[#0d5b10] !border-none"
                            onClick={() => navigate("/login")}
                        >
                            Get Started
                        </Button>
                    </Col>

                    <Col xs={24} md={12}>
                        <img
                            src="/images/csu_bg.png"
                            alt="CSU Building"
                            className="!w-full !rounded-lg !shadow-lg"
                        />
                    </Col>
                </Row>
            </Layout.Content>

            <Layout.Footer className="!text-center !bg-[#0d5b10] !text-white">
                <Typography.Text className="!text-white">
                    © 2025 CSU Visitation System | Developed by Jason
                </Typography.Text>
            </Layout.Footer>
        </Layout>
    );
}
