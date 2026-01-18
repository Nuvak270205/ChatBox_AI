import classNames from "classnames/bind";
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./ChatItem.module.scss";
import Image from "../Image/index.jsx";
const cx = classNames.bind(styles);

function ChatItem({ className, id, image, user, content, time, check, bell, imageSub, onClick, active }) {

    const timeRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        function handleTime() {
            const nowTime = new Date();
            const oldTime = new Date(time);
            const diffTime = Math.floor((nowTime - oldTime) / 1000);

            let displayTime = "";
            if (diffTime < 60) displayTime = ` . ${diffTime} giây trước`;
            else if (diffTime < 3600) displayTime = ` . ${Math.floor(diffTime / 60)} phút trước`;
            else if (diffTime < 86400) displayTime = ` . ${Math.floor(diffTime / 3600)} giờ trước`;
            else if (diffTime < 2592000) displayTime = ` . ${Math.floor(diffTime / 86400)} ngày trước`;
            else displayTime = ` . ${oldTime.getDate()}/${oldTime.getMonth() + 1}/${oldTime.getFullYear()}`;

            if (timeRef.current) {
                timeRef.current.textContent = displayTime;
            }
        }

        handleTime();
        const timer = setInterval(handleTime, 60000);

        return () => clearInterval(timer);
    }, [time]);

    return (
        <div className={cx("chat-item", { [className]: className , active })} onClick={
            () => {
                if (onClick) onClick();
                const parts = location.pathname.split("/").filter(Boolean);
                if (params.chatId) {
                    parts[parts.length - 1] = id;
                } 
                // nếu chưa có chatId → thêm vào cuối
                else {
                    parts.push(id);
                }

                navigate("/" + parts.join("/"));
                window.document.title = `${user}`;
            }
        }>
            <div className={cx("avatar")}>
                <Image src={image} alt={user} />
            </div>
            <div className={cx("info")}>
                <div className={cx("user")}>{user}</div>
                <div className={cx("message-info-body")}>
                    {check ? 
                    (<span className={cx("content")}> 
                        {user.split(' ')[user.split(' ').length - 1] + ": " + content}
                    </span>) :
                    (<span className={cx("content", "check")}>
                        {user.split(' ')[user.split(' ').length - 1] + ": " + content}
                    </span>)}
                    <span className={cx("time")} ref={timeRef}></span>
                </div>
            </div>
            <div className={cx("check__avatar")}>
            {check ? 
                bell === false ? (
                    <div className={cx("sub__avatar")}>
                        <Image src={imageSub} alt={user} />
                    </div>
                ) : (
                    <i className={cx("icon")} data-lucide="bell-off"></i>
                )
                 : 
                bell === false ? null : (
                    <i className={cx("icon")} data-lucide="bell-off"></i>
                )
            }
            </div>
        </div>
    );
}

ChatItem.propTypes = {
    className: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    time: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
    check: PropTypes.bool.isRequired,
    bell: PropTypes.bool.isRequired,
    imageSub: PropTypes.string,
    onClick: PropTypes.func,
    active: PropTypes.bool,
};

export default ChatItem;
