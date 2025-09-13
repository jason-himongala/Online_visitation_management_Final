import { Button, Col, Modal } from "antd";
import React, { useState } from "react";

export default function ModalFileReview(props) {
    const { openModalFileReview, setOpenModalFileReview } = props;

    return (
        <Modal
            title="File Review"
            open={openModalFileReview.open}
            footer={
                <Button
                    onClick={() =>
                        setOpenModalFileReview({ open: false, data: null })
                    }
                >
                    Close
                </Button>
            }
            onCancel={() => setOpenModalFileReview({ open: false, data: null })}
        >
            {/* <iframe
                src={`../img/documents.png`}
                title="File Review"
                width="100%"
                height="500px"
            /> */}

            <Col>
                <img
                    src={`../images/documents.png`}
                    alt="File Review"
                    width="100%"
                    height="500px"
                />
            </Col>
        </Modal>
    );
}
