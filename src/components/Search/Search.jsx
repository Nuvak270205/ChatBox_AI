import classNames from "classnames/bind";
import React, {useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Search.module.scss";
const cx = classNames.bind(styles);

function Search({ className, titile, value, onChange, onFocus, onBlur, isFocused }) {

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }       
    }, []);
    return (
        <div className={cx("search", { [className]: className, focused: isFocused })}>
            <i className={cx("icon")} data-lucide="search"></i>
            <input
                type="text"
                placeholder={titile || "Tìm kiếm"}
                onFocus={onFocus}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

Search.propTypes = {
    className: PropTypes.string,
    titile: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
};

export default Search;
