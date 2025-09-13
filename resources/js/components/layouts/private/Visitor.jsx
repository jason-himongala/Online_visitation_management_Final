import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Card, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGifts, faHome, faRefresh } from "@fortawesome/pro-regular-svg-icons";
import { lineSpinner } from "ldrs";

import ClearCache from "../../providers/ClearCache";

import PageVisitorView from "../../views/Public/PageVisitorView/PageVisitorView";
lineSpinner.register();

export default function Visitor(props) {
    return (
        <ClearCache>
            {({ isLatestVersion, emptyCacheStorage }) => (
                <>
                    {!isLatestVersion && (
                        <div className="notification-notice">
                            <div className="notification-notice-content">
                                <div className="notification-notice-icon">
                                    <FontAwesomeIcon icon={faGifts} />
                                </div>
                                <div className="notification-notice-message">
                                    <div className="title">
                                        Updates Now Available
                                    </div>
                                    <div className="description">
                                        A new version of this Web App is ready
                                    </div>
                                    <div className="action">
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                emptyCacheStorage();
                                            }}
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faRefresh}
                                                />
                                            }
                                        >
                                            Refresh
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <PageVisitorView />
                </>
            )}
        </ClearCache>
    );
}
