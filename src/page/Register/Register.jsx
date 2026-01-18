import classNames from "classnames/bind";
import React from "react";
import PropTypes from "prop-types";

import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

function Register({ className }) {
    return <div className={cx("register", {
        [className]: className
    })}>Register</div>;
}
export default Register;
Register.propTypes = {
    className: PropTypes.string,
};