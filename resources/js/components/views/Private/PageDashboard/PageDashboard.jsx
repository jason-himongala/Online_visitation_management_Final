import { Row, Col } from "antd";
import ListCard from "./components/ListCard";
import { GET } from "../../../providers/useAxiosQuery";
import Highcharts from "highcharts";
import highchartsSetOptions from "highcharts/modules/exporting";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { role, UserId } from "../../../providers/appConfig";

export default function PageDashboard() {
    const [dataCardList, setDataCardList] = useState(null);

    GET(`api/dashboard_card_list`, "dashboard_card_list", (res) => {
        if (res) {
            setDataCardList(res);
        }
        false;
    });

    const navigate = useNavigate();
    const location = useLocation();
    const userRole = role();
    const UserIds = UserId();

    const [tableFilter, setTableFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "created_at",
        sort_order: "desc",
        year_and_month_range: "",
    });

    const { data: dataSource, refetch: refetchSource } = GET(
        `api/visitation_information?${new URLSearchParams(tableFilter)}`,
        "visitation_information_submit",
    );

    useEffect(() => {
        refetchSource();
    }, [tableFilter, refetchSource]);

    const { data: dataUser } = GET(
        `api/users?id=${UserIds}`,
        "user_detail",
        () => {},
        false,
    );

    const statusColors = {
        pending: "#faad14", // Orange/Yellow for pending
        approved: "#52c41a", // Green for approved
        declined: "#ff4d4f", // Red for declined
    };

    const currentUser =
        dataUser?.data?.[0] ||
        dataUser?.data?.find((user) => user.id === UserIds);

    const filteredDataSource = useMemo(() => {
        if (!dataSource?.data?.data) return dataSource;

        if (userRole === "PICO" || userRole === "OP") {
            return dataSource;
        }

        if (userRole === "Department" && currentUser?.department_id) {
            const filteredData = dataSource.data.data.filter(
                (item) =>
                    item.appointment_schedule?.department_id ===
                    currentUser.department_id,
            );

            return {
                ...dataSource,
                data: {
                    ...dataSource.data,
                    data: filteredData,
                    total: filteredData.length,
                    per_page: dataSource.data.per_page,
                    current_page: dataSource.data.current_page,
                    last_page: Math.ceil(
                        filteredData.length / dataSource.data.per_page,
                    ),
                },
            };
        }

        return dataSource;
    }, [dataSource, userRole, currentUser?.department_id]);

    const filteredDataCardList = useMemo(() => {
        if (!dataCardList?.data) return dataCardList;

        if (userRole === "PICO" || userRole === "OP") {
            return dataCardList;
        }

        if (userRole === "Department" && currentUser?.department_id) {
            const departmentData =
                dataCardList.data.dataUser?.filter(
                    (item) =>
                        item.appointment_schedule?.department_id ===
                        currentUser.department_id,
                ) || [];

            const recalculatedCounts = {
                approved_today: departmentData.filter(
                    (item) =>
                        item.status === "approved" &&
                        new Date(item.updated_at).toDateString() ===
                            new Date().toDateString(),
                ).length,
                pending: departmentData.filter(
                    (item) =>
                        item.status === "pending" || item.status === "Pending",
                ).length,
                declined: departmentData.filter(
                    (item) => item.status === "declined",
                ).length,
                request: {
                    declined: departmentData.filter(
                        (item) => item.status === "declined",
                    ).length,
                    approved: departmentData.filter(
                        (item) => item.status === "approved",
                    ).length,
                },
                dataUser: departmentData,
            };

            return {
                ...dataCardList,
                data: {
                    ...dataCardList.data,
                    ...recalculatedCounts,
                },
            };
        }

        return dataCardList;
    }, [dataCardList, userRole, currentUser?.department_id]);

    console.log("filteredDataCardList", filteredDataCardList);
    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div>This Month ...</div>
                <ListCard
                    dataCardList={filteredDataCardList}
                    dataSource={filteredDataSource}
                    tableFilter={tableFilter}
                    setTableFilter={setTableFilter}
                    userRole={userRole}
                    statusColors={statusColors}
                />
            </Col>

            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}></Col>
        </Row>
    );
}
