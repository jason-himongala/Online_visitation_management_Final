import React, { useState } from "react";
import PropTypes from "prop-types";
import { TimePicker } from "antd";

export default function FloatTimePicker(props) {
    const {
        id,
        value,
        label,
        placeholder,
        required,
        className,
        format = "h:mm a", // default to 12-hour with am/pm
        size = "large",
        ...rest
    } = props;

    const [focus, setFocus] = useState(false);

    let new_placeholder = !placeholder ? label : placeholder;

    let isOccupied = focus || (value && value.length !== 0);

    let labelClass = isOccupied ? " float-label" : "";

    let requiredMark = required ? (
        <span className="text-red-600">*</span>
    ) : null;

    return (
        <div
            id={id ?? ""}
            className={`float-wrapper${className ? " " + className : ""}`}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <TimePicker
                value={value ? value : null}
                size={size}
                placeholder={[""]}
                format={format}
                use12Hours
                {...rest}
            />

            <label className={`label ${size}${labelClass}`}>
                {isOccupied ? label : new_placeholder} {requiredMark}
            </label>
        </div>
    );
}

FloatTimePicker.propTypes = {
    id: PropTypes.string,
    value: PropTypes.any,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    className: PropTypes.string,
    format: PropTypes.string,
    size: PropTypes.oneOf(["small", "middle", "large"]),
};
