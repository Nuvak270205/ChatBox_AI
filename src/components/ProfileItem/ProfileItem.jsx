import classNames from "classnames/bind";
import React from "react";
import PropTypes from "prop-types";
import styles from "./ProfileItem.module.scss";

const cx = classNames.bind(styles);

function ProfileItem({ image, icon: Icon, name, subname, levelhigh, className, onClick, innerRef, ...rest }) {

  return (
    <div
      ref={innerRef}
      className={cx("profile-item", { [className]: className, levelhigh })}
      onClick={onClick}
      {...rest}
    >
      {image ? (
          <img src={image} alt="profile-image" />
      ) : (
        <div className={cx("profile-icon")}>
          {Icon && <Icon className={cx("icon")} />}
        </div>
      )}
      {levelhigh && (
            <div className={cx("profile-info")}>
              <span className={cx("profile-name")}>{name}</span>
              <span className={cx("profile-subname")}>{subname}</span>
            </div>
          )}
    </div>
  );
}

ProfileItem.propTypes = {
  image: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  name: PropTypes.string,
  subname: PropTypes.string,
  levelhigh: PropTypes.bool,
  onClick: PropTypes.func,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
};

export default ProfileItem;
