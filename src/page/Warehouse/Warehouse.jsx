import classNames from "classnames/bind";
import {useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import ChatItem from "~/components/ChatItem/index.jsx";
import PropTypes from "prop-types";
import { arrContent } from "~/data";
import styles from "./Warehouse.module.scss";

const cx = classNames.bind(styles);

function Warehouse({ className }) {
    const { chatId } = useParams();
    const [isActive, setIsActive] = useState(chatId ? Number(chatId) : null);
    useEffect(() => {
                const contentElement = document.querySelector(`.${cx("content")}`);
                function handBorderTopContent(){
                    if(contentElement.scrollTop > 0){
                        contentElement.style.borderTop = "2px solid rgba(0, 0, 0, 0.05)";
                    }else{
                        contentElement.style.borderTop = "none";
                    }
        
                }
                contentElement.addEventListener("scroll", handBorderTopContent);
                return () => {
                    contentElement.removeEventListener("scroll", handBorderTopContent);
                }
            }, []);
    return <div className={cx("warehouse", {
        [className]: className
    })}>
        <div className={cx("header")}>
            <div className={cx("header-title")}>
                Đoạn Chat Lưu Trữ
            </div>
        </div>
        <div className={cx("body")}>
            <div className={cx("content")}>
                {arrContent.map((item) => (
                    <ChatItem
                        key={item.id}
                        id ={item.id}
                        image={item.image}
                        user={item.user}
                        content={item.content}
                        time={item.time}
                        check={item.check}
                        bell={item.bell}
                        imageSub={item.imageSub}
                        onClick={() => setIsActive(item.id)}
                        active={isActive === item.id}
                    />
                ))}
            </div>
        </div> 
    </div>;
}

Warehouse.propTypes = {
    className: PropTypes.string,
};

export default Warehouse;