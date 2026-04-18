import classNames from 'classnames/bind';
import React, {useEffect, useMemo} from 'react';
import Tippy from "@tippyjs/react";
import Image from '~/components/Image/index.jsx';
import 'tippy.js/dist/tippy.css';
import PropTypes from 'prop-types';
import {ArrowDownRight, ArrowUpLeft, EllipsisVertical, Laugh, MessageSquareShare, File, Paperclip, CornerDownLeft, Download} from 'lucide-react';
import { downloadFileFromUrl } from '~/utils/download.js';
import styles from './ChatBox.module.scss';
const cx = classNames.bind(styles);

function formatFileSize(sizeInBytes) {
    if (!sizeInBytes || Number.isNaN(Number(sizeInBytes))) {
        return "0 KB";
    }

    const size = Number(sizeInBytes);

    if (size < 1024 * 1024) {
        return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function ChatBox({ className, id, time, name, content, content_image, titlefile, sizefile, arrUser = [], status = null, left, normal, right, first, center, last, image, rep, rep_name, rep_content, Rep_Icon, rep_image, rep_file, forward, group, Icon, onClick }) {
    const ReplyIconComponent = Rep_Icon || MessageSquareShare;

    const handleDownloadFile = async (event) => {
        event.preventDefault();
        await downloadFileFromUrl(content_image, titlefile || "download");
    };

    const formattedTime = useMemo(() => {
        if (!time) return "";

        const date = new Date(time);
        const now = new Date();

        const diffMs = now - date;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        const timeStr = date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (diffDays < 7) {
            const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
            return `${timeStr} ${weekDays[date.getDay()]}`;
        }

        return `${timeStr} ${date.toLocaleDateString("vi-VN")}`;
    }, [time]);
    
    return (
        <div className={cx('chat-box', { 
            [className]: className,
            left,
            right,
            first,
            center,
            last
         })}>
            <div className={cx('chat-header')}>
                {left && (group || rep || forward) && (Icon || first || rep || forward || normal) && (
                    <div className={cx('info')}>
                        <div className={cx('name')}>
                            {rep ? (
                                <>
                                    <ArrowDownRight />
                                    {` ${name} đã trả lời tin nhắn của ${rep_name}`}
                                </>
                            ) : forward ? (
                                <>
                                    <ArrowUpLeft />
                                    {`${name} đã chuyển tiếp tin nhắn`}
                                </>
                            ) : (
                                name
                            )}
                        </div>
                    </div>
                )}
                {right ?
                   forward || rep ?
                        <div className={cx('info')}>
                            <div className={cx('name', {rep, forward})}>{
                                rep ? <><ArrowDownRight />   {`Ban đã trả lời tin nhắn của ${rep_name}`}</> :
                                forward ? <><ArrowUpLeft />   {` ${name} đã chuyển tiếp tin nhắn`}</> :
                                name
                            }</div>
                        </div>
                    : null
                : null
                }
            </div>
            {
                rep ?
                    (<div className={cx('reply')}>
                        <div className={cx('reply-box', {rep_image, rep_file})}>
                            {rep_content ? rep_content : rep_file ? (
                                <div className={cx('file')}>
                                   File đính kèm 
                                   <Paperclip />
                                </div>
                            ) : rep_image ? <img src={rep_image} alt="image" /> : <ReplyIconComponent className={cx({right})} />}
                        </div>
                    </div>)
                : null
            }
            <div className={cx('chat-content', { Icon })}>
                {
                    left ?
                        !center && !first ?
                        (<div className={cx('avatar')}>
                            <Image src={image} alt="Avatar" />
                        </div>) : 
                        (
                            <div className={cx('box')}>
                                
                            </div>
                        )
                    : (
                        null
                    )
                }
                <div className={cx('function')}>
                    <Tippy
                        content={"Xem thêm"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div className={cx('icon')}>
                            <EllipsisVertical />
                        </div>
                    </Tippy>
                    <Tippy
                        content={"Cảm xúc"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div className={cx('icon')}>
                            <Laugh />
                        </div>
                    </Tippy>
                    <Tippy
                        content={"Trả lời"}
                        placement="top"
                        delay={[300, 0]}
                        interactive={true}
                    >
                        <div className={cx('icon')} onClick={() => onClick(id)}>
                            <CornerDownLeft />
                        </div>
                    </Tippy>
                </div>
                <Tippy
                    content={formattedTime}
                    placement={"left"}
                    delay={[300, 0]}
                    interactive={true}
                >
                    <div className={cx('text', { first, center, last, forward, Icon, content_image, titlefile})}>{
                        titlefile ? 
                            (<div className={cx('file')}>
                                <div className={cx('file-icon')}>
                                    <File />
                                </div>
                                <div className={cx('file-info')}>
                                    <div className={cx('file-name')}>{titlefile}</div>
                                    <div className={cx('file-size')}>{formatFileSize(sizefile)}</div>
                                </div>
                                {content_image ? (
                                    <button
                                        type="button"
                                        style={{padding:"0px", margin:"0px", border:"none"}}
                                        className={cx('file-download')}
                                        aria-label={`Tai xuong ${titlefile || "file"}`}
                                        onClick={handleDownloadFile}
                                    >
                                        <Download />
                                    </button>
                                ) : null}
                            </div>)
                         :
                        Icon ? <Icon /> : content_image ? <Image src={content_image} alt="Content Image" /> : content
                    }</div>
                </Tippy>
            </div>
            <div className={cx('chat-footer')}>
                {((status || arrUser.length > 0) && right) ? 
                arrUser.length === 0 ? 
                (
                    <div className={cx('status')}>{status}</div>
                ) : (
                    <div className={cx('users')}>
                        {arrUser.map((user, index) => (
                            <span key={index} className={cx('user')}>
                                <Image src={user} alt={user} />
                            </span>
                        ))}
                    </div>
                ) :
                null}
            </div>
            {first || center ? null : <div className={cx('line')}></div>}
        </div>
    );
}
ChatBox.propTypes = {
    className: PropTypes.string,
    id: PropTypes.number,
    time: PropTypes.string,
    content: PropTypes.string,
    content_image: PropTypes.string,
    titlefile: PropTypes.string,
    sizefile: PropTypes.number,
    arrUser: PropTypes.array,
    status: PropTypes.string,
    left: PropTypes.bool,
    right: PropTypes.bool,
    normal: PropTypes.bool,
    first: PropTypes.bool,
    center: PropTypes.bool,
    last: PropTypes.bool,
    image: PropTypes.string,
    name: PropTypes.string,
    rep: PropTypes.bool,
    rep_name: PropTypes.string,
    rep_content: PropTypes.string,
    Rep_Icon: PropTypes.elementType,
    rep_image: PropTypes.string,
    group: PropTypes.bool,
    forward: PropTypes.bool,
    Icon: PropTypes.elementType,
    onClick: PropTypes.func,
};

export default ChatBox;