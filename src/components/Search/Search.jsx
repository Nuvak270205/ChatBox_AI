import classNames from "classnames/bind";
import React from "react";
import PropTypes from "prop-types";
import { Search as SearchChat } from "lucide-react";
import styles from "./Search.module.scss";
const cx = classNames.bind(styles);

function Search({ className, titile, value, onChange, onFocus, onBlur, isFocused }) {

    return (
        <div className={cx("search", { [className]: className, focused: isFocused })}>
            <SearchChat className={cx("icon")} />
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
