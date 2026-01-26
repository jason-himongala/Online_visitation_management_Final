import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, Col, Layout, Row, Typography } from "antd";
import PageMyStatusContent from "./component/PageMyStatusContent";

export default function PageMyStatus() {
    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth);

    return (
        <>
            <Layout style={{ minHeight: "100vh", background: "#e5e5e5" }}>
                <Layout.Content style={{ padding: 24, width: "100%" }}>
                    <Row
                        gutter={[16, 16]}
                        justify="center"
                        align="top"
                        style={{
                            marginTop: "80px",
                        }}
                    >
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Card
                                variant="borderless"
                                className="rounded-ss-none rounded-es-none rounded-se-lg rounded-ee-lg shadow-lg border-green-800"
                                title={
                                    <>
                                        <div className="text-center text-lg font-bold!">
                                            My Status
                                        </div>
                                        <div className="text-center text-xs">
                                            Here are the latest updates for your
                                            visit requests.
                                        </div>
                                    </>
                                }
                                headStyle={{
                                    backgroundColor: "#0d5b10",
                                    borderColor: "#0d5b10",
                                    color: "#fff",
                                }}
                                justify="center"
                            >
                                <PageMyStatusContent />
                            </Card>
                        </Col>
                    </Row>
                </Layout.Content>

                <Layout.Footer
                    style={{
                        textAlign: "center",
                        background: "#0d5b10",
                        color: "#fff",
                    }}
                >
                    © 2025 CSU Visitation System | Developed by Jason
                </Layout.Footer>
            </Layout>
        </>
    );
}
