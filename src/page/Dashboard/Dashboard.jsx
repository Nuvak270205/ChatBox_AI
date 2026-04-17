import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {ProfileItem}  from "~/components/ProfileItem/index.jsx";
import Search from "~/components/Search/index.jsx";
import ChatItem from "~/components/ChatItem/index.jsx";
import { Pencil } from "lucide-react";
import { listenToActiveChatItems } from "~/services/chat";
import styles from "./Dasboard.module.scss";

const cx = classNames.bind(styles);

function Dashboard({ className }) {
    // Lấy chatId từ URL
    const { chatId } = useParams();
    const navigate = useNavigate();
    // Lấy user từ Redux store
    const user = useSelector((state) => state.auth.user);
    // Cac state để quản lý trạng thái của component
    const [current, setCurrent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState(chatId || null);
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
        if (!user?.uid) {
            setCurrent([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = listenToActiveChatItems(user.uid, (chats) => {
            setCurrent(chats);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user?.uid]);

    useEffect(() => {
        setIsActive(chatId || null);
    }, [chatId]);

    useEffect(() => {
        if (loading || chatId || current.length === 0) {
            return;
        }

        navigate(`/dashboard/${current[0].id}`, { replace: true });
    }, [loading, chatId, current, navigate]);


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
                {current.length == 0 ? 
                <div className={cx("no-results")}>Không có đoạn chat nào</div>
                : current
                    .filter((item) => 
                        item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.content.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                    <ChatItem
                        key={item.id}
                        id ={item.id}
                        images={item.images}
                        user={item.user}
                        senderName={item.senderName}
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