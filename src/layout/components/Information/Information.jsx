import classNames from "classnames/bind";
import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, getDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "~/config";
import Image from "~/components/Image/index.jsx";
import Button from "~/components/Button/index.jsx";
import { InforItem } from "~/data";
import { ChevronRight, ChevronDown, ChevronLeft, Lock, Facebook, Bell, BellOff, Search, Download} from "lucide-react";
import styles from "./Information.module.scss";

const cx = classNames.bind(styles);

async function fetchUserDetailsMap(userIds) {
    if (!userIds || userIds.length === 0) {
        return {};
    }

    const userDetailsMap = {};

    await Promise.all(userIds.map(async (userId) => {
        try {
            const userSnap = await getDoc(doc(db, "users", userId));

            if (userSnap.exists()) {
                userDetailsMap[userId] = userSnap.data();
            }
        } catch (error) {
            // Ignore missing users here.
        }
    }));

    return userDetailsMap;
}

function mergeMemberInfo(cachedMemberInfo, freshUserData) {
    const merged = { ...cachedMemberInfo };

    Object.entries(freshUserData).forEach(([userId, userData]) => {
        merged[userId] = {
            ...merged[userId],
            name: userData.name || userData.displayName || merged[userId]?.name || userId,
            avatar: userData.avatar || userData.avatarUrl || userData.photoURL || merged[userId]?.avatar || "",
            displayName: userData.displayName || merged[userId]?.displayName,
        };
    });

    return merged;
}

function buildCurrentUserMemberInfo(existingMemberInfo, userData, userId, userProfile) {
    const currentMemberInfo = existingMemberInfo?.[userId] || {};

    return {
        ...currentMemberInfo,
        name: userData?.name || userData?.displayName || currentMemberInfo.name || userProfile?.displayName || userProfile?.name || userId,
        avatar: userData?.avatar || userData?.avatarUrl || userData?.photoURL || currentMemberInfo.avatar || userProfile?.avatar || userProfile?.avatarUrl || userProfile?.photoURL || "",
        displayName: userData?.displayName || currentMemberInfo.displayName || userProfile?.displayName || "",
    };
}


function Information({className}) {
    const user = useSelector((state) => state.auth.user);
    const [result, setResult] = useState(InforItem);
    const [page, setPage] = useState([]);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatInfo, setChatInfo] = useState(null);
    const { chatId } = useParams();

    useEffect(() => {
        if (!chatId) {
            setChatInfo(null);
            return;
        }

        const chatRef = doc(db, "chatbox", chatId);

        const unsubscribe = onSnapshot(chatRef, (chatSnapshot) => {
            if (!chatSnapshot.exists()) {
                setChatInfo(null);
                return;
            }

            const chatData = chatSnapshot.data();
            const memberInfo = chatData.memberInfo || {};
            const otherMembers = (chatData.members || []).filter((memberId) => memberId !== user?.uid);

            fetchUserDetailsMap(otherMembers).then((freshUserData) => {
                const enrichedMemberInfo = mergeMemberInfo(memberInfo, freshUserData);
                const currentUserInfo = buildCurrentUserMemberInfo(memberInfo, null, user?.uid, user);
                const existingCurrentUserInfo = memberInfo[user?.uid] || {};
                const shouldSyncCurrentUser =
                    existingCurrentUserInfo.name !== currentUserInfo.name ||
                    existingCurrentUserInfo.avatar !== currentUserInfo.avatar ||
                    existingCurrentUserInfo.displayName !== currentUserInfo.displayName;

                if (shouldSyncCurrentUser) {
                    updateDoc(chatRef, {
                        [`memberInfo.${user.uid}`]: currentUserInfo,
                    }).catch((error) => {
                        console.error("Failed to sync current user memberInfo:", error);
                    });
                }

                const isMuted = Boolean(enrichedMemberInfo[user?.uid]?.bell);
                const otherMemberNames = otherMembers
                    .map((memberId) => enrichedMemberInfo[memberId]?.name || enrichedMemberInfo[memberId]?.displayName || memberId)
                    .filter(Boolean);
                const otherMemberAvatars = otherMembers
                    .map((memberId) => enrichedMemberInfo[memberId]?.avatar || enrichedMemberInfo[memberId]?.avatarUrl || enrichedMemberInfo[memberId]?.photoURL || "")
                    .filter(Boolean);

                setChatInfo({
                    name: chatData.name || chatData.title || otherMemberNames.join(", ") || "Unknown",
                    subname: chatData.subname || chatData.description || (otherMemberNames.length > 1 ? `${otherMemberNames.length} thành viên` : (otherMemberNames[0] || "")),
                    images: otherMemberAvatars,
                    memberInfo: enrichedMemberInfo,
                    isMuted,
                });
            });
        });

        return unsubscribe;
    }, [chatId, user?.uid]);

    const handleToggleNotification = async () => {
        if (!chatId || !user?.uid) {
            return;
        }

        const nextMuted = !Boolean(chatInfo?.isMuted);

        setChatInfo((prev) => {
            if (!prev) {
                return prev;
            }

            return {
                ...prev,
                isMuted: nextMuted,
            };
        });

        try {
            const chatRef = doc(db, "chatbox", chatId);
            await updateDoc(chatRef, {
                [`memberInfo.${user.uid}.bell`]: nextMuted,
            });
        } catch (error) {
            console.error("Failed to toggle notification state:", error);
            setChatInfo((prev) => {
                if (!prev) {
                    return prev;
                }

                return {
                    ...prev,
                    isMuted: !nextMuted,
                };
            });
        }
    };

    // Fetch images and files from Firestore
    useEffect(() => {
        if (!chatId) return;

        const fetchMediaAndFiles = async () => {
            try {
                setLoading(true);
                const messagesQuery = query(
                    collection(db, "chatbox", chatId, "messages"),
                    orderBy("createAt", "desc"),
                    limit(500)
                );

                const messagesSnapshot = await getDocs(messagesQuery);
                const imageList = [];
                const fileList = [];

                messagesSnapshot.docs.forEach((doc) => {
                    const msgData = doc.data();
                    
                    // Lọc images
                    if (msgData.content_image && msgData.type !== "file") {
                        imageList.push({
                            id: doc.id,
                            url: msgData.content_image,
                            createAt: msgData.createAt,
                        });
                    }

                    // Lọc files
                    if (msgData.titlefile && msgData.type === "file") {
                        fileList.push({
                            id: doc.id,
                            name: msgData.titlefile,
                            url: msgData.content_image,
                            size: msgData.sizefile || 0,
                            createAt: msgData.createAt,
                        });
                    }
                });

                setImages(imageList);
                setFiles(fileList);
            } catch (error) {
                console.error("Failed to fetch media and files:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMediaAndFiles();
    }, [chatId]);

    const handlePageClick = (type) => {
        setPage([{ title: type === "image" ? "Hình ảnh" : "File", type }]);
    };

    const handleBackClick = () => {
        setPage([]);
    };

    return (
        <div className={cx("information", {
            [className]: className
            })}>
            {
                page.length == 0 ?
                    (<div className={cx("information--content")}>
                        <div className={cx("information--image")}>
                            <div className={cx("image--wrapper")}>
                                {chatInfo?.images?.length > 1 ? (
                                    chatInfo.images.slice(0, 2).map((image, index) => (
                                        <div key={index} className={cx("image--stack", `image--stack-${index}`)}>
                                            <Image src={image} alt={chatInfo.name} />
                                        </div>
                                    ))
                                ) : (
                                    <Image src={chatInfo?.images?.[0] || user?.avatar || user?.avatarUrl || user?.photoURL || ""} alt={chatInfo?.name || user?.name || user?.displayName || "information"} />
                                )}
                            </div>
                        </div>
                        <div className={cx("information--text")}>
                            <h3 className={cx("information--name")}>{chatInfo?.name || user?.name || user?.displayName || "User"}</h3>
                            <p className={cx("information--subname")}>{chatInfo?.subname || user?.username || user?.email?.split("@")[0] || ""}</p>
                        </div>
                        <div className={cx("information--notification")}>
                            <div className={cx("notification--text")}>
                                <Lock />
                                <span>Được mã hóa đầu cuối</span>
                            </div>
                        </div>
                        <div className={cx("information--icon")}>
                            <div className={cx("icon--item")}>
                                <div className={cx("icon")}>
                                    <Facebook />
                                </div>
                                <span>Trang cá nhân</span>
                            </div>
                            <div className={cx("icon--item")}>
                                <div className={cx("icon")} onClick={handleToggleNotification} role="button" tabIndex={0}>
                                    {chatInfo?.isMuted ? <BellOff /> : <Bell />}
                                </div>
                                <span>Thông báo</span>
                            </div>
                            <div className={cx("icon--item")}>
                                <div className={cx("icon")}>
                                    <Search />
                                </div>
                                <span>Tìm kiếm</span>
                            </div>
                        </div>
                    </div>
                    ) : (
                    <div className={cx("information--header")}>
                        <button 
                            className={cx('back-btn')} 
                            onClick={handleBackClick}
                        >
                            <ChevronLeft />
                        </button>
                        <h4 className={cx('header-title')}>{page[page.length - 1].title}</h4>
                    </div>
                    )
            }
            
            {/* Gallery for Images */}
            {page.length > 0 && page[page.length - 1].type === "image" && (
                <div className={cx("information__gallery")}>
                    {loading ? (
                        <div className={cx("loading")}>Đang tải...</div>
                    ) : images.length === 0 ? (
                        <div className={cx("empty")}>Không có hình ảnh nào</div>
                    ) : (
                        <div className={cx("gallery-grid")}>
                            {images.map((image) => (
                                <div key={image.id} className={cx("gallery-item")}>
                                    <img src={image.url} alt="gallery" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* List for Files */}
            {page.length > 0 && page[page.length - 1].type === "file" && (
                <div className={cx("information__file-list")}>
                    {loading ? (
                        <div className={cx("loading")}>Đang tải...</div>
                    ) : files.length === 0 ? (
                        <div className={cx("empty")}>Không có file nào</div>
                    ) : (
                        <div className={cx("file-items")}>
                            {files.map((file) => (
                                <div key={file.id} className={cx("file-item")}>
                                    <div className={cx("file-info")}>
                                        <div className={cx("file-icon")}>
                                            <Download size={20} />
                                        </div>
                                        <div className={cx("file-details")}>
                                            <p className={cx("file-name")}>{file.name}</p>
                                            <p className={cx("file-size")}>
                                                {file.size > 0 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <a 
                                        href={file.url} 
                                        download={file.name}
                                        className={cx("download-link")}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Tải xuống
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className={cx("information__list-functions")}>
                {page.length === 0 ? result.map((item, index) => (
                    <div key={index}>
                        <Button key={`btn-${index}`} rightIcon={item.right_icon} className={cx("information__function-item")} onClick={() => {
                            console.log("clicked");
                            item.right_icon === ChevronRight ? 
                            setResult(prev => prev.map((infor, idx) => {
                                if (index === idx) {
                                    return {
                                        ...infor,
                                        right_icon: ChevronDown,
                                    }
                                }
                                return infor;
                            })) : 
                            setResult(prev => prev.map((infor, idx) => {
                                if (index === idx) {
                                    return {
                                        ...infor,
                                        right_icon: ChevronRight,
                                    }
                                }
                                return infor;
                            }));
                        }}>
                            {item.title}
                        </Button>
                        {
                            item.right_icon !== ChevronRight ? 
                                item.children.map((child, idx) => (
                                    <Button 
                                        key={`${index}-${idx}`} 
                                        leftIcon={child.left_icon} 
                                        className={cx("information__function-item")}
                                        onClick={() =>{
                                            if(child.type === 'page'){
                                                console.log("page clicked");
                                                const pageType = child.title === "File phương tiện" ? "image" : "file";
                                                handlePageClick(pageType);
                                            }
                                        }}
                                    >
                                        {child.title}
                                    </Button>
                                )) : null
                        }
                    </div>
                )) : null}
            </div>
        </div>
    );
}

Information.propTypes = {
    className: PropTypes.string,
};

export default Information;