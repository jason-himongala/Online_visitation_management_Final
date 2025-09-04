import { useCallback, useRef, useState } from "react";
import { Modal, Button, Row, Col, notification, Upload, Flex } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCamera,
    faRefresh,
    faUpload,
} from "@fortawesome/pro-regular-svg-icons";
import Webcam from "react-webcam";

import { POST } from "../../../../providers/useAxiosQuery";
import { defaultProfile } from "../../../../providers/appConfig";
import dataURLtoBlob from "../../../../providers/dataURLtoBlob";
import imageFileToBase64 from "../../../../providers/imageFileToBase64";
import notificationErrors from "../../../../providers/notificationErrors";

export default function ModalUploadProfilePicture(props) {
    const {
        toggleModalUploadProfilePicture,
        setToggleModalUploadProfilePicture,
        profile_id = "",
    } = props;

    const webcamRef = useRef(null);
    const [fileImage, setFileImage] = useState({
        is_camera: false,
        status: null,
        isCapture: false,
        file: null,
        src: null,
        fileName: null,
    });

    const { mutate: mutateProfilePicture, isLoading: isLoadingProfilePicture } =
        POST(`api/update_profile_photo`, "update_profile_photo");

    const onFinish = () => {
        let data = new FormData();

        data.append("profile_id", profile_id);

        if (fileImage.file) {
            data.append("profile_picture", fileImage.file, fileImage.fileName);
        }

        mutateProfilePicture(data, {
            onSuccess: (res) => {
                if (res.success) {
                    setToggleModalUploadProfilePicture((ps) => ({
                        ...ps,
                        open: false,
                        file: fileImage.file,
                        fileName: fileImage.fileName,
                        src: fileImage.src,
                    }));

                    setFileImage({
                        is_camera: false,
                        status: null,
                        file: null,
                        src: null,
                        isCapture: false,
                    });
                    notification.success({
                        message: "Profile Picture",
                        description: res.message,
                    });
                } else {
                    notification.error({
                        message: "Profile Picture",
                        description: res.message,
                    });
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
        });
    };

    const propsUpload = {
        action: false,
        accept: ".jpg,.png",
        maxCount: 1,
        beforeUpload: async (file) => {
            let error = false;

            const isJPG =
                file.type === "image/jpeg" || file.type === "image/png";

            if (!isJPG) {
                notification.error({
                    message: "Upload Profile Picture",
                    description: "You can only upload JPG/PNG file!",
                });
                error = Upload.LIST_IGNORE;
            }

            if (error === false) {
                let imageFileToBase64Res = await imageFileToBase64(file);

                setFileImage((ps) => ({
                    ...ps,
                    src: imageFileToBase64Res,
                    file: file,
                    fileName: file.name,
                }));
            }

            return error;
        },
        showUploadList: false,
    };

    const handleOpenCamera = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: true,
            })
            .then(function (stream) {
                if (stream.getVideoTracks().length > 0) {
                    // code for when both devices are available

                    setFileImage((ps) => ({
                        ...ps,
                        is_camera: true,
                        status: "available",
                        message: "Camera detected...",
                    }));
                } else {
                    //code for when none of the devices are available
                    setFileImage((ps) => ({
                        ...ps,
                        is_camera: true,
                        status: "unavailable",
                        message: "Camera not detected...",
                    }));
                }
            })
            .catch(function (error) {
                // code for when there is an error
                setFileImage((ps) => ({
                    ...ps,
                    is_camera: true,
                    status: "error",
                    message: error.message,
                }));
            });
    };
    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();

        const blob = dataURLtoBlob(imageSrc);

        setFileImage((ps) => ({
            ...ps,
            src: imageSrc,
            file: blob,
            isCapture: true,
            fileName: blob.size + "-camera.png",
        }));
    }, [webcamRef]);

    const handleRenderCamera = () => {
        if (fileImage.isCapture) {
            return (
                <img
                    alt=""
                    src={fileImage.src ? fileImage.src : defaultProfile}
                    className="w-100"
                />
            );
        } else {
            if (fileImage.status === "available") {
                return (
                    <Webcam
                        ref={webcamRef}
                        style={{
                            maxWidth: "100%",
                        }}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        disablePictureInPicture={true}
                        videoConstraints={{
                            facingMode: "user",
                        }}
                    />
                );
            } else {
                return (
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            padding: "100px 0px",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#000",
                            color: "#fff",
                            flexDirection: "column",
                            gap: "12px 12px",
                        }}
                    >
                        <div>
                            {fileImage.message}
                            <br />
                            {fileImage.message === "Requested device not found"
                                ? "Please check your camera and try refresh the page."
                                : "Please allow camera access and try refresh the page."}
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <Modal
            title="Take Photo"
            className="modal-profile-take-photo"
            open={toggleModalUploadProfilePicture.open}
            onCancel={() => {
                setToggleModalUploadProfilePicture((ps) => ({
                    ...ps,
                    open: false,
                }));
            }}
            forceRender
            footer={[
                <Button
                    key="cancel"
                    size="large"
                    shape="round"
                    onClick={() => {
                        setToggleModalUploadProfilePicture((ps) => ({
                            ...ps,
                            open: false,
                        }));
                        setFileImage({
                            is_camera: false,
                            status: null,
                            file: null,
                            src: null,
                            isCapture: false,
                            fileName: null,
                        });
                    }}
                    disabled={isLoadingProfilePicture}
                >
                    Cancel
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    shape="round"
                    size="large"
                    disabled={fileImage.file ? false : true}
                    loading={isLoadingProfilePicture}
                    onClick={() => {
                        console.log("fileImage: ", fileImage);

                        if (profile_id) {
                            onFinish();
                        } else {
                            if (fileImage.file) {
                                setToggleModalUploadProfilePicture({
                                    open: false,
                                    file: fileImage.file,
                                    src: fileImage.src,
                                    filename: fileImage.fileName,
                                });
                                setFileImage({
                                    is_camera: false,
                                    status: null,
                                    file: null,
                                    src: null,
                                    isCapture: false,
                                });
                            } else {
                                notification.error({
                                    message: "Upload Profile Picture",
                                    description:
                                        "Please upload your profile picture!",
                                });
                            }
                        }
                    }}
                >
                    Save
                </Button>,
            ]}
        >
            <Row gutter={[12, 12]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {!fileImage.is_camera ? (
                        <img
                            alt=""
                            src={fileImage.src ? fileImage.src : defaultProfile}
                            className="w-full"
                        />
                    ) : (
                        handleRenderCamera()
                    )}
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Flex justify="center" align="center" gap={5}>
                        {!fileImage.is_camera ? (
                            <Upload {...propsUpload}>
                                <Button
                                    icon={<FontAwesomeIcon icon={faUpload} />}
                                    size="large"
                                    shape="round"
                                >
                                    Upload Picture
                                </Button>
                            </Upload>
                        ) : (
                            <Button
                                icon={<FontAwesomeIcon icon={faUpload} />}
                                size="large"
                                shape="round"
                                onClick={() =>
                                    setFileImage({
                                        is_camera: false,
                                        status: null,
                                        file: null,
                                        src: null,
                                        isCapture: false,
                                    })
                                }
                            >
                                Click to Upload
                            </Button>
                        )}

                        {fileImage.is_camera ? (
                            fileImage.status === "available" ? (
                                fileImage.isCapture ? (
                                    <Button
                                        icon={
                                            <FontAwesomeIcon icon={faCamera} />
                                        }
                                        size="large"
                                        shape="round"
                                        onClick={() =>
                                            setFileImage((ps) => ({
                                                ...ps,
                                                src: null,
                                                file: null,
                                                isCapture: false,
                                            }))
                                        }
                                    >
                                        Reset
                                    </Button>
                                ) : (
                                    <Button
                                        icon={
                                            <FontAwesomeIcon icon={faCamera} />
                                        }
                                        size="large"
                                        onClick={handleCapture}
                                        shape="round"
                                    >
                                        Capture
                                    </Button>
                                )
                            ) : (
                                <Button
                                    icon={<FontAwesomeIcon icon={faRefresh} />}
                                    size="large"
                                    shape="round"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh
                                </Button>
                            )
                        ) : (
                            <Button
                                icon={<FontAwesomeIcon icon={faCamera} />}
                                size="large"
                                onClick={handleOpenCamera}
                                shape="round"
                            >
                                Click to Open Camera
                            </Button>
                        )}
                    </Flex>
                </Col>
            </Row>
        </Modal>
    );
}
