import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import VisitorLayout from "../layouts/private/Visitor";
import useCheckAuthStatus from "../providers/useCheckAuthStatus";

export default function VisitorRoute(props) {
    const { component: Component, layout = true, ...rest } = props;
    useCheckAuthStatus();
    const isLoggedInVisitor = localStorage.getItem("visitor_token");

    if (isLoggedInVisitor) {
        if (layout) {
            return (
                <VisitorLayout {...rest}>
                    <Component {...rest} />
                </VisitorLayout>
            );
        } else {
            return <Component {...rest} />;
        }
    } else {
        return <Navigate to="/visitor" />;
    }
}

VisitorRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
    layout: PropTypes.bool,
};
