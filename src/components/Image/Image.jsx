import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./Image.module.scss";
import images from "~/assets";

const cx = classNames.bind(styles);

function Image({ src, alt, className, fallback = images.noImage, ref, ...props }) {
    const [hasError, setHasError] = useState(false);
    return (
        <img
            className={cx("wrapper", { [className]: className })}
            src={hasError ? fallback : src}
            ref={ref}
            alt={alt}
            onError={() => setHasError(true)}
            {...props}
        />
    );
}

Image.propTypes = {
    src: PropTypes.string,
    ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
};

export default Image;
