// import { Card, Col, Flex, Row, Statistic } from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faCheckCircle,
//     faClipboardList,
//     faHourglassHalf,
//     faPesoSign,
// } from "@fortawesome/pro-regular-svg-icons";
// import { fal } from "@fortawesome/pro-light-svg-icons";

// export default function ListCard({ dataCardList }) {
//     return (
//         <Row gutter={[20, 20]}>
//             <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
//                 <Card variant="borderless">
//                     <Statistic
//                         title="Total Requests"
//                         value={Object.values(dataCardList?.data ?? {})
//                             .filter((val) => typeof val === "number")
//                             .reduce((acc, val) => acc + val, 0)}
//                         valueStyle={{ color: "#4097ff" }}
//                         prefix={<FontAwesomeIcon icon={faClipboardList} />}
//                     />
//                 </Card>
//             </Col>

//             <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
//                 <Card variant="borderless">
//                     <Statistic
//                         title="Pending Requests"
//                         value={dataCardList?.data.pending ?? 0}
//                         // precision={2}
//                         valueStyle={{ color: "#cf1322" }}
//                         prefix={<FontAwesomeIcon icon={faHourglassHalf} />}
//                     />
//                 </Card>
//             </Col>
//             <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
//                 <Card variant="borderless">
//                     <Statistic
//                         title="Approve Today"
//                         value={dataCardList?.data.approved_today ?? 0}
//                         valueStyle={{ color: "#3f8600" }}
//                         prefix={<FontAwesomeIcon icon={faCheckCircle} />}
//                     />
//                 </Card>
//             </Col>

//             <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
//                 <Card variant="borderless">
//                     <Statistic
//                         title="Recent Activity"
//                         value="No recent activity"
//                         valueStyle={{ color: "#3f8600" }}
//                     />
//                 </Card>
//             </Col>
//         </Row>
//     );
// }

import {
    Button,
    Card,
    Col,
    Flex,
    Row,
    Statistic,
    Table,
    Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faClipboardList,
    faHourglassHalf,
    faMessageXmark,
    faPesoSign,
    faTrash,
    faXmarkCircle,
} from "@fortawesome/pro-regular-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import {
    TablePagination,
    TableShowingEntriesV2,
} from "../../../../providers/CustomTableFilter";

export default function ListCard(props) {
    const { dataCardList, dataSource, statusColors } = props;

    console.log("dataSource", dataSource);
    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                <Card variant="borderless">
                    <Statistic
                        title="Pending Requests"
                        value={dataCardList?.data?.pending ?? 0}
                        valueStyle={{ color: "#4097ff" }}
                        prefix={<FontAwesomeIcon icon={faHourglassHalf} />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                <Card variant="borderless">
                    <Statistic
                        title="Approve Today"
                        value={dataCardList?.data?.approved_today ?? 0}
                        valueStyle={{ color: "#3f8600" }}
                        prefix={<FontAwesomeIcon icon={faCheckCircle} />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}>
                <Card variant="borderless">
                    <Statistic
                        title="Declined Requests"
                        value={dataCardList?.data?.declined ?? 0}
                        // precision={2}
                        valueStyle={{ color: "#cf1322" }}
                        prefix={<FontAwesomeIcon icon={faXmarkCircle} />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Card variant="borderless">
                    <Typography
                        level={2}
                        title="Recent Activity"
                        style={{
                            fontSize: 50,
                            fontWeight: "600",
                            marginBottom: 16,
                            color: "#3f8600",
                        }}
                    >
                        Recent Activity
                    </Typography>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Card variant="borderless">
                            <Row gutter={[20, 20]} id="tbl_wrapper">
                                <Col xs={24}>
                                    <Table
                                        id="tbl_profiles"
                                        dataSource={
                                            dataSource?.data?.data || []
                                        }
                                        rowKey={(record) => record.id}
                                        pagination={false}
                                        bordered
                                        scroll={{ x: "max-content" }}
                                        sticky
                                    >
                                        <Table.Column
                                            title="Visitors"
                                            key="email"
                                            dataIndex="email"
                                            width={180}
                                            render={(_, record) =>
                                                record.profile
                                                    ? `${
                                                          record.profile
                                                              .firstname
                                                      } ${
                                                          record.profile
                                                              .lastname ?? ""
                                                      }`
                                                    : " "
                                            }
                                        />
                                        <Table.Column
                                            title="Department"
                                            key="department_name"
                                            dataIndex="department_name"
                                            width={180}
                                            render={(_, record) =>
                                                record.appointment_schedule
                                                    ?.department
                                                    ? record
                                                          .appointment_schedule
                                                          .department
                                                          .department_name
                                                    : ""
                                            }
                                        />

                                        <Table.Column
                                            title="Date&Time"
                                            key="available_time"
                                            dataIndex="available_time"
                                            width={200}
                                        />

                                        <Table.Column
                                            title="Purpose of Visit"
                                            key="purpose_of_visit"
                                            dataIndex="purpose_of_visit"
                                            width={150}
                                        />
                                        <Table.Column
                                            title="Remarks"
                                            key="remarks"
                                            dataIndex="remarks"
                                            width={150}
                                        />

                                        <Table.Column
                                            title="Status"
                                            key="status"
                                            dataIndex="status"
                                            width={90}
                                            render={(status) => (
                                                <span
                                                    style={{
                                                        color:
                                                            statusColors[
                                                                status?.toLowerCase()
                                                            ] || "#595959",
                                                        fontWeight: 600,
                                                        textTransform:
                                                            "uppercase",
                                                    }}
                                                >
                                                    {status}
                                                </span>
                                            )}
                                        />
                                    </Table>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Card>
            </Col>
        </Row>
    );
}
