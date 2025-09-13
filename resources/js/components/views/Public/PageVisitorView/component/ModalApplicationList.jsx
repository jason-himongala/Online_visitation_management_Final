import { Button, Flex, Modal, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolder,
    faPen,
    faTrash,
    faXmark,
} from "@fortawesome/pro-regular-svg-icons";

export default function ModalApplicationList(props) {
    const { toggleModalApplicationList, setToggleModalApplicationList } = props;

    const dataSource = [
        {
            key: "1",
            period: "AM",
            visited: "Not Yet",
            office: "CCIS",
            status: "Active",
            department_status: "AVAILABLE",
        },
        {
            key: "2",
            period: "AM",
            visited: "Not Yet",
            office: "CCIS",
            date_formatted: "2025-09-01",
            status: "",
            department_status: "NOT AVAILABLE",
        },
    ];

    return (
        <Modal
            title="Details"
            closeIcon={<FontAwesomeIcon icon={faXmark} />}
            open={toggleModalApplicationList.open}
            onCancel={() => {
                setToggleModalApplicationList({
                    open: false,
                    data: null,
                });
            }}
            forceRender
            footer={[
                <Button
                    shape="round"
                    type="primary"
                    onClick={() => {
                        setToggleModalApplicationList({
                            open: false,
                            data: null,
                        });
                    }}
                    key={1}
                >
                    CLOSE
                </Button>,
            ]}
        >
            <Table
                dataSource={dataSource}
                pagination={false}
                rowKey="id"
                scroll={{ y: 240 }}
            >
                <Table.Column
                    title="Action"
                    dataIndex="field"
                    key="field"
                    render={(_, record) => {
                        return (
                            <Flex direction="vertical">
                                <Button
                                    icon={
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            style={{ color: "green" }}
                                        />
                                    }
                                    type="link"
                                    name="bnt_preview"
                                    title="Preview SF9"
                                ></Button>
                                <Button
                                    icon={
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{ color: "red" }}
                                        />
                                    }
                                    type="link"
                                    name="bnt_delete"
                                    title="delete"
                                ></Button>
                            </Flex>
                        );
                    }}
                />
                <Table.Column
                    title="Office Name"
                    dataIndex="office"
                    key="office"
                />
                <Table.Column title="Period" dataIndex="period" key="period" />
                <Table.Column
                    title="Visited"
                    dataIndex="visited"
                    key="visited"
                />
            </Table>
        </Modal>
    );
}
