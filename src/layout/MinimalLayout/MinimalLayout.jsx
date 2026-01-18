import classNames from "classnames/bind"
import React from "react"
import { Outlet } from "react-router-dom"
import PropTypes from "prop-types"

import styles from "./MinimalLayout.module.scss"
const cx = classNames.bind(styles)

function MinimalLayout() {
    return (
        <div
            className={cx("minimal-layout")}
        >
            <Outlet />
        </div>
    )
};
export default MinimalLayout;

MinimalLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};
