import classNames from "classnames/bind";
import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import ChatItem from "~/components/ChatItem/index.jsx";
import { listenToChannelChatsByGroupId } from "~/services/chat";
import styles from "./Group.module.scss";

const cx = classNames.bind(styles);

function Group({ className }) {
    const { idGroup, chatId } = useParams();
    const user = useSelector((state) => state.auth.user);
    const [channelChats, setChannelChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(chatId ? Number(chatId) : null);

    useEffect(() => {
        const contentElement = document.querySelector(`.${cx("content")}`);
        if (!contentElement) return;
        
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

    useEffect(() => {
        if (!user?.uid || !idGroup) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = listenToChannelChatsByGroupId(idGroup, user.uid, (data) => {
            setChannelChats(data);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [idGroup, user?.uid]);

    return <div className={cx("group", {
        [className]: className
    })}>
        <div className={cx("header")}>
            <div className={cx("header-title")}>
                Nhóm Chat
            </div>
        </div>
        <div>
            <div className={cx("header-subtitle")}>
                {channelChats.length} cuộc trò chuyện
            </div>
        </div>
        <div className={cx("body")}>
            <div className={cx("content")}>
                {loading ? (
                    <div className={cx("loading")}></div>
                ) : channelChats.length === 0 ? (
                    <div className={cx("no-results")}>Không có cuộc trò chuyện nào</div>
                ) : (
                    channelChats.map((item) => (
                        <ChatItem
                            key={item.id}
                            id={item.id}
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
                    ))
                )}
            </div>
        </div> 
    </div>;
}

Group.propTypes = {
    className: PropTypes.string,
};

export default Group;