import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {ProfileItem}  from "~/components/ProfileItem/index.jsx";
import Search from "~/components/Search/index.jsx";
import ChatItem from "~/components/ChatItem/index.jsx";
import { Pencil } from "lucide-react";
import {
    createOrOpenDirectChat,
    findDirectChatBetweenUsers,
    findDirectChatByOtherMemberEmail,
    findUserByEmail,
    listenToActiveChatItems,
} from "~/services/chat";
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
    const [directSearchItem, setDirectSearchItem] = useState(null);
    const [isCreatingDirectChat, setIsCreatingDirectChat] = useState(false);
    const bodyRef = useRef(null);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        let isCancelled = false;

        async function resolveExactEmailSearch() {
            const normalizedSearchTerm = searchTerm.trim().toLowerCase();

            if (!user?.uid || !emailPattern.test(normalizedSearchTerm)) {
                setDirectSearchItem(null);
                return;
            }

            const targetUser = await findUserByEmail(normalizedSearchTerm);

            if (isCancelled) return;

            if (targetUser) {
                const existingChatDoc = await findDirectChatBetweenUsers(user.uid, targetUser.uid);

                if (isCancelled) return;

                if (existingChatDoc) {
                    const existingDirectChat = current.find((item) => item.id === existingChatDoc.id);

                    setDirectSearchItem({
                        mode: "existing",
                        item: existingDirectChat || {
                            id: existingChatDoc.id,
                            images: [targetUser.avatar || targetUser.avatarUrl || targetUser.photoURL || ""].filter(Boolean),
                            user: targetUser.name || targetUser.displayName || targetUser.email || targetUser.uid,
                            senderName: "",
                            content: "Nhấn để mở đoạn chat",
                            time: new Date(),
                            check: true,
                            bell: false,
                            imageSub: "",
                        },
                    });

                    if (chatId !== existingChatDoc.id) {
                        setIsActive(existingChatDoc.id);
                        navigate(`/dashboard/${existingChatDoc.id}`, { replace: true });
                    }

                    return;
                }

                setDirectSearchItem({
                    mode: "create",
                    targetUser,
                    item: {
                        id: targetUser.uid,
                        images: [targetUser.avatar || targetUser.avatarUrl || targetUser.photoURL || ""].filter(Boolean),
                        user: targetUser.name || targetUser.displayName || targetUser.email || targetUser.uid,
                        content: "",
                        time: new Date(),
                        check: false,
                        bell: false,
                        imageSub: "",
                        senderName: "",
                        addfiend: true,
                    },
                });

                return;
            }

            const existingByEmail = await findDirectChatByOtherMemberEmail(user.uid, normalizedSearchTerm);

            if (isCancelled) {
                return;
            }

            if (existingByEmail?.chatId) {
                const existingDirectChat = current.find((item) => item.id === existingByEmail.chatId);
                const fallbackTargetUser = existingByEmail.targetUser || {};

                setDirectSearchItem({
                    mode: "existing",
                    item: existingDirectChat || {
                        id: existingByEmail.chatId,
                        images: [fallbackTargetUser.avatar || fallbackTargetUser.avatarUrl || fallbackTargetUser.photoURL || ""].filter(Boolean),
                        user: fallbackTargetUser.name || fallbackTargetUser.displayName || fallbackTargetUser.email || normalizedSearchTerm,
                        senderName: "",
                        content: "Nhấn để mở đoạn chat",
                        time: new Date(),
                        check: true,
                        bell: false,
                        imageSub: "",
                    },
                });

                if (chatId !== existingByEmail.chatId) {
                    setIsActive(existingByEmail.chatId);
                    navigate(`/dashboard/${existingByEmail.chatId}`, { replace: true });
                }
                return;
            }

            setDirectSearchItem(null);
        }

        resolveExactEmailSearch().catch(() => {
            if (!isCancelled) {
                setDirectSearchItem(null);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [searchTerm, user?.uid, current, chatId, navigate]);

    const handleOpenOrCreateDirectChat = async (targetUser) => {
        if (!user?.uid || !targetUser?.uid || isCreatingDirectChat) {
            return;
        }

        setIsCreatingDirectChat(true);

        try {
            const chatIdResult = await createOrOpenDirectChat({
                currentUser: user,
                targetUser,
            });

            if (!chatIdResult) {
                return;
            }

            setIsActive(chatIdResult);
            navigate(`/dashboard/${chatIdResult}`, { replace: true });
            setSearchTerm("");
            setDirectSearchItem(null);
        } finally {
            setIsCreatingDirectChat(false);
        }
    };

    const isExactEmailSearch = emailPattern.test(searchTerm.trim().toLowerCase());
    const filteredChats = isExactEmailSearch
        ? (directSearchItem ? [directSearchItem.item] : [])
        : current.filter((item) => 
            item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
                {filteredChats.length == 0 ? 
                <div className={cx("no-results")}>Không có đoạn chat nào</div>
                : filteredChats
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
                        addfiend={Boolean(isExactEmailSearch && directSearchItem?.mode === "create")}
                        onBack={
                            isExactEmailSearch && directSearchItem?.mode === "create"
                                ? () => handleOpenOrCreateDirectChat(directSearchItem.targetUser)
                                : undefined
                        }
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