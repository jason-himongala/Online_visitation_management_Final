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
    Modal,
} from "antd";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import { UserId } from "../../../../providers/appConfig";
import dayjs from "dayjs";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import FloatTimePicker from "../../../../providers/FloatTimePicker";
import notificationErrors from "../../../../providers/notificationErrors";
import FloatInput from "../../../../providers/FloatInput";
import { useEffect } from "react";

export default function PageVisitationContent(props) {
    const {
        toggleModalVisitationForm,
        setToggleModalVisitationForm,
        userRole,
        tableFilter,
    } = props;
    console.log("toggleModalVisitationForm", toggleModalVisitationForm);
    const { status, id } = props;

    // console.log("statusssss", status);

    const [form] = Form.useForm();

    const canPrintForm =
        toggleModalVisitationForm?.data?.visitation_information?.status?.toLowerCase() ===
        "approved";

    useEffect(() => {}, [toggleModalVisitationForm]);

    const { mutate: mutateVisitorForm, loading: isLoadingChat } = POST(
        `api/visitation_forms`,
        [
            "visitation_forms_submit",
            "user_notifications",
            "user_notifications_list",
        ],
    );
    const handleSubmit = (values) => {
        let data = {
            ...values,
            preferred_date_of_visit: dayjs(
                values.preferred_date_of_visit,
            ).format("YYYY-MM-DD"),
            preferred_time_of_visit: dayjs(
                values.preferred_time_of_visit,
            ).format("HH:mm:ss"),
            alternate_date_of_visit: dayjs(
                values.alternate_date_of_visit,
            ).format("YYYY-MM-DD"),
            alternate_time_of_visit: dayjs(
                values.alternate_time_of_visit,
            ).format("HH:mm:ss"),
            id:
                toggleModalVisitationForm.data &&
                toggleModalVisitationForm.data.id
                    ? toggleModalVisitationForm.data.id
                    : "",
        };

        mutateVisitorForm(data, {
            onSuccess: (res) => {
                if (res.success) {
                    setToggleModalVisitationForm({
                        open: false,
                        data: null,
                    });
                    form.resetFields();
                    notification.success({
                        message: "Visitation Form Completed",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "Visitation Form Completed",
                        description: res.message,
                    });
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
        });
    };

    useEffect(() => {
        if (toggleModalVisitationForm && toggleModalVisitationForm.data) {
            form.setFieldsValue({
                ...toggleModalVisitationForm.data,
                preferred_date_of_visit: dayjs(
                    toggleModalVisitationForm.data.preferred_date_of_visit,
                ),
                preferred_time_of_visit: dayjs(
                    toggleModalVisitationForm.data.preferred_time_of_visit,
                    "HH:mm:ss",
                ),
                alternate_date_of_visit: dayjs(
                    toggleModalVisitationForm.data.alternate_date_of_visit,
                ),
                alternate_time_of_visit: dayjs(
                    toggleModalVisitationForm.data.alternate_time_of_visit,
                    "HH:mm:ss",
                ),
                purpose_of_visit:
                    toggleModalVisitationForm.data.purpose_of_visit,
                selected_faculty_centered_office_organization_to_visit:
                    toggleModalVisitationForm.data
                        .selected_faculty_centered_office_organization_to_visit,
                manner_of_engagement:
                    toggleModalVisitationForm.data.manner_of_engagement,
                name_of_institution_agency:
                    toggleModalVisitationForm.data.name_of_institution_agency,
                topics_for_discussion:
                    toggleModalVisitationForm.data.topics_for_discussion,
                other_information_concern:
                    toggleModalVisitationForm.data.other_information_concern,
                profile_delegates: toggleModalVisitationForm.data
                    .profile_delegate
                    ? toggleModalVisitationForm.data.profile_delegate.map(
                          (delegate) => ({
                              firstname: delegate.firstname,
                              lastname: delegate.lastname,
                              middlename: delegate.middlename,
                              position: delegate.position,
                          }),
                      )
                    : [],
            });
        }
    }, [toggleModalVisitationForm]);
    return (
        <Modal
            title="VISITATION FORM DETAILS"
            open={toggleModalVisitationForm.open}
            onCancel={() => {
                setToggleModalVisitationForm({
                    open: false,
                    data: null,
                });
            }}
            footer={[
                <>
                    <Button
                        size="large"
                        shape="round"
                        key={1}
                        onClick={() => {
                            setToggleModalVisitationForm({
                                open: false,
                                data: null,
                            });
                            form.resetFields();
                        }}
                    >
                        CLOSE
                    </Button>
                    {toggleModalVisitationForm?.data?.visitation_information?.status?.toLowerCase() ===
                        "approved" && (
                        <Button
                            size="large"
                            type="primary"
                            shape="round"
                            key={1}
                            onClick={() => {
                                handleSubmit(form.getFieldsValue());
                            }}
                        >
                            Completed
                        </Button>
                    )}
                </>,
            ]}
        >
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} align="center">
                <Row gutter={[0, 0]}>
                    <Col xs={24} className="mt-2">
                        <Typography.Title
                            level={4}
                            className="!text-blue-600 !mb-2 text-left"
                        >
                            IMPORTANT NOTE!
                        </Typography.Title>

                        <Typography.Paragraph className="text-center leading-relaxed">
                            This Visitation Form must be accomplished before the
                            actual date of the visit.
                            <br />
                            Schedule without prior notice.
                            <br />
                            The Caraga State University will not accommodate
                            visitors before or after the approved
                            <br />
                            Schedule without prior notice.
                        </Typography.Paragraph>
                    </Col>
                </Row>

                <Form form={form} layout="vertical">
                    <Row gutter={[12, 0]}>
                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="!mb-2 !font-bold"
                            >
                                I. GENERAL INFORMATION
                            </Typography.Title>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Preferred Date of Visit"
                                name="preferred_date_of_visit"
                            >
                                <FloatDatePicker format="YYYY-MM-DD" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Preferred Time of Visit"
                                name="preferred_time_of_visit"
                            >
                                <FloatTimePicker
                                    format="h:mm a"
                                    use12Hours
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Alternate Date of Visit"
                                name="alternate_date_of_visit"
                            >
                                <FloatDatePicker format="YYYY-MM-DD" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Alternate Time of Visit"
                                name="alternate_time_of_visit"
                            >
                                <FloatTimePicker
                                    format="h:mm a"
                                    use12Hours
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Purpose of Visit"
                                name="purpose_of_visit"
                            >
                                <FloatInput
                                    placeholder="Purpose of Visit"
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Selected Faculty Centered Office/Organization to Visit"
                                name="selected_faculty_centered_office_organization_to_visit"
                            >
                                <FloatInput
                                    placeholder="Selected Faculty Centered Office Organization to Visit"
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Manner of Engagement (in-person or virtual)"
                                name="manner_of_engagement"
                            >
                                <FloatInput
                                    placeholder="Manner of Engagement (in-person or virtual)"
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* II. VISITOR INFORMATION */}
                    <Row gutter={[0, 0]}>
                        <Col xs={24}>
                            <Typography.Title
                                level={5}
                                className="!mb-2 !font-bold"
                            >
                                II. VISITOR INFORMATION
                            </Typography.Title>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Name of Institution/Agency"
                                name="name_of_institution_agency"
                            >
                                <FloatInput
                                    placeholder="Name of Institution Agency"
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} lg={24} sm={24} md={24} xl={24}>
                            <Form.List name="profile_delegates">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(
                                            ({ key, name, ...restField }) => (
                                                <Row
                                                    gutter={[12, 12]}
                                                    key={key}
                                                    style={{
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={24}
                                                        xl={24}
                                                        className="text-right"
                                                    >
                                                        <Button
                                                            type="link"
                                                            danger
                                                            icon={
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTrashAlt
                                                                    }
                                                                />
                                                            }
                                                            onClick={() =>
                                                                remove(name)
                                                            }
                                                        />
                                                    </Col>

                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="First Name"
                                                            name={[
                                                                name,
                                                                "firstname",
                                                            ]}
                                                        >
                                                            <FloatInput
                                                                placeholder="First Name"
                                                                disabled
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="Last Name"
                                                            name={[
                                                                name,
                                                                "lastname",
                                                            ]}
                                                        >
                                                            <FloatInput
                                                                placeholder="Last Name"
                                                                disabled
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="Middle Name"
                                                            name={[
                                                                name,
                                                                "middlename",
                                                            ]}
                                                        >
                                                            <FloatInput
                                                                placeholder="Middle Name"
                                                                disabled
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            label="Position"
                                                            name={[
                                                                name,
                                                                "position",
                                                            ]}
                                                        >
                                                            <FloatInput
                                                                placeholder="Position"
                                                                disabled
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            ),
                                        )}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                hidden={userRole === "Pico"}
                                                shape="round"
                                                disabled
                                                icon={
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                    />
                                                }
                                            >
                                                Add Delegates
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Topics for Discussion"
                                name="topics_for_discussion"
                            >
                                <FloatInput
                                    placeholder="Topics for Discussion"
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="Other Information/Concerns"
                                name="other_information_concern"
                            >
                                <FloatInput
                                    placeholder="Other Information Concern"
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Modal>
    );
}
