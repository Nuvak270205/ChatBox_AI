import classNames from "classnames/bind";
import {useParams} from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatItem from "~/components/ChatItem/index.jsx";
import { getMarketChatItems, listenToMarketChatItems } from "~/services/chat";
import PropTypes from "prop-types";

import styles from "./Marketplace.module.scss";

const cx = classNames.bind(styles);

function Marketplace({ className }) {
    const { chatId } = useParams();
    const user = useSelector((state) => state.auth.user);
    const [current, setCurrent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(chatId ? Number(chatId) : null);
    const bodyRef = useRef(null);

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
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = listenToMarketChatItems(user.uid, (data) => {
            setCurrent(data);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user?.uid]);

    return <div className={cx("marketplace", {
        [className]: className
    })}>
        <div className={cx("header")}>
            <div className={cx("header-title")}>
                Marketplace
            </div>
        </div>
        <div ref={bodyRef} className={cx("body")}>
            {loading ?
            <div className={cx("loading")}></div> :
            <div className={cx("content")}>
                {
                current?.length === 0 ?
                    <div className={cx("no-results")}>Không có đoạn chat nào</div>
                    :
                current?.map((item) => (
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

Marketplace.propTypes = {
    className: PropTypes.string,
};

export default Marketplace;