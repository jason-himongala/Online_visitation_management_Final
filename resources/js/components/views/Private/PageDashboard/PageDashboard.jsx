import { Row, Col } from "antd";
import ListCard from "./components/ListCard";

export default function PageDashboard() {
    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div>This Month ...</div>
                <ListCard />
            </Col>

            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}></Col>
        </Row>
    );
}
