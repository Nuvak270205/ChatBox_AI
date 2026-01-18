import classNames from "classnames/bind";
import React, { useEffect } from "react";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import PropTypes from "prop-types";
import Image from "../Image/index.jsx";
import { useNavigateWithChatId } from "~/hook";
import styles from "./MenuItem.module.scss";

const cx = classNames.bind(styles);

function MenuItem({ icon, image, className, to, active = false, onClick, title, line, name }) {
    const go = useNavigateWithChatId();

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    const handleClick = () => {
        if (to) go(to); 
        if (onClick) onClick();
    }

    return (
        line ? (
            <div
                onClick={handleClick}
                className={cx("menu-item", {
                    [className]: className,
                    active: active
                })}
            >
                <div className={cx("link__line")}>
                    <span className={cx("line")}></span>
                </div>
            </div>
        ) : (
        <Tippy
            content={title}
            placement="right"
            delay={[300, 0]}
            interactive={true}
        >
            <div
                onClick={handleClick}
                className={cx("menu-item", {
                    [className]: className,
                    active: active,
                    name: name
                })}
            >
                {(icon || image) ? 
                    icon ? (
                        <div className={cx("link__icon")}>
                            {icon && <i className={cx("icon")} data-lucide={icon}></i>}
                        </div>
                    ) : (
                        <div className={cx("link__img")}>
                            {image && <Image className={cx("img")} src={image} alt="menu-image" />}
                        </div>
                    )
                    :
                    null
                }
                {
                    name && <div className={cx("name")}>{name}</div>
                }
            </div>
        </Tippy>
        )
    );
}

MenuItem.propTypes = {
    icon: PropTypes.string,
    className: PropTypes.string,
    to: PropTypes.string,
    onClick: PropTypes.func,
    image: PropTypes.string,
    title: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
};

export default MenuItem;
