import classNames from "classnames/bind";
import React, { useEffect, useState, useRef} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import Chat from "~/components/ChatBox/index.jsx";
import Image from "~/components/Image/index.jsx";
import Time  from "~/components/Time/index.jsx";
import { arrContent, UserRoot } from "~/data";
import { Phone, Video, Info, Mic, Image as Img, Sticker, Smile, ThumbsUp, FolderGit } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import styles from "./ChatBox.module.scss";

const cx = classNames.bind(styles);

function ChatBox({ className, onClick }) {
    // biến state
    const [currentChatId, setCurrentChatId] = useState(arrContent[0]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    // biến router
    const { chatId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    //biến ref
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const emojiPickerRef = useRef(null);
    // biến online giả lập
    const onl = true;

    //ham xử lý
    const hanldeShowEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleEmojiClick = (emojiData, e) => {
        if (inputRef.current) {
            const emoji = emojiData.emoji;
            inputRef.current.textContent += emoji;
            setShowEmojiPicker(false);
            handleInput();
            inputRef.current.focus();
        }
    }

    const handleInput = () => {
        if (!inputRef.current) return;
        const text = (inputRef.current.textContent);
        setIsEmpty(text.length === 0);
    };

    useEffect(() => {
    if (!chatId) {
        navigate(`1`, { replace: true });
    }
    }, [chatId, location.pathname, navigate]);
    useEffect(() => {
        setCurrentChatId(arrContent[0]);
    }, [chatId]);

    useEffect(() => {
        const chatbox = bodyRef.current;
        if (chatbox) {
            chatbox.scrollTo(
                {
                    top: chatbox.scrollHeight,
                    behavior: "smooth",
                }
            );
        }
    });

    useEffect(() =>{
        const handleClickOutside = (e) =>{
            if(emojiPickerRef.current.contains(e.target)){
                hanldeShowEmojiPicker();
            } else {
                setShowEmojiPicker(false);
            }
        }
        if(emojiPickerRef.current){
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [])

    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus();
            const range = document.createRange();
            range.selectNodeContents(inputRef.current);
            range.collapse(false);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);        
        }
    }, [showEmojiPicker]);

    useEffect(() => {
        if (inputRef.current) {
            const text = (inputRef.current.textContent);
            setIsEmpty(text.length === 0);
        }
    }, []);


    return (
        <div className={cx("chat-box", { [className]: className })}>
            <div className={cx("header")}>
                <div className={cx("header-left")}>
                    <div className={cx("header-image")}>
                        <Image src={currentChatId.image} alt={currentChatId.user} />
                    </div>

                    <div className={cx("header-title")}>
                        <div className={cx("header-user")}>{currentChatId.user}</div>
                        {
                            onl ? (
                                <div className={cx("header-online")}>Dang online</div>
                            ) : (
                                null
                            )
                        }
                    </div>
                </div>
                <div className={cx("header-right")}>
                    <div className={cx("icon")}>
                        <Phone />
                    </div>
                    <div className={cx("icon")}>
                        <Video />
                    </div>
                    <div 
                        className={cx("icon")}
                        onClick={onClick}
                    >
                        <Info />
                    </div>
                </div>
            </div>
            <div ref={bodyRef} className={cx("body")}>
                <div className={cx("body-overview")}>
                    <div className={cx("body-image")}>
                        <Image src={currentChatId.image} alt={currentChatId.user} />
                    </div>
                    <div className={cx("body-user")}>{currentChatId.user}</div>
                    <div className={cx("body-status")}>Tin nhắn và cuộc gọi được bảo mật bằng tính năng mã hóa đầu cuối. Chỉ những người tham gia đoạn chat này mới có thể đọc, nghe hoặc chia sẻ. </div>
                </div>
                <div className={cx("body-content")}>
                    {currentChatId.data_Message.map((item, index) => {
                        const isCurrentUser = index === currentChatId.data_Message.length - 1;
                        let isTimeShow = false;
                        let isFirst = false;
                        let isCenter = false;
                        let isLast = false;
                        let isGroup = currentChatId.arr_user.length > 2 ? true : false;
                        if (index === 0){
                            isTimeShow = true;
                        } else if(Date.parse(item.time) - Date.parse(currentChatId.data_Message[index - 1].time) > 1800000){
                            isTimeShow = true;
                        }
                        if (index < currentChatId.data_Message.length - 1 && currentChatId.data_Message[index + 1].id_user === item.id_user
                            && currentChatId.data_Message[index + 1].type !== "forward" && currentChatId.data_Message[index + 1].type !== "reply" && currentChatId.data_Message[index + 1].type !== "icon"
                            && (Date.parse(currentChatId.data_Message[index + 1].time) - Date.parse(item.time) < 180000)
                        ){
                            isFirst = true;
                            if(item.type === "icon"){
                                isFirst = false;
                            }
                            if(index !== 0 && currentChatId.data_Message[index - 1].id_user === item.id_user
                                && item.type !== "forward" && item.type !== "reply" && currentChatId.data_Message[index - 1].type !== "icon"
                                && (Date.parse(item.time) - Date.parse(currentChatId.data_Message[index - 1].time) < 180000)
                            ){
                                isFirst = false;
                            }
                        }
                        if (index > 0 && index < currentChatId.data_Message.length - 1 
                            && (Date.parse(currentChatId.data_Message[index + 1].time) - Date.parse(item.time) < 180000)
                            && (Date.parse(item.time) - Date.parse(currentChatId.data_Message[index - 1].time) < 180000)
                            && item.type !== "forward"  && item.type !== "reply" && item.type !== "icon"
                        ){
                            if (currentChatId.data_Message[index - 1].id_user === item.id_user && currentChatId.data_Message[index + 1].id_user === item.id_user
                                && currentChatId.data_Message[index + 1].type !== "forward" && currentChatId.data_Message[index + 1].type !== "reply"
                                && currentChatId.data_Message[index + 1].type !== "icon" && currentChatId.data_Message[index - 1].type !== "icon"
                            ){
                                isCenter = true;
                            }
                        } 
                        if (index !== 0 && currentChatId.data_Message[index - 1].id_user === item.id_user
                            && item.type !== "forward"  && item.type !== "reply" && item.type !== "icon"
                            && currentChatId.data_Message[index - 1].type !== "icon"
                            && (Date.parse(item.time) - Date.parse(currentChatId.data_Message[index - 1].time) < 180000)
                        ){   
                            if(index === currentChatId.data_Message.length - 1){
                                isLast = true;
                            } else if (index < currentChatId.data_Message.length - 1
                                && (item.id_user !== currentChatId.data_Message[index + 1].id_user
                                || currentChatId.data_Message[index + 1].type === "forward" || currentChatId.data_Message[index + 1].type === "reply" || currentChatId.data_Message[index + 1].type === "icon"
                                || (Date.parse(currentChatId.data_Message[index + 1].time) - Date.parse(item.time) >= 180000)
                                )){
                                isLast = true;
                            }
                        }
                        return (
                            <div key={index}>
                                {isTimeShow && <Time date={item.time} />}
                                <Chat
                                content={item.content}
                                time={item.time}
                                arrUser={isCurrentUser ? [currentChatId.image] : []}
                                status={isCurrentUser ? item.status : null}
                                left={item.id_user !== UserRoot.id ? true : false}
                                right={item.id_user === UserRoot.id ? true : false}
                                first={isFirst}
                                center={isCenter}
                                last={isLast}
                                name={item.id_user === UserRoot.id ? "Bạn" : item.user}
                                image={item.id_user === currentChatId.id ? currentChatId.image : false}
                                rep={item.type === "reply" ? true : false}
                                rep_name={item.type === "reply" ? (currentChatId.data_Message.find(msg => msg.id === item.rep)?.id_user === UserRoot.id ? item.id_user === UserRoot.id ? "chính mình" : "bạn" : currentChatId.data_Message.find(msg => msg.id === item.rep)?.user) : ""}
                                rep_content={item.type === "reply" ? currentChatId.data_Message.find(msg => msg.id === item.rep)?.content : ""}
                                Rep_Icon={item.type === "reply" ? currentChatId.data_Message.find(msg => msg.id === item.rep)?.Icon : null}
                                forward={item.type === "forward" ? true : false}
                                group={isGroup}
                                Icon={item.type === "icon" ? item.Icon : null}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={cx("footer")}>
                <div className={cx("footer-icon")}>
                    <Tippy
                        content={"Gửi clip âm thanh"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div className={cx("icon")}>
                            <Mic />
                        </div>
                    </Tippy>
                    <Tippy
                        content={"Chọn biểu tượng cảm xúc"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div className={cx("icon")}>
                            <Img />
                        </div>
                    </Tippy>
                    <Tippy
                        content={"Chọn biểu tượng cảm xúc"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div className={cx("icon")}>
                            <Sticker />
                        </div>
                    </Tippy>
                    <Tippy
                        content={"Chọn biểu tượng cảm xúc"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div className={cx("icon")}>
                            <FolderGit />
                        </div>
                    </Tippy>
                </div>
                <div className={cx("footer-input")}>
                    <div
                        contentEditable="true"
                        ref={inputRef}
                        onInput={handleInput}
                        role="textbox"
                        aria-multiline="true"
                        data-placeholder="Aa"
                        className={cx("input-area", { "is-empty": isEmpty })}
                    />
                    <Tippy
                        content={"Chọn biểu tượng cảm xúc"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div ref={emojiPickerRef} className={cx("icon")}>
                            <Smile />
                        </div>
                    </Tippy>
                    {
                        showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} className={cx("emoji-picker")} />
                    }
                </div>
                <div className={cx("footer-actions")}>
                    <div className={cx("icon")}>
                            <ThumbsUp />
                        </div>
                </div>
            </div>
        </div>
    );
}

ChatBox.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default ChatBox;
