import { Tabs as AntTabs } from "antd";

export default function Tabs(props) {
    const { type = "line", size = "middle", items = [], ...rest } = props;

    return <AntTabs type={type} size={size} items={items} {...rest} />;
}
