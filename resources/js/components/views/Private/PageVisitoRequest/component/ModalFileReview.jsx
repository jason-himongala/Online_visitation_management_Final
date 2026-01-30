import { Button, Col, Modal, Spin, Typography, Alert } from "antd";
import React, { useState, useEffect } from "react";

const { Text } = Typography;

export default function ModalFileReview(props) {
    const { openModalFileReview, setOpenModalFileReview } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [fileUrl, setFileUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (openModalFileReview.open && openModalFileReview.data) {
            setIsLoading(true);
            setError(null);

            // Check if data is a record object or file path/URL
            const fileData = openModalFileReview.data;

            // Determine file source
            let fileSource = null;

            if (typeof fileData === "object" && fileData !== null) {
                // It's a record object
                if (fileData.file_url) {
                    fileSource = fileData.file_url;
                } else if (fileData.file_path) {
                    // Construct URL from file_path
                    fileSource = `/storage/${fileData.file_path.replace("public/", "")}`;
                } else if (fileData.file) {
                    fileSource = fileData.file;
                } else if (fileData.visitation_form?.file_path) {
                    fileSource = `/storage/${fileData.visitation_form.file_path.replace("public/", "")}`;
                }
            } else if (typeof fileData === "string") {
                // It's already a string (path or URL)
                fileSource = fileData;
            }

            console.log("File data for preview:", {
                originalData: fileData,
                fileSource: fileSource,
                isURL:
                    fileSource?.startsWith("http") ||
                    fileSource?.startsWith("/"),
            });

            if (fileSource) {
                setFileUrl(fileSource);
                setIsLoading(false);
            } else {
                setError("No file available for preview");
                setIsLoading(false);
            }
        }
    }, [openModalFileReview.open, openModalFileReview.data]);

    const getFileType = (url) => {
        if (!url) return "unknown";

        const urlLower = url.toLowerCase();

        if (urlLower.endsWith(".pdf")) return "pdf";
        if (urlLower.endsWith(".doc") || urlLower.endsWith(".docx"))
            return "word";
        if (
            urlLower.endsWith(".png") ||
            urlLower.endsWith(".jpg") ||
            urlLower.endsWith(".jpeg") ||
            urlLower.endsWith(".gif")
        )
            return "image";

        return "unknown";
    };

    const getFileName = () => {
        if (!openModalFileReview.data) return "No file";

        const data = openModalFileReview.data;

        if (typeof data === "object" && data !== null) {
            if (data.file_name) return data.file_name;
            if (data.visitation_form?.file_name)
                return data.visitation_form.file_name;

            // Extract from path
            if (data.file_path) {
                return data.file_path.split("/").pop();
            }
        } else if (typeof data === "string") {
            return data.split("/").pop() || "Document";
        }

        return "Document";
    };

    const fileType = getFileType(fileUrl);
    const fileName = getFileName();

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setError(
            "Failed to load the file. The file may be corrupted or inaccessible.",
        );
    };

    return (
        <Modal
            title={
                <div>
                    <span>File Review</span>
                    {fileName && (
                        <Text
                            type="secondary"
                            style={{ marginLeft: "10px", fontSize: "14px" }}
                        >
                            ({fileName})
                        </Text>
                    )}
                </div>
            }
            open={openModalFileReview.open}
            width={1000}
            footer={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        {fileUrl && (
                            <Button
                                type="primary"
                                href={fileUrl}
                                target="_blank"
                                download={fileName}
                                style={{ marginRight: "10px" }}
                            >
                                Download
                            </Button>
                        )}
                    </div>
                    <Button
                        onClick={() =>
                            setOpenModalFileReview({ open: false, data: null })
                        }
                    >
                        Close
                    </Button>
                </div>
            }
            onCancel={() => setOpenModalFileReview({ open: false, data: null })}
        >
            <div
                style={{
                    width: "100%",
                    minHeight: "500px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isLoading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <Spin size="large" />
                        <Text
                            type="secondary"
                            style={{ display: "block", marginTop: "16px" }}
                        >
                            Loading file...
                        </Text>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <Alert
                            message="File Not Available"
                            description={error}
                            type="warning"
                            showIcon
                            style={{ marginBottom: "20px" }}
                        />
                        {fileUrl && (
                            <Button
                                type="primary"
                                href={fileUrl}
                                target="_blank"
                                download={fileName}
                            >
                                Try Downloading Instead
                            </Button>
                        )}
                    </div>
                ) : !fileUrl ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <Alert
                            message="No File"
                            description="No file is attached to this request."
                            type="info"
                            showIcon
                        />
                    </div>
                ) : (
                    <div style={{ width: "100%", height: "500px" }}>
                        {fileType === "pdf" ? (
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                title="PDF Viewer"
                                width="100%"
                                height="100%"
                                style={{ border: "none" }}
                                onLoad={handleIframeLoad}
                                onError={handleIframeError}
                            />
                        ) : fileType === "image" ? (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <img
                                    src={fileUrl}
                                    alt="File Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                    }}
                                    onLoad={handleIframeLoad}
                                    onError={handleIframeError}
                                />
                            </div>
                        ) : fileType === "word" ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    padding: "20px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "48px",
                                        color: "#1890ff",
                                        marginBottom: "20px",
                                    }}
                                >
                                    📄
                                </div>
                                <Text
                                    strong
                                    style={{
                                        fontSize: "16px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Word Document
                                </Text>
                                <Text
                                    type="secondary"
                                    style={{ marginBottom: "20px" }}
                                >
                                    Word documents cannot be previewed in the
                                    browser. Please download the file to view
                                    it.
                                </Text>
                                <Button
                                    type="primary"
                                    href={fileUrl}
                                    target="_blank"
                                    download={fileName}
                                    size="large"
                                >
                                    Download Word Document
                                </Button>
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    padding: "20px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "48px",
                                        color: "#999",
                                        marginBottom: "20px",
                                    }}
                                >
                                    ❓
                                </div>
                                <Text
                                    strong
                                    style={{
                                        fontSize: "16px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Unknown File Type
                                </Text>
                                <Text
                                    type="secondary"
                                    style={{ marginBottom: "20px" }}
                                >
                                    This file type cannot be previewed in the
                                    browser.
                                </Text>
                                <Button
                                    type="primary"
                                    href={fileUrl}
                                    target="_blank"
                                    download={fileName}
                                >
                                    Download File
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {fileUrl && !isLoading && !error && (
                    <div
                        style={{
                            marginTop: "16px",
                            fontSize: "12px",
                            color: "#666",
                            textAlign: "center",
                        }}
                    >
                        <p>If the file doesn't load properly, you can:</p>
                        <p>1. Click the Download button above</p>
                        <p>
                            2.{" "}
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open in new tab
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
