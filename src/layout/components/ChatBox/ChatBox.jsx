import classNames from "classnames/bind";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import Chat from "~/components/ChatBox/index.jsx";
import Image from "~/components/Image/index.jsx";
import Time  from "~/components/Time/index.jsx";
import { Phone, Video, Info, Mic, Image as Img, Sticker, Smile, ThumbsUp, FolderGit, X, Loader, SendHorizontal } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { uploadImage, uploadFile } from "~/services/upload.js";
import {
    listenToChatboxDetail,
    listenToChatboxMessages,
    markChatboxAsRead,
    sendChatboxMessage,
    sendChatboxThumbsUp,
} from "~/services/chatbox.js";

import styles from "./ChatBox.module.scss";

const cx = classNames.bind(styles);

function ChatBox({ className, onClick }) {
    // biến state
    const [currentChatData, setCurrentChatData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(true);
    const [rep, setRep] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    // biến router
    const { chatId } = useParams();
    const user = useSelector((state) => state.auth.user);
    //biến ref
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const inputFileRef = useRef(null);
    const inputImageRef = useRef(null);

    //ham xử lý
    const handleSendMessage = async (content = "", type = "normal", attachmentData = null) => {
        try {
            if (!chatId || !user?.uid || (!content.trim() && !attachmentData)) {
                return;
            }

            setIsSending(true);
            const replyId = rep || null;
            await sendChatboxMessage({
                chatId,
                userId: user.uid,
                content,
                type,
                attachmentData,
                replyId,
            });

            // Clear input
            if (inputRef.current) {
                inputRef.current.textContent = "";
                setIsEmpty(true);
            }
            setRep(null);
        } catch (error) {
            console.error("Send message failed:", error);
            alert("Gửi tin nhắn thất bại: " + error.message);
        } finally {
            setIsSending(false);
        }
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const uploadData = await uploadImage(file);
            await handleSendMessage("", "image", {
                url: uploadData.url,
                name: file.name,
                size: file.size,
            });
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Tải ảnh lên thất bại: " + error.message);
        } finally {
            setIsUploading(false);
            if (inputImageRef.current) {
                inputImageRef.current.value = "";
            }
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const uploadData = await uploadFile(file);
            await handleSendMessage("", "file", {
                url: uploadData.url,
                name: file.name,
                size: file.size,
            });
        } catch (error) {
            console.error("File upload failed:", error);
            alert("Tải tệp lên thất bại: " + error.message);
        } finally {
            setIsUploading(false);
            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }
        }
    };

    const handleSendThumbsUp = async () => {
        try {
            if (!chatId || !user?.uid) {
                return;
            }

            setIsSending(true);
            const replyId = rep || null;
            await sendChatboxThumbsUp({
                chatId,
                userId: user.uid,
                replyId,
            });
            setRep(null);
        } catch (error) {
            console.error("Send thumbs up failed:", error);
            alert("Gửi thất bại: " + error.message);
        } finally {
            setIsSending(false);
        }
    };
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isEmpty && !isSending) {
                handleSendMessage(inputRef.current?.textContent || "");
            }
        }
    };

    const handleReply = (value) => {
        setRep(value);
        console.log(value);
    }

    const visibleMessages = messages.length > 0 ? messages : (currentChatData?.data_Message || []);

    const currentChat = useMemo(() => {
        return rep ? visibleMessages.find((msg) => msg.id === rep) : null;
    }, [rep, visibleMessages]);

    const readReceiptByMessage = useMemo(() => {
        if (!currentChatData || !user?.uid) {
            return { latestOutgoingMessageId: null, avatarMap: {} };
        }

        const list = visibleMessages;
        const latestOutgoingMessage = [...list].reverse().find((msg) => msg.id_user === user.uid);

        if (!latestOutgoingMessage) {
            return { latestOutgoingMessageId: null, avatarMap: {} };
        }

        const avatarMap = {};

        (currentChatData.members || [])
            .filter((memberId) => memberId !== user.uid)
            .forEach((memberId) => {
                const rawLastRead = currentChatData.lastRead?.[memberId];
                const lastReadDate = rawLastRead?.toDate ? rawLastRead.toDate() : rawLastRead ? new Date(rawLastRead) : null;
                if (!lastReadDate) {
                    return;
                }

                const nearestReadOutgoingMessage = [...list].reverse().find((msg) => {
                    if (msg.id_user !== user.uid) {
                        return false;
                    }
                    const messageDate = msg.time instanceof Date ? msg.time : new Date(msg.time);
                    return messageDate <= lastReadDate;
                });

                if (!nearestReadOutgoingMessage) {
                    return;
                }

                const avatar = currentChatData.memberInfo?.[memberId]?.avatar || "";
                if (!avatarMap[nearestReadOutgoingMessage.id]) {
                    avatarMap[nearestReadOutgoingMessage.id] = [];
                }
                if (avatar) {
                    avatarMap[nearestReadOutgoingMessage.id].push(avatar);
                }
            });

        Object.keys(avatarMap).forEach((messageId) => {
            avatarMap[messageId] = avatarMap[messageId].slice(0, 2);
        });

        return {
            latestOutgoingMessageId: latestOutgoingMessage.id,
            avatarMap,
        };
    }, [currentChatData, user?.uid]);

    useEffect(() => {
        if (!chatId || !user?.uid) {
            setCurrentChatData(null);
            setMessages([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setRep(null);

        // Update lastRead timestamp when entering the chat
        const updateLastRead = async () => {
            try {
                await markChatboxAsRead({
                    chatId,
                    userId: user.uid,
                });
            } catch (error) {
                console.error("Failed to update lastRead:", error);
            }
        };

        // Call update immediately
        updateLastRead();

        const unsubscribeChat = listenToChatboxDetail({
            chatId,
            user,
            onUpdate: (chatData) => {
                setCurrentChatData((prev) => ({
                    ...(prev || {}),
                    ...chatData,
                }));
                setLoading(false);
            },
            onMissing: () => {
                setCurrentChatData(null);
                setLoading(false);
            },
        });

        const unsubscribeMessages = listenToChatboxMessages({
            chatId,
            onUpdate: (nextMessages) => {
                setMessages(
                    nextMessages.map((message) => ({
                        ...message,
                        Icon: message.type === "icon" ? ThumbsUp : null,
                    }))
                );
            },
        });

        return () => {
            unsubscribeChat();
            unsubscribeMessages();
        };
    }, [chatId, user?.uid]);

    useEffect(() => {
        setCurrentChatData((prev) => {
            if (!prev) {
                return null;
            }

            return {
                ...prev,
                data_Message: messages,
            };
        });

        // Update lastRead when new messages arrive
        if (messages.length > 0 && chatId && user?.uid) {
            const updateLastReadOnNewMessages = async () => {
                try {
                    const latestMessage = messages[messages.length - 1];
                    if (!latestMessage || latestMessage.id_user === user.uid) {
                        return;
                    }
                    await markChatboxAsRead({
                        chatId,
                        userId: user.uid,
                    });
                } catch (error) {
                    console.error("Failed to update lastRead on new messages:", error);
                }
            };

            // Use a small delay to avoid too frequent updates
            const timer = setTimeout(updateLastReadOnNewMessages, 500);
            return () => clearTimeout(timer);
        }
    }, [messages, chatId, user?.uid]);

    useEffect(() => {
        const chatbox = bodyRef.current;
        if (chatbox && currentChatData) {
            chatbox.scrollTo(
                {
                    top: chatbox.scrollHeight,
                    behavior: "smooth",
                }
            );
        }
    }, [currentChatData, messages.length]);

    useEffect(() =>{
        const handleClickOutside = (e) =>{
            if(emojiPickerRef.current?.contains(e.target)){
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

    if (loading) {        
        return (
        <div className={cx("chat-box", { [className]: className })}>
            <div className={cx("loading")}></div>
        </div>)
    }

    if (!currentChatData) {
        return (
            <div className={cx("chat-box", { [className]: className })}></div>
        );
    }

    const headerImages = (currentChatData.images || []).filter(Boolean).slice(0, 2);

    return (
        <div className={cx("chat-box", { [className]: className })}>
                <div className={cx("header")}>
                    <div className={cx("header-left")}>
                        <div className={cx("header-image", {"avatar--multiple": headerImages.length === 1})}>
                            {headerImages.length === 1 ? 
                                (<Image src={headerImages[0]}/> ):
                                (headerImages.map((image, index) => {
                                    return <div className={cx("image", `image-${index}`)} key={index}>
                                                <Image key={index} src={image} className={cx({"image-border": index === 0})}/>
                                            </div>;
                                    }))
                                }
                        </div>
                        <div className={cx("header-title")}>
                            <div className={cx("header-user")}>{currentChatData.user}</div>
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
                            <Image src={currentChatData.images[0]}/>
                        </div>
                        <div className={cx("body-user")}>{currentChatData.user}</div>
                        <div className={cx("body-status")}>Tin nhắn và cuộc gọi được bảo mật bằng tính năng mã hóa đầu cuối. Chỉ những người tham gia đoạn chat này mới có thể đọc, nghe hoặc chia sẻ. </div>
                    </div>
                    <div className={cx("body-content")}>
                        {visibleMessages.map((item, index, list) => {
                            const isCurrentUser = item.id_user === user?.uid;
                            let isTimeShow = false;
                            let isFirst = false;
                            let isCenter = false;
                            let isLast = false;
                            let isNormal = false;
                            const isGroup = (currentChatData.members?.length || 0) > 2;
                            const senderName = isCurrentUser ? "Bạn" : (currentChatData.memberInfo?.[item.id_user]?.name || currentChatData.memberInfo?.[item.id_user]?.displayName || "User");
                            const senderAvatar = currentChatData.memberInfo?.[item.id_user]?.avatar || currentChatData.images[0] || false;
                            const replyMessage = list.find((msg) => msg.id === item.rep);
                            const isReplyMissing = item.type === "reply" && !replyMessage;

                            if (index === 0){
                                isTimeShow = true;
                            } else if(Date.parse(item.time) - Date.parse(list[index - 1].time) > 1800000){
                                isTimeShow = true;
                            }
                            if (index < list.length - 1 && list[index + 1].id_user === item.id_user
                                && list[index + 1].type !== "forward" && list[index + 1].type !== "reply" && list[index + 1].type !== "icon"
                                && (Date.parse(list[index + 1].time) - Date.parse(item.time) < 180000)
                            ){
                                isFirst = true;
                                if(item.type === "icon"){
                                    isFirst = false;
                                }
                                if(index !== 0 && list[index - 1].id_user === item.id_user
                                    && item.type !== "forward" && item.type !== "reply" && list[index - 1].type !== "icon"
                                    && (Date.parse(item.time) - Date.parse(list[index - 1].time) < 180000)
                                ){
                                    isFirst = false;
                                }
                            }
                            if (index > 0 && index < list.length - 1 
                                && (Date.parse(list[index + 1].time) - Date.parse(item.time) < 180000)
                                && (Date.parse(item.time) - Date.parse(list[index - 1].time) < 180000)
                                && item.type !== "forward"  && item.type !== "reply" && item.type !== "icon"
                            ){
                                if (list[index - 1].id_user === item.id_user && list[index + 1].id_user === item.id_user
                                    && list[index + 1].type !== "forward" && list[index + 1].type !== "reply"
                                    && list[index + 1].type !== "icon" && list[index - 1].type !== "icon"
                                ){
                                    isCenter = true;
                                }
                            } 
                            if (index !== 0 && list[index - 1].id_user === item.id_user
                                && item.type !== "forward"  && item.type !== "reply" && item.type !== "icon"
                                && list[index - 1].type !== "icon"
                                && (Date.parse(item.time) - Date.parse(list[index - 1].time) < 180000)
                            ){   
                                if(index === list.length - 1){
                                    isLast = true;
                                } else if (index < list.length - 1
                                    && (item.id_user !== list[index + 1].id_user
                                    || list[index + 1].type === "forward" || list[index + 1].type === "reply" || list[index + 1].type === "icon"
                                    || (Date.parse(list[index + 1].time) - Date.parse(item.time) >= 180000)
                                    )){
                                    isLast = true;
                                }
                            }
                            if (!isFirst && !isCenter && !isLast){
                                isNormal = true;
                            }
                            const isLatestOutgoing = isCurrentUser && item.id === readReceiptByMessage.latestOutgoingMessageId;
                            const readerAvatars = isCurrentUser ? (readReceiptByMessage.avatarMap[item.id] || []) : [];

                            return (
                                <div key={index}>
                                    {isTimeShow && <Time date={item.time} />}
                                    <Chat
                                    content={item.content}
                                    id={item.id}
                                    content_image={item.content_image}
                                    titlefile={item.titlefile}
                                    sizefile={item.sizefile}
                                    time={item.time}
                                    arrUser={readerAvatars}
                                    status={isLatestOutgoing && readerAvatars.length === 0 ? item.status : null}
                                    left={!isCurrentUser}
                                    right={isCurrentUser}
                                    normal={isNormal}
                                    first={isFirst}
                                    center={isCenter}
                                    last={isLast}
                                    name={senderName}
                                    image={!isCurrentUser ? senderAvatar : false}
                                    rep={item.type === "reply" ? true : false}
                                    rep_name={item.type === "reply" ? (replyMessage?.id_user === user?.uid ? (isCurrentUser ? "chính mình" : "bạn") : (replyMessage?.user || currentChatData.memberInfo?.[replyMessage?.id_user]?.name || currentChatData.memberInfo?.[replyMessage?.id_user]?.displayName || "User")) : ""}
                                    rep_content={item.type === "reply" ? (isReplyMissing ? "Tin nhắn gốc không khả dụng" : (replyMessage?.content || "")) : ""}
                                    Rep_Icon={item.type === "reply" ? (replyMessage?.Icon || ThumbsUp) : null}
                                    rep_image={item.type === "reply" ? (replyMessage?.titlefile ? null : (replyMessage?.content_image || null)) : null}
                                    rep_file={item.type === "reply" ? (replyMessage?.titlefile || null) : null}
                                    forward={item.type === "forward" ? true : false}
                                    group={isGroup}
                                    Icon={item.type === "icon" ? item.Icon : null}
                                    onClick={handleReply}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={cx("footer")}>
                    {
                        rep && currentChat && (
                            <div className={cx("footer-rep")}>
                                <div className={cx("footer-rep-content")}>
                                    <div className={cx("footer-rep-title")}>Đang trả lời {currentChat.id_user === user?.uid ? "chính mình" : (currentChat.user || currentChatData.memberInfo?.[currentChat.id_user]?.name || currentChatData.memberInfo?.[currentChat.id_user]?.displayName || "bạn")}</div>
                                    <div className={cx("footer-rep-text")}>{currentChat.titlefile ? "File đính kèm" : currentChat.content_image ? "Hình ảnh" : currentChat.content}</div>
                                </div>
                                <div className={cx("footer-rep-close")} onClick={() => setRep(null)}>
                                    <X />
                                </div>
                            </div>
                        )
                    }
                    <div className={cx("footer_button")}>
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
                                content={"Đính kèm file có kích thước tối đa 100MB"}
                                placement="top"
                                delay={[300, 0]}
                                interactive={true}
                            >
                                <div className={cx("icon")} onClick={() => inputImageRef.current?.click()}>
                                    <Img />
                                    <input type="file" ref={inputImageRef} style={{display: "none"}} accept="image/*" onChange={handleImageSelect} disabled={isUploading}/>
                                </div>
                            </Tippy>
                            <Tippy
                                content={"Chọn nhãn dán"}
                                placement="top"
                                delay={[300, 0]}
                                interactive={true}
                            >
                                <div className={cx("icon")} onClick={() => inputFileRef.current?.click()}>
                                    <Sticker />
                                    <input type="file" ref={inputFileRef} style={{display: "none"}} accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFileSelect} disabled={isUploading}/>
                                </div>
                            </Tippy>
                            <Tippy
                                content={"Chọn file GIF"}
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
                                onKeyDown={handleKeyDown}
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
                                <div ref={emojiPickerRef} className={cx("icon")} onClick={hanldeShowEmojiPicker}>
                                    <Smile />
                                </div>
                            </Tippy>
                            {
                                showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} className={cx("emoji-picker")} />
                            }
                        </div>
                        <div className={cx("footer-actions")}>
                            {isEmpty ? (
                                <Tippy
                                    content={"Gửi thích"}
                                    placement="top"
                                    delay={[300, 0]}
                                    interactive={true}
                                >
                                    <div className={cx("icon")} onClick={handleSendThumbsUp} disabled={isSending}>
                                        {isSending ? <Loader className={cx("spinner")} /> : <ThumbsUp />}
                                    </div>
                                </Tippy>
                            ) : (
                                <Tippy
                                    content={"Gửi (Enter)"}
                                    placement="top"
                                    delay={[300, 0]}
                                    interactive={true}
                                >
                                    <div 
                                        className={cx("icon")} 
                                        onClick={() => handleSendMessage(inputRef.current?.textContent || "")}
                                        style={{ cursor: isSending ? "not-allowed" : "pointer", opacity: isSending ? 0.6 : 1 }}
                                        disabled={isSending}
                                    >
                                        {isSending ? <Loader className={cx("spinner")} /> : <SendHorizontal />}
                                    </div>
                                </Tippy>
                            )}
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
