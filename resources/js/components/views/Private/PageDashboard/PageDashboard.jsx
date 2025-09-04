import { Row, Col } from "antd";
import PageDashBoardContext from "./components/PageDashBoardContext";

export default function PageDashboard() {
    return (
        <PageDashBoardContext.Provider value={{}}>
            <Row gutter={[20, 20]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <h1>Dashboard</h1>
                </Col>
            </Row>
        </PageDashBoardContext.Provider>
    );
}
