import { Collapse as AntCollapse } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-regular-svg-icons";

export default function Collapse(props) {
    const {
        defaultActiveKey = ["0"],
        expandIconPosition = "end",
        items = [],
        ...rest
    } = props;

    return (
        <AntCollapse
            defaultActiveKey={defaultActiveKey}
            expandIconPosition={expandIconPosition}
            expandIcon={({ isActive }) =>
                isActive ? (
                    <FontAwesomeIcon icon={faAngleUp} />
                ) : (
                    <FontAwesomeIcon icon={faAngleDown} />
                )
            }
            items={items}
            {...rest}
        />
    );
}
