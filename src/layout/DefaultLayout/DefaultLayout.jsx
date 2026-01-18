import classNames from "classnames/bind";
import React from "react";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./DefaultLayout.module.scss";
import Sidebar from "~/layout/components/Sidebar/Sidebar.jsx";
import ChatBox from "~/layout/components/ChatBox/ChatBox.jsx";

const cx = classNames.bind(styles);

function DefaultLayout() {
    return ( 
        <div className={cx("default-layout")}>
            <Sidebar />
            <div className={cx("content")}>
                <Outlet />
            </div>
            <ChatBox className={cx("chat-box")} />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
