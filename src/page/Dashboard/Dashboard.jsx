import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
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
    const { chatId } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
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

Dashboard.propTypes = {
   className: PropTypes.string
};

export default Dashboard;