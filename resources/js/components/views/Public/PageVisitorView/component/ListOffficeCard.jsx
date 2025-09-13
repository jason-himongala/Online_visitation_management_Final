import { Avatar, Card, Col, Flex, Row, Statistic } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faClipboardList,
    faHourglassHalf,
    faPesoSign,
} from "@fortawesome/pro-regular-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import Meta from "antd/es/card/Meta";
import { appLogo } from "../../../../providers/appConfig";

export default function ListOffficeCard({ dataCardList }) {
    const deparmentName = ["CCIS", "EDUC", "CMNH", "CBA", "CIT", "CHS"];

    return (
        <Row gutter={[20, 20]}>
            {deparmentName.map((name, idx) => (
                <Col xs={24} sm={24} md={4} lg={5} xl={4} xxl={4} key={idx}>
                    <Card
                        variant="borderless"
                        className="rounded-ss-none"
                        style={{ backgroundColor: "#0d5b10" }}
                    >
                        <div style={{ marginBottom: 12 }}>
                            <img
                                src={appLogo}
                                className="w-40"
                                style={{
                                    height: "80px",
                                    objectFit: "contain",
                                    maxWidth: "200px",
                                    margin: "0 auto",
                                }}
                                alt="Logo"
                            />
                        </div>
                    </Card>
                    <div
                        style={{
                            fontWeight: "bold",

                            fontSize: 16,
                            color: "black",
                            textAlign: "center",
                            minHeight: 40,
                            backgroundColor: "transparent",
                        }}
                    >
                        {name}
                    </div>
                </Col>
            ))}
        </Row>
    );
}
