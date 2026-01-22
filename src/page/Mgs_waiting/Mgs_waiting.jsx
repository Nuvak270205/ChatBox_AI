import classNames from "classnames/bind";
import {useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import {ProfileItem}  from "~/components/ProfileItem/index.jsx";
import ChatItem from "~/components/ChatItem/index.jsx";
import PropTypes from "prop-types";
import { arrContent, arrContent1 } from "~/data";
import { Pencil } from "lucide-react";
import styles from "./Mgs_waiting.module.scss";

const cx = classNames.bind(styles);

function Mgs_waiting({ className }) {
    const { chatId } = useParams();
    const [page, setPage] = useState(1);
    const [isActive, setIsActive] = useState(chatId ? Number(chatId) : null);
    const [isActive1, setIsActive1] = useState(chatId ? Number(chatId) : null);
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
    return <div className={cx("mgs_waiting", {
        [className]: className
    })}>
        <div className={cx("header")}>
            <div className={cx("header-title")}>
                Tin nhắn đang chờ
            </div>
            <ProfileItem icon={Pencil} className={cx("header-icon")}/>
        </div>
        <div className={cx("sidebar-nav")}>
            <div 
                className={cx("sidebar-nav-item",{
                    [cx("active")]: page === 1
                })}
                onClick={() => setPage(1)}
            >Có thể bạn biết</div>
            <div 
                className={cx("sidebar-nav-item", {
                    [cx("active")]: page === 2
                })}
                onClick={() => setPage(2)}
            >Spam</div>
        </div>
        <div className={cx("body")}>
            <div className={cx("content")}>
                {page === 1 && arrContent.map((item) => (
                    <ChatItem 
                        key={item.id}
                        id={item.id}
                        image={item.image}
                        user={item.user}
                        content={item.content}
                        time={item.time}
                        check={item.check}
                        bell={item.bell}
                        imageSub={item.imageSub}
                        onClick={() => {
                            setIsActive(item.id);
                            setIsActive1(item.id);
                        }}
                        active={isActive === item.id}
                    />
                ))}
                {page === 2 && arrContent1.map((item) => (
                    <ChatItem 
                        key={item.id}
                        id={item.id}
                        image={item.image}
                        user={item.user}
                        content={item.content}
                        time={item.time}
                        check={item.check}
                        bell={item.bell}
                        imageSub={item.imageSub}
                        onClick={() => {
                            setIsActive1(item.id);
                            setIsActive(item.id);
                        }}
                        active={isActive1 === item.id}
                    />
                ))}
            </div>
        </div> 
    </div>;
}

Mgs_waiting.propTypes = {
    className: PropTypes.string,
};

export default Mgs_waiting;