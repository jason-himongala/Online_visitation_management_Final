import { createContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faPlus,
} from "@fortawesome/pro-regular-svg-icons";
import dayjs from "dayjs";
import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    Flex,
    Row,
    Typography,
} from "antd";

import { GET } from "../../../../providers/useAxiosQuery";
import ModalFormEvent from "./ModalFormEvent";

export const PageEventContextCalendar = createContext();

export default function PageEventContentCalendar() {
    const [toggleModalFormEvent, setToggleModalFormEvent] = useState({
        open: false,
        data: null,
    });

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [activeView, setActiveView] = useState("calendar");

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

    const [events, setEvents] = useState([]);
    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "title",
        sort_order: "asc",
        isTrash: 0,
    });

    const { data: dataSchoolYear } = GET(
        `api/school_year`,
        "school_year_list",
        () => {},
        false
    );

    const { data: dataEventTypes, isLoading: isLoadingEventTypes } = GET(
        `api/events`,
        "event_types",
        () => {},
        false
    );
    const getEventData = (date, events) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        return events.filter((event) => {
            return (
                dayjs(event.datetime_start_format).format("YYYY-MM-DD") ===
                dateStr
            );
        });
    };

    const dateCellRender = (value) => {
        const eventData = getEventData(value, dataEventTypes?.data || []);
        return (
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                {eventData.map((item, index) => (
                    <li key={index}>
                        <Badge status="success" text={item.title} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <PageEventContextCalendar.Provider
            value={{
                toggleModalFormEvent,
                setToggleModalFormEvent,
                dataSchoolYear,
            }}
        >
            <div className="page-event-content-calendar">
                <Row gutter={[20, 20]} justify="center">
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Button
                            type="primary"
                            shape="round"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={() =>
                                setToggleModalFormEvent({
                                    open: true,
                                    data: null,
                                })
                            }
                        >
                            Create Event
                        </Button>
                    </Col>

                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                        <Card title="Filter"></Card>
                    </Col>

                    <Col xs={18} sm={18} md={18} lg={18} xl={18}>
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
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Card
                                    style={{
                                        boxShadow: "none",
                                        height: "100vh",
                                    }}
                                >
                                    <Calendar
                                        value={currentDate}
                                        onChange={setCurrentDate}
                                        cellRender={dateCellRender}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <ModalFormEvent />
            </div>
        </PageEventContextCalendar.Provider>
    );
}
