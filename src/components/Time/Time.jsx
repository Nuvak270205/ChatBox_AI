import classNames from "classnames/bind";
import React, {useRef, useEffect} from "react";
import PropTypes from "prop-types";
import styles from "./Time.module.scss";

const cx = classNames.bind(styles);

function Time({ date, className }) {
    const timeRef = useRef();
    useEffect(() => {
        if (timeRef.current) {
            function formatTime(dateStr) {
                const date = new Date(dateStr);
                const now = new Date();

                const diffMs = now - date;
                const diffDays = diffMs / (1000 * 60 * 60 * 24);

                const time = date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                if (diffDays < 7) {
                    const day = date.getDay(); 
                    const weekDays = [
                        "CN",
                        "T2", 
                        "T3",
                        "T4",
                        "T5",
                        "T6",
                        "T7"
                    ];

                    return `${time} ${weekDays[day]}`;
                }

                return `${time} ${date.toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}`;
            }
            timeRef.current.innerText = formatTime(date);
        }
    }, [date]);
    return (
        <div className={cx("time", className)}>
            <div ref={timeRef} className={cx("time-content")}>

            </div>
        </div>
    )
}

Time.propTypes = {
    date: PropTypes.string.isRequired,
    className: PropTypes.string,
}

export default Time;