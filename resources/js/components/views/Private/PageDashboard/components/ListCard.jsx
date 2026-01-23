import {
    Button,
    Card,
    Col,
    Flex,
    Row,
    Statistic,
    Table,
    Typography,
    DatePicker,
    Form,
    message,
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
    TableGlobalSearchAnimated,
    TablePagination,
    TableShowingEntriesV2,
} from "../../../../providers/CustomTableFilter";
import { apiUrl } from "../../../../providers/appConfig";
import { useState } from "react";
import notificationErrors from "../../../../providers/notificationErrors";

const { RangePicker } = DatePicker;

export default function ListCard(props) {
    const {
        dataCardList,
        dataSource,
        statusColors,
        handleDateChange,
        tableFilter,
        setTableFilter,
    } = props;

    console.log("dataSource", dataSource);

    const [form] = Form.useForm();

    const handleProcessExcel = () => {
        form.validateFields()
            .then((values) => {
                const { year_and_month_range } = values;

                if (
                    !year_and_month_range ||
                    year_and_month_range.length !== 2
                ) {
                    message.error("Please select a date range");
                    return;
                }

                const [startDate, endDate] = year_and_month_range;

                const startYear = startDate.year();
                const startMonth = startDate.month() + 1;
                const endYear = endDate.year();
                const endMonth = endDate.month() + 1;

                const url = apiUrl(
                    `api/export_visitation_information?start_year=${startYear}&start_month=${startMonth}&end_year=${endYear}&end_month=${endMonth}`,
                );

                window.open(url, "_blank");
            })
            .catch((error) => {
                console.error("Validation failed:", error);
                message.error("Please select a valid date range");
                // notificationErrors(message);
            });
    };

    const handleRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            if (handleDateChange) {
                handleDateChange(dates);
            }
        }
        setTableFilter((prev) => ({
            ...prev,
            page: 1,
            year_and_month_range: dates
                ? `${dates[0].format("YYYY-MM")},${dates[1].format("YYYY-MM")}`
                : "",
        }));
    };

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
                        <Row gutter={[12, 12]}>
                            <Form form={form}>
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    lg={24}
                                    xl={24}
                                    xxl={24}
                                >
                                    <Form.Item
                                        name="year_and_month_range"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select date range",
                                            },
                                        ]}
                                    >
                                        <RangePicker
                                            picker="month"
                                            onChange={handleRangeChange}
                                            style={{ width: "100%" }}
                                            format="YYYY-MM"
                                            placeholder={[
                                                "Start Month",
                                                "End Month",
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Form>

                            <Col
                                xs={4}
                                sm={4}
                                md={4}
                                lg={4}
                                xl={4}
                                xxl={4}
                                style={{ marginTop: "-1px" }}
                            >
                                <Button
                                    type="primary"
                                    onClick={() => handleProcessExcel()}
                                >
                                    Export to Excel
                                </Button>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Card variant="borderless">
                            <Row gutter={[20, 20]} id="tbl_wrapper">
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    lg={24}
                                    xl={24}
                                    xxl={24}
                                >
                                    <Flex
                                        align="center"
                                        className="tbl-top-filter"
                                        justify="space-between"
                                    >
                                        <Flex gap={15} align="center">
                                            <TableGlobalSearchAnimated
                                                tableFilter={tableFilter}
                                                setTableFilter={setTableFilter}
                                            />
                                        </Flex>

                                        <Flex align="center">
                                            <TableShowingEntriesV2 />
                                            <TablePagination
                                                tableFilter={tableFilter}
                                                setTableFilter={setTableFilter}
                                                total={dataSource?.data.total}
                                                showLessItems={true}
                                                showSizeChanger={false}
                                                tblIdWrapper="tbl_wrapper_deduction"
                                            />
                                        </Flex>
                                    </Flex>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={24}
                                    lg={24}
                                    xl={24}
                                    xxl={24}
                                >
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

                                <Col xs={24} sm={24} md={24}>
                                    <Flex
                                        className="tbl-bottom-filter"
                                        justify="end"
                                        align="center"
                                    >
                                        <TableShowingEntriesV2 />
                                        <TablePagination
                                            tableFilter={tableFilter}
                                            setTableFilter={setTableFilter}
                                            total={dataSource?.data.total}
                                            showLessItems={true}
                                            showSizeChanger={false}
                                            tblIdWrapper="tbl_wrapper"
                                        />
                                    </Flex>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Card>
            </Col>
        </Row>
    );
}
