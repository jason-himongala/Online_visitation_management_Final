import { useEffect, useState } from "react";
import { Button, Modal, Spin } from "antd";
import axios from "axios";

import { apiUrl, token } from "./appConfig";

export default function ModalPreviewPdf(props) {
    const {
        toggleModalPreviewPdf,
        setToggleModalPreviewPdf,
        title = "Preview PDF",
        width = "90%",
        iframeHeight = "90vh",
    } = props;

    const [src, setSrc] = useState(null);

    useEffect(() => {
        const handleFetchPdf = async () => {
            if (toggleModalPreviewPdf.url) {
                try {
                    let fetchPdf = await axios.get(
                        apiUrl(toggleModalPreviewPdf.url),
                        {
                            headers: {
                                Authorization: token(),
                            },
                            responseType: "blob",
                        }
                    );

                    let pdfBlob = new Blob([fetchPdf.data], {
                        type: "application/pdf",
                    });
                    let objectUrl = URL.createObjectURL(pdfBlob);
                    setSrc(objectUrl);
                } catch (error) {
                    console.error("Error fetching PDF:", error);
                }
            }
        };

        handleFetchPdf();

        return () => {};
    }, [toggleModalPreviewPdf]);

    return (
        <Modal
            width={width}
            className="modal-wrap-payslip-table-preview"
            title={title}
            open={toggleModalPreviewPdf.open}
            onCancel={() => {
                setToggleModalPreviewPdf({
                    open: false,
                    url: null,
                });
                if (src) {
                    URL.revokeObjectURL(src);
                }
                setSrc(null);
            }}
            destroyOnHidden={true}
            footer={[
                <Button
                    className="btn-main-primary"
                    key={1}
                    shape="round"
                    onClick={() => {
                        setToggleModalPreviewPdf({
                            open: false,
                            url: null,
                        });
                        if (src) {
                            URL.revokeObjectURL(src);
                        }
                        setSrc(null);
                    }}
                >
                    CLOSE
                </Button>,
            ]}
        >
            <RenderIframe src={src} iframeHeight={iframeHeight} />
        </Modal>
    );
}

const RenderIframe = ({ src, iframeHeight }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "500px",
                    }}
                >
                    <Spin size="large" />
                </div>
            )}

            {src && (
                <iframe
                    src={src || ""}
                    title="Loan File Summary"
                    style={{ width: "100%", height: iframeHeight }}
                    onLoad={() => setIsLoading(false)}
                />
            )}
        </>
    );
};
