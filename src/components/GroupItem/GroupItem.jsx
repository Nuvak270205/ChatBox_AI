import classNames from "classnames/bind";
import React from "react";
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./GroupItem.module.scss";
import Image from "../Image/index.jsx";
const cx = classNames.bind(styles);

function GroupItem({ className, id, image, user, number, status, active, onClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
        <div className={cx("group-item", { [className]: className, active })} onClick={
            () => {
                if (onClick) onClick();
                const parts = location.pathname.split("/").filter(Boolean);
                if (params.chatId) {
                    parts[parts.length - 1] = id;
                } 
                else {
                    parts.push(id);
                }

                navigate("/" + parts.join("/"));
            }
        }>
            <div className={cx("avatar")}>
                <Image src={image} alt={user} />
            </div>
            <div className={cx("info")}>
                <div className={cx("user")}>{user}</div>
                <div className={cx("number")}>{" . " + number} thành viên</div>
            </div>
            <div className={cx("status")}>
            {
                status === true ? 
                (
                    <i className={cx("icon")} data-lucide="message-circle-warning"></i>
                ) : false
            }
            </div>
        </div>
    );
}

GroupItem.propTypes = {
    className: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    active: PropTypes.bool,
};

export default GroupItem;
