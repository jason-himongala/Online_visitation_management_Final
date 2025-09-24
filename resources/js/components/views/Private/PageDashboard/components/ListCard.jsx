import { Card, Col, Flex, Row, Statistic } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faClipboardList,
    faHourglassHalf,
    faPesoSign,
} from "@fortawesome/pro-regular-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";

export default function ListCard({ dataCardList }) {
    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                <Card variant="borderless">
                    <Statistic
                        title="Total Requests"
                        value={Object.values(dataCardList?.data ?? {})
                            .filter((val) => typeof val === "number")
                            .reduce((acc, val) => acc + val, 0)}
                        valueStyle={{ color: "#4097ff" }}
                        prefix={<FontAwesomeIcon icon={faClipboardList} />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                <Card variant="borderless">
                    <Statistic
                        title="Pending Requests"
                        value={dataCardList?.data.pending ?? 0}
                        // precision={2}
                        valueStyle={{ color: "#cf1322" }}
                        prefix={<FontAwesomeIcon icon={faHourglassHalf} />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                <Card variant="borderless">
                    <Statistic
                        title="Approve Today"
                        value={dataCardList?.data.approved_today ?? 0}
                        valueStyle={{ color: "#3f8600" }}
                        prefix={<FontAwesomeIcon icon={faCheckCircle} />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Card variant="borderless">
                    <Statistic
                        title="Recent Activity"
                        value="No recent activity"
                        valueStyle={{ color: "#3f8600" }}
                    />
                </Card>
            </Col>
        </Row>
    );
}
