import classNames from "classnames/bind";
import React, {useState, useCallback} from "react";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./DefaultLayout.module.scss";
import Sidebar from "~/layout/components/Sidebar/index.jsx";
import ChatBox from "~/layout/components/ChatBox/index.jsx";
import Information from "~/layout/components/Information/index.jsx";

const cx = classNames.bind(styles);


function DefaultLayout() {

    const [isInforOpen, setIsInforOpen] = useState(false);

    const toggleInformation = useCallback(() => {
        setIsInforOpen(prev => !prev);
    }, []);

    return (
        <div className={cx("default-layout")}>
            <Sidebar />
            <div className={cx("content")}>
                <Outlet />
            </div>
            <ChatBox className={cx("chat-box")} onClick={toggleInformation}/>
            {
                isInforOpen && <Information className={cx("information")} />
            }
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
