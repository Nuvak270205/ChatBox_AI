import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import {useParams} from "react-router-dom";
import PropTypes from "prop-types";
import {ProfileItem}  from "~/components/ProfileItem/index.jsx";
import Search from "~/components/Search/index.jsx";
import ChatItem from "~/components/ChatItem/index.jsx";
import { arrContent } from "~/data";
import { Pencil } from "lucide-react";
import styles from "./Dasboard.module.scss";

const cx = classNames.bind(styles);

function Dashboard({ className }) {
    // Lấy chatId từ URL
    const { chatId } = useParams();
    // Cac state để quản lý trạng thái của component
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState(chatId ? Number(chatId) : null);
    const bodyRef = useRef(null);

    // Effect để xử lý sự kiện scroll và thay đổi border-top của content
    useEffect(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        function handBorderTopContent(){
            if(bodyElement.scrollTop > 0){
                bodyElement.style.borderTop = "2px solid rgba(0, 0, 0, 0.05)";
            }else{
                bodyElement.style.borderTop = "none";
            }

        }
        bodyElement.addEventListener("scroll", handBorderTopContent);
        return () => {
            bodyElement.removeEventListener("scroll", handBorderTopContent);
        }
    }, []);

    useEffect(() => {
        setCurrent(arrContent);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);


    return <div className={cx("dashboard", {
        [className]: className
    })}>
        <div className={cx("header")}>
            <div className={cx("header-title")}>
                Đoạn Chat
            </div>
            <ProfileItem icon={Pencil} className={cx("header-icon")}/>
        </div>
        <div className={cx("search-bar")}>
            <Search 
                className={cx("search-input")} 
                title={"Tìm kiếm trên ChatBox..."} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onFocus={() => setIsFocused(true)} 
                onBlur={() => setIsFocused(false)} 
                isFocused={isFocused}
            />
        </div>
        <div ref={bodyRef} className={cx("body")}>
            {loading ? 
            <div className={cx("loading")}></div> :
            <div className={cx("content")}>
                {current.map((item) => (
                <ChatItem
                    key={item.id}
                    id ={item.id}
                    images={item.images}
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
            </div>}
        </div> 
    </div>;
}

Dashboard.propTypes = {
   className: PropTypes.string
};

export default Dashboard;