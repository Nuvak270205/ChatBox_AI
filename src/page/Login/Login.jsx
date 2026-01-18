import classNames from "classnames/bind";
import React from "react";
import PropTypes from "prop-types";

import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

function Login({ className }) {
    return <div className={cx("login", {
        [className]: className
    })}>Login</div>;
}
export default Login;
Login.propTypes = {
    className: PropTypes.string,
};