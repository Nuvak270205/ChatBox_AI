import classNames from "classnames/bind";
import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Image from "~/components/Image/index.jsx";
import Button from "~/components/Button/index.jsx";
import { InforItem } from "~/data";
import { ChevronRight, ChevronDown, ChevronLeft, Lock, Facebook, Bell, BellOff, Search, Download, File} from "lucide-react";
import {
    getInformationMediaAndFiles,
    listenToInformationChatInfo,
    toggleInformationNotification,
} from "~/services/information.js";
import { downloadFileFromUrl } from "~/utils/download.js";
import styles from "./Information.module.scss";

const cx = classNames.bind(styles);

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

        const unsubscribe = listenToInformationChatInfo({
            chatId,
            user,
            onUpdate: setChatInfo,
            onMissing: () => setChatInfo(null),
        });

        return unsubscribe;
    }, [chatId, user]);

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
            await toggleInformationNotification({
                chatId,
                userId: user.uid,
                muted: nextMuted,
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
                const result = await getInformationMediaAndFiles({ chatId });
                setImages(result.images);
                setFiles(result.files);
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

    const handleDownloadFile = async (event, fileUrl, fileName) => {
        event.preventDefault();
        await downloadFileFromUrl(fileUrl, fileName);
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
                                            <File size={20} />
                                        </div>
                                        <div className={cx("file-details")}>
                                            <p className={cx("file-name")}>{file.name}</p>
                                            <p className={cx("file-size")}>
                                                {file.size > 0 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={cx("download-link")}
                                        onClick={(event) => handleDownloadFile(event, file.url, file.name)}
                                        aria-label={`Tai xuong ${file.name}`}
                                    >
                                        <Download size={20} />
                                    </button>
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