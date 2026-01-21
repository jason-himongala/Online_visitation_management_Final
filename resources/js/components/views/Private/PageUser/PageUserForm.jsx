import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Form, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faArrowLeft,
    faCamera,
} from "@fortawesome/pro-regular-svg-icons";
import { debounce } from "lodash";

import { GET, POST } from "../../../providers/useAxiosQuery";
import { apiUrl, defaultProfile } from "../../../providers/appConfig";
import Collapse from "../../../providers/Collapse";

import FloatInput from "../../../providers/FloatInput";
import FloatSelect from "../../../providers/FloatSelect";
import FloatInputPassword from "../../../providers/FloatInputPassword";
import ModalFormEmail from "./components/ModalFormEmail";
import ModalFormPassword from "./components/ModalFormPassword";
import validateRules from "../../../providers/validateRules";
import notificationErrors from "../../../providers/notificationErrors";
import optionGender from "../../../providers/optionGender";
import ModalUploadProfilePicture from "./components/ModalUploadProfilePicture";

export default function PageUserForm() {
    const navigate = useNavigate();
    const params = useParams();

    const [form] = Form.useForm();
    const [formDisabled, setFormDisabled] = useState(true);
    const [userData, setUserData] = useState({});
    const [toggleModalFormEmail, setToggleModalFormEmail] = useState({
        open: false,
        data: null,
    });
    const [toggleModalFormPassword, setToggleModalFormPassword] = useState({
        open: false,
        data: null,
    });
    const [
        toggleModalUploadProfilePicture,
        setToggleModalUploadProfilePicture,
    ] = useState({
        open: false,
        file: null,
        src: null,
        is_camera: null,
        fileName: null,
    });

    const { data: dataDepartment } = GET(
        `api/departments`,
        "departments_list",
        () => {},
        false,
    );

    // Fetch user data
    GET(
        `api/users/${params.id}`,
        ["users_info", "check_user_permission"],
        (res) => {
            if (res.data) {
                let data = res.data;

                let user_role_id = data.user_role_id;
                let department_id = data.department_id;
                let username = data.username;
                let email = data.email;
                let firstname = data.profile?.firstname;
                let lastname = data.profile?.lastname;

                if (
                    data.profile &&
                    data.profile.attachments &&
                    data.profile.attachments.length > 0
                ) {
                    let profileAttachments = data.profile.attachments.filter(
                        (f) => f.file_description === "Profile Picture",
                    );

                    if (profileAttachments.length > 0) {
                        setToggleModalUploadProfilePicture({
                            open: false,
                            file: null,
                            src: apiUrl(profileAttachments[0].file_path),
                            is_camera: null,
                            fileName: null,
                        });
                    }
                }

                form.setFieldsValue({
                    user_role_id,
                    username,
                    email,
                    firstname,
                    lastname,
                    department_id,
                });

                setUserData({
                    user_role_id,
                    username,
                    email,
                    firstname,
                    lastname,
                    department_id,
                });
            }
        },
    );

    const { data: dataRole } = GET(
        "api/user_role",
        "user_role_select",
        () => {},
        false,
    );

    console.log("dataRole", dataRole);

    const { mutate: mutateUser, isLoading: isLoadingUser } = POST(
        `api/users`,
        "users_info",
    );

    const onFinish = (values) => {
        const data = new FormData();
        data.append("id", params.id || "");
        data.append("user_role_id", values.user_role_id);
        data.append("username", values.username);

        data.append("email", values.email);
        if (!params.id) {
            data.append("password", values.password);
        }
        data.append("firstname", values.firstname);
        data.append("lastname", values.lastname);
        data.append("gender", values.gender);
        data.append("department_id", values.department_id || "");

        if (!params.id && toggleModalUploadProfilePicture.file) {
            data.append(
                "profile_picture",
                toggleModalUploadProfilePicture.file,
                toggleModalUploadProfilePicture.fileName,
            );
        }

        mutateUser(data, {
            onSuccess: (res) => {
                notification[res.success ? "success" : "error"]({
                    message: "User Profile",
                    description: res.message,
                });
                if (res.success && !params.id) {
                    navigate("/user-profile");
                }
            },
            onError: notificationErrors,
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => setFormDisabled(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    const handleTriggerDebounce = debounce((field, value) => {
        let oldValue = userData[field];
        if (field === "contact_number") {
            if (!oldValue) {
                oldValue = "";
            }
            if (value) {
                value = value.split("_").join("");
                value = value.split(" ").join("");

                if (oldValue !== value) {
                    form.submit();
                }
            } else {
                if (oldValue !== value) {
                    form.submit();
                }
            }
        } else {
            if (oldValue !== value) {
                form.submit();
            }
        }
    }, 1000);

    const handleDebounce = useCallback(
        (field, value) => {
            if (params.id) {
                handleTriggerDebounce(field, value);
            }
        },
        [handleTriggerDebounce],
    );
    return (
        <Row gutter={[12, 12]}>
            <Col span={24}>
                <Button
                    type="default"
                    icon={<FontAwesomeIcon icon={faArrowLeft} />}
                    onClick={() => navigate(-1)}
                    shape="round"
                >
                    Back to list
                </Button>
            </Col>
            <Col span={24}>
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={[12, 12]}>
                        <Col lg={14}>
                            <Collapse
                                className="collapse-main-primary"
                                defaultActiveKey={["0", "1"]}
                                expandIcon={({ isActive }) => (
                                    <FontAwesomeIcon
                                        icon={
                                            isActive ? faAngleUp : faAngleDown
                                        }
                                    />
                                )}
                                items={[
                                    {
                                        key: "0",
                                        label: "ACCOUNT INFORMATION",
                                        children: (
                                            <Row gutter={[20, 0]}>
                                                <Col lg={12}>
                                                    <Form.Item
                                                        name="user_role_id"
                                                        rules={[
                                                            validateRules.required(),
                                                        ]}
                                                    >
                                                        <FloatSelect
                                                            label="Role"
                                                            placeholder="Role"
                                                            options={dataRole?.data?.map(
                                                                (item) => ({
                                                                    value: item.id,
                                                                    label: item.role,
                                                                }),
                                                            )}
                                                            disabled={
                                                                formDisabled
                                                            }
                                                            required
                                                            onChange={(e) => {
                                                                handleDebounce(
                                                                    "user_role_id",
                                                                    e,
                                                                );
                                                                form.setFieldValue(
                                                                    "department_id",
                                                                    undefined,
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col lg={12}>
                                                    <Form.Item
                                                        shouldUpdate={(
                                                            prev,
                                                            cur,
                                                        ) =>
                                                            prev.user_role_id !==
                                                            cur.user_role_id
                                                        }
                                                    >
                                                        {({ getFieldValue }) =>
                                                            getFieldValue(
                                                                "user_role_id",
                                                            ) === 2 && (
                                                                <Form.Item
                                                                    name="department_id"
                                                                    rules={[
                                                                        validateRules.required(),
                                                                    ]}
                                                                >
                                                                    <FloatSelect
                                                                        label="Department"
                                                                        placeholder="Department"
                                                                        options={
                                                                            dataDepartment?.data
                                                                                ? dataDepartment.data.map(
                                                                                      (
                                                                                          item,
                                                                                      ) => ({
                                                                                          value: item.id,
                                                                                          label: item.department_name,
                                                                                      }),
                                                                                  )
                                                                                : []
                                                                        }
                                                                        disabled={
                                                                            formDisabled
                                                                        }
                                                                        required
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            handleDebounce(
                                                                                "department_id",
                                                                                e,
                                                                            );
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            )
                                                        }
                                                    </Form.Item>
                                                </Col>

                                                <Col lg={12}>
                                                    <Form.Item
                                                        name="username"
                                                        rules={[
                                                            validateRules.required(),
                                                        ]}
                                                    >
                                                        <FloatInput
                                                            required
                                                            label="Username"
                                                            placeholder="Username"
                                                            disabled={
                                                                !!params.id ||
                                                                formDisabled
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={12}>
                                                    <Form.Item
                                                        name="email"
                                                        rules={[
                                                            validateRules.required(),
                                                            validateRules.email,
                                                        ]}
                                                    >
                                                        <FloatInput
                                                            label="Email"
                                                            placeholder="Email"
                                                            disabled={
                                                                !!params.id ||
                                                                formDisabled
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                {!params.id && (
                                                    <Col lg={12}>
                                                        <Form.Item
                                                            name="password"
                                                            rules={[
                                                                validateRules.required(),
                                                                validateRules.password,
                                                            ]}
                                                        >
                                                            <FloatInputPassword
                                                                label="Password"
                                                                placeholder="Password"
                                                                autoComplete="new-password"
                                                                disabled={
                                                                    formDisabled
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                )}

                                                {params.id ? (
                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={24}
                                                    >
                                                        <a
                                                            type="link"
                                                            className="color-1"
                                                            onClick={() =>
                                                                setToggleModalFormEmail(
                                                                    {
                                                                        open: true,
                                                                        data: {
                                                                            id: params.id,
                                                                        },
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            Change Email
                                                        </a>
                                                    </Col>
                                                ) : null}

                                                {params.id ? (
                                                    <Col
                                                        xs={24}
                                                        sm={24}
                                                        md={24}
                                                        lg={12}
                                                        xl={12}
                                                        xxl={12}
                                                    >
                                                        <a
                                                            type="link"
                                                            className="color-1"
                                                            onClick={() =>
                                                                setToggleModalFormPassword(
                                                                    {
                                                                        open: true,
                                                                        data: {
                                                                            id: params.id,
                                                                        },
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            Change Password
                                                        </a>
                                                    </Col>
                                                ) : null}
                                            </Row>
                                        ),
                                    },
                                    {
                                        key: "1",
                                        label: "INFORMATION",
                                        children: (
                                            <Row gutter={[24, 0]}>
                                                <Col lg={12}>
                                                    <Form.Item
                                                        name="firstname"
                                                        rules={[
                                                            validateRules.required(),
                                                        ]}
                                                    >
                                                        <FloatInput
                                                            label="First Name"
                                                            placeholder="First Name"
                                                            disabled={
                                                                formDisabled
                                                            }
                                                            onChange={(e) => {
                                                                handleDebounce(
                                                                    "firstname",
                                                                    e.target
                                                                        .value,
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={12}>
                                                    <Form.Item
                                                        name="lastname"
                                                        rules={[
                                                            validateRules.required(),
                                                        ]}
                                                    >
                                                        <FloatInput
                                                            label="Last Name"
                                                            placeholder="Last Name"
                                                            disabled={
                                                                formDisabled
                                                            }
                                                            onChange={(e) => {
                                                                handleDebounce(
                                                                    "lastname",
                                                                    e.target
                                                                        .value,
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col lg={12}>
                                                    <Form.Item name="middlename">
                                                        <FloatInput
                                                            label="Middle Name"
                                                            placeholder="Middle Name"
                                                            disabled={
                                                                formDisabled
                                                            }
                                                            onChange={(e) => {
                                                                handleDebounce(
                                                                    "middlename",
                                                                    e,
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ),
                                    },
                                ]}
                            />
                        </Col>
                        <Col lg={10}>
                            <Collapse
                                items={[
                                    {
                                        key: "0",
                                        label: "Profile Picture",
                                        className:
                                            "collapse-item-profile-picture",
                                        children: (
                                            <div className="upload-profile-picture-wrapper">
                                                <img
                                                    alt="profile-picture-wrapper"
                                                    src={
                                                        toggleModalUploadProfilePicture.src
                                                            ? toggleModalUploadProfilePicture.src
                                                            : defaultProfile
                                                    }
                                                />

                                                <Button
                                                    type="link"
                                                    icon={
                                                        <FontAwesomeIcon
                                                            icon={faCamera}
                                                        />
                                                    }
                                                    className="btn-upload"
                                                    onClick={() =>
                                                        setToggleModalUploadProfilePicture(
                                                            (ps) => ({
                                                                ...ps,
                                                                open: true,
                                                            }),
                                                        )
                                                    }
                                                />
                                                <ModalUploadProfilePicture
                                                    toggleModalUploadProfilePicture={
                                                        toggleModalUploadProfilePicture
                                                    }
                                                    setToggleModalUploadProfilePicture={
                                                        setToggleModalUploadProfilePicture
                                                    }
                                                    params={params}
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </Col>
                        {!params.id && (
                            <Col span={24}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoadingUser}
                                    shape="round"
                                >
                                    SUBMIT
                                </Button>
                            </Col>
                        )}
                    </Row>
                </Form>
                <ModalFormEmail
                    toggleModalFormEmail={toggleModalFormEmail}
                    setToggleModalFormEmail={setToggleModalFormEmail}
                />
                <ModalFormPassword
                    toggleModalFormPassword={toggleModalFormPassword}
                    setToggleModalFormPassword={setToggleModalFormPassword}
                />
            </Col>
        </Row>
    );
}
