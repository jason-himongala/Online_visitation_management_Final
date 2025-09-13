import { useEffect } from "react";
import { Layout } from "antd";

// import { appName } from "../../providers/appConfig";

export default function Visitor(props) {
    const { children, title, pageId } = props;

    useEffect(() => {
        if (title) {
            document.title = title + " | Visitor Management System";
        }

        return () => {};
    }, [title]);

    return (
        <Layout.Header
            className="private-layout h-screen bg-transparent!"
            id={pageId ?? ""}
        >
            <p>sadasdasd</p>
        </Layout.Header>
    );
}
