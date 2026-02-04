import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/pro-regular-svg-icons";
import {
    Card,
    Col,
    Row,
    Typography,
    Form,
    Button,
    notification,
    Table,
    Flex,
} from "antd";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import { UserId } from "../../../../providers/appConfig";
import dayjs from "dayjs";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import FloatTimePicker from "../../../../providers/FloatTimePicker";
import notificationErrors from "../../../../providers/notificationErrors";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import {
    TableGlobalSearchAnimated,
    TablePageSize,
    TablePagination,
    TableShowingEntriesV2,
} from "../../../../providers/CustomTableFilter";

export default function PageVisitiontable(props) {
    const { status, id } = props;
    // console.log("statusssss", status);

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { data: departments } = GET(
        `api/departments`,
        "department_list",
        () => {},
        false,
    );
    const { mutate: mutateVisitorForm, loading: isLoadingChat } = POST(
        `api/visitation_forms`,
        [
            "visitation_forms_submit",
            "user_notifications",
            "user_notifications_list",
        ],
    );

    const onFinish = (values) => {
        console.log("values", values);

        let data = new FormData();
        let userId = UserId();

        data.append("remarks", "Submitted");

        Object.keys(values).forEach((key) => {
            let value = values[key];

            data.append("user_id", userId);
            data.append("remarks", "Submitted");
            data.append("visitation_information_id", id);
            if (
                key === "preferred_date_of_visit" ||
                key === "alternate_date_of_visit"
            ) {
                value = value ? dayjs(value).format("YYYY-MM-DD") : "";
            } else if (
                key === "preferred_time_of_visit" ||
                key === "alternate_time_of_visit"
            ) {
                value = value ? dayjs(value).format("HH:mm:ss") : "";
            } else if (key === "profile_delegates") {
                value = value ? JSON.stringify(value) : "";
            }

            data.append(key, value);
        });

        mutateVisitorForm(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Visitation Form",
                        description: res.message,
                    });

                    navigate(-1);
                } else {
                    notification.error({
                        message: "Visitation Form",
                        description: res.message,
                    });
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
        });
    };

    return (
        <Col
            xs={24}
            md={16}
            lg={12}
            xl={10}
            xxl={8}
            align="center"
            style={{
                marginTop: "80px",
            }}
        >
            <Card
                className="rounded-ss-none rounded-es-none rounded-se-lg rounded-ee-lg shadow-lg border-green-800"
                variant="borderless"
                headStyle={{
                    backgroundColor: "#0d5b10",
                    borderColor: "#0d5b10",
                    color: "#fff",
                }}
                justify="center"
            >
                <Row gutter={[12, 12]}>
                    {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<Button
						type="primary"
						shape="round"
						size="large"
						className="btn-main-primary min-w-35"
						icon={<FontAwesomeIcon icon={faPlus} />}
						onClick={() => {
							setToggleModalDm({
								open: true,
								data: null,
							});
							form.resetFields();
						}}
					>
						Create
					</Button>
				</Col> */}

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Card>
                            <Row gutter={[10, 10]}>
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
                                                total={
                                                    dataSources &&
                                                    dataSources.total
                                                }
                                                showLessItems={true}
                                                showSizeChanger={false}
                                                tblIdWrapper="tbl_wrapper"
                                            />
                                        </Flex>
                                    </Flex>
                                </Col>

                                <Col xs={24} sm={24} md={24}>
                                    <Table
                                        id="tbl_scholarship_ids"
                                        dataSource={
                                            dataSources && dataSources.data
                                        }
                                        rowKey={(record) => record.id}
                                        pagination={false}
                                        bordered
                                        // rowSelection={{
                                        // 	selectedRowKeys,
                                        // 	onChange: (newSelectedRowKeys) => {
                                        // 		setSelectedRowKeys(newSelectedRowKeys);
                                        // 	},
                                        // }}
                                        scroll={{ x: "max-content" }}
                                        sticky
                                        onChange={onChangetable}
                                    >
                                        <Table.Column
                                            title="Date"
                                            key="reconciliation_date"
                                            dataIndex="reconciliation_date"
                                            width={300}
                                        />
                                        <Table.Column
                                            title="Amount"
                                            key="old_amount"
                                            dataIndex="old_amount"
                                        />
                                        <Table.Column
                                            title="Adjust Amount"
                                            key="adjust_amount"
                                            dataIndex="adjust_amount"
                                        />
                                        <Table.Column
                                            title="Remarks / Reason"
                                            key="reconciliation_description"
                                            dataIndex="reconciliation_description"
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
                                            total={
                                                dataSources && dataSources.total
                                            }
                                            showLessItems={true}
                                            showSizeChanger={false}
                                            tblIdWrapper="tbl_wrapper"
                                        />
                                    </Flex>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Col>
    );
}
