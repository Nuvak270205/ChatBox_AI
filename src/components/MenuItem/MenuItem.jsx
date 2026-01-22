import classNames from "classnames/bind";
import React, { useEffect } from "react";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import PropTypes from "prop-types";
import Image from "../Image/index.jsx";
import { useNavigateWithChatId } from "~/hook";
import styles from "./MenuItem.module.scss";

const cx = classNames.bind(styles);

function MenuItem({ icon : Icon, image, className, to, active = false, onClick, title, line, levelhigh }) {
    const go = useNavigateWithChatId();

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
                    active: active,
                    levelhigh
                })}
            >
                <div className={cx("link__line")}>
                    {levelhigh ? (
                        <span className={cx("line-high")}>{title}</span>
                    ) : (
                        <span className={cx("line")}></span>
                    )}
                </div>

            </div>
        ) : (
            levelhigh ? (
                <div
                onClick={handleClick}
                className={cx("menu-item", {
                    [className]: className,
                    active: active,
                    levelhigh: levelhigh,
                })}
            >
                {(Icon || image) ? 
                    Icon ? (
                        <div className={cx("link__icon")}>
                            {Icon && <Icon className={cx("icon")}></Icon>}
                        </div>
                    ) : (
                        <div className={cx("link__img")}>
                            {image && <Image className={cx("img")} src={image} alt="menu-image" />}
                        </div>
                    )
                    :
                    null
                }
                <div className={cx("link__title")}>
                    {title}
                </div>
            </div>
            )
            :(
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
                {(Icon || image) ? 
                    Icon ? (
                        <div className={cx("link__icon")}>
                            {Icon && <Icon className={cx("icon")}></Icon>}
                        </div>
                    ) : (
                        <div className={cx("link__img")}>
                            {image && <Image className={cx("img")} src={image} alt="menu-image" />}
                        </div>
                    )
                    :
                    null
                }
            </div>
        </Tippy>)
        )
    );
}

MenuItem.propTypes = {
    icon: PropTypes.elementType,
    className: PropTypes.string,
    to: PropTypes.string,
    onClick: PropTypes.func,
    image: PropTypes.string,
    title: PropTypes.string,
    active: PropTypes.bool,
    line: PropTypes.bool,
    levelhigh: PropTypes.bool,
};

export default MenuItem;
