import { useState } from "react";
import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    Flex,
    Form,
    notification,
    Row,
    Table,
    Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faList,
} from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";
import FloatSelect from "../../../../providers/FloatSelect";
import { useTableScrollOnTop } from "../../../../providers/CustomTableFilter";
import { useLocation } from "react-router-dom";
import ModalVisitorInformationForm from "./ModalVisitorInformationForm";
import ModalApplicationList from "./ModalApplicationList";

export default function PageVisitContent(props) {
    const { width } = props;

    const [
        toggleModalVisitorInformationForm,
        setToggleModalVisitorInformationForm,
    ] = useState({
        open: false,
        data: null,
    });

    const [toggleModalApplicationList, setToggleModalApplicationList] =
        useState({
            open: false,
            data: null,
        });

    const handleOpenModalVisitorInformationForm = () => {
        setToggleModalVisitorInformationForm({ open: true, data: null });
    };

    const [currentDate, setCurrentDate] = useState(dayjs());
    const location = useLocation();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(currentDate.subtract(1, "month"));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(currentDate.add(1, "month"));
    };

    const handleToday = () => {
        setCurrentDate(dayjs());
    };

    const dataSource = [
        {
            key: "1",
            date: "September 8, 2025",
            date_formatted: "2025-09-08",
            office: "CCIS",
            status: "Active",
            department_status: "AVAILABLE",
        },
        {
            key: "2",
            date: "September 1, 2025",
            office: "CCIS",
            date_formatted: "2025-09-01",
            status: "Approved",
            department_status: "NOT AVAILABLE",
        },
    ];

    useTableScrollOnTop("tbl_page_visitor", location);

    const getEventData = (date, dataSource) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        return dataSource.filter((event) => event.date_formatted === dateStr);
    };

    const dateCellRender = (value) => {
        const eventData = getEventData(value, dataSource);
        return (
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                {eventData.map((item, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>
                        <Typography.Text
                            style={{
                                color:
                                    item.department_status === "AVAILABLE"
                                        ? "green"
                                        : "red",
                                fontWeight: "bold",
                            }}
                        >
                            {item.department_status}
                        </Typography.Text>
                    </li>
                ))}
            </ul>
        );
    };

    const handleCalendarSelect = (date) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        const event = dataSource.find(
            (item) => item.date_formatted === dateStr
        );
        if (event && event.department_status === "AVAILABLE") {
            setToggleModalVisitorInformationForm({ open: true, data: event });
        }

        if (event && event.department_status === "NOT AVAILABLE") {
            notification.error({
                message: "This date is not available",
                description: "Please select another date.",
            });
        }
    };

    return (
        <Row gutter={[25, 40]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card>
                    <Form>
                        <Form.Item name="department_id">
                            <FloatSelect
                                placeholder="Select Office"
                                label="Select Office"
                                options={[
                                    { label: "CCIS", value: "CCIS" },
                                    { label: "EDUC", value: "EDUC" },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                <Card>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                            className="mt-4"
                        >
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Typography.Title level={4}>
                                        Application List
                                    </Typography.Title>
                                </div>
                            </Col>
                            <Table
                                dataSource={dataSource}
                                bordered
                                rowKey={(record) => record.key}
                                pagination={false}
                                size="middle"
                            >
                                <Table.Column
                                    title="Date"
                                    dataIndex="date"
                                    key="date"
                                    width={100}
                                />
                                <Table.Column
                                    title="Office"
                                    dataIndex="office"
                                    key="office"
                                    width={100}
                                />
                                <Table.Column
                                    title="Details"
                                    dataIndex="details"
                                    key="details"
                                    width={0}
                                    render={(text) => (
                                        <span>
                                            <Typography.Text
                                                ellipsis
                                                style={{ flex: 1 }}
                                            >
                                                {text}
                                            </Typography.Text>
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={
                                                    <FontAwesomeIcon
                                                        icon={faList}
                                                    />
                                                }
                                                onClick={() => {
                                                    setToggleModalApplicationList(
                                                        {
                                                            open: true,
                                                            data: text,
                                                        }
                                                    );
                                                }}
                                            />
                                        </span>
                                    )}
                                />
                                <Table.Column
                                    title="Status"
                                    dataIndex="status"
                                    key="status"
                                    width={100}
                                    render={(text) => (
                                        <Typography.Text
                                            style={{
                                                color:
                                                    text === "Active"
                                                        ? "green"
                                                        : "red",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {text}
                                        </Typography.Text>
                                    )}
                                />
                            </Table>{" "}
                        </Col>
                    </Row>
                </Card>
            </Col>

            <Col xs={15} sm={15} md={15} lg={15} xl={15}>
                <Card>
                    <Row gutter={20} className="w-full">
                        <Col xs={24} sm={18} md={18} lg={24}>
                            <Flex
                                justify="start"
                                align="center"
                                className="mb-4 gap-4"
                            >
                                <Button
                                    onClick={handleToday}
                                    className="px-5 py-2 border border-green-700 text-green-700 rounded-full flex items-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        onClick={handlePrevMonth}
                                        className="mr-2 cursor-pointer"
                                    />
                                    Today
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        onClick={handleNextMonth}
                                        className="ml-2 cursor-pointer"
                                    />
                                </Button>

                                <Typography.Title
                                    level={3}
                                    className="m-0 text-center flex-1 font-bold"
                                >
                                    {currentDate.format("MMMM YYYY")}
                                </Typography.Title>
                            </Flex>
                        </Col>

                        <Col xs={16} sm={16} md={16} lg={16} xl={16}>
                            <Card>
                                <Calendar
                                    value={currentDate}
                                    fullscreen
                                    onChange={setCurrentDate}
                                    cellRender={dateCellRender}
                                    height={300}
                                    onSelect={handleCalendarSelect}
                                />
                            </Card>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                            <Card
                                id="tbl_page_visitor"
                                style={{
                                    height: 300,
                                    overflowY: "auto",
                                    backgroundColor: "#0d5b10",
                                }}
                            >
                                <Typography.Title level={4}>
                                    Application List
                                </Typography.Title>
                                <Table
                                    dataSource={dataSource}
                                    bordered
                                    rowKey={(record) => record.key}
                                    pagination={false}
                                    size="middle"
                                >
                                    <Table.Column
                                        title="Date"
                                        dataIndex="date"
                                        key="date"
                                        width={100}
                                    />
                                    <Table.Column
                                        title="Office"
                                        dataIndex="office"
                                        key="office"
                                        width={100}
                                    />
                                </Table>{" "}
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>

            <ModalVisitorInformationForm
                toggleModalVisitorInformationForm={
                    toggleModalVisitorInformationForm
                }
                setToggleModalVisitorInformationForm={
                    setToggleModalVisitorInformationForm
                }
            />

            <ModalApplicationList
                toggleModalApplicationList={toggleModalApplicationList}
                setToggleModalApplicationList={setToggleModalApplicationList}
            />
        </Row>
    );
}
