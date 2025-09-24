import { Row, Col } from "antd";
import ListCard from "./components/ListCard";
import { GET } from "../../../providers/useAxiosQuery";
import Highcharts from "highcharts";
import highchartsSetOptions from "highcharts/modules/exporting";
import { useState } from "react";

export default function PageDashboard() {
    const [dataCardList, setDataCardList] = useState(null);

    GET(`api/dashboard_card_list`, "dashboard_card_list", (res) => {
        if (res) {
            setDataCardList(res);
        }
        false;
    });

    console.log("dataCardList", dataCardList);
    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div>This Month ...</div>
                <ListCard dataCardList={dataCardList} />
            </Col>

            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}></Col>
        </Row>
    );
}
