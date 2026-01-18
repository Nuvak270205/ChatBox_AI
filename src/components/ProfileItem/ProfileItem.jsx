import classNames from "classnames/bind";
import React, { useEffect} from "react";
import PropTypes from "prop-types";

import styles from "./ProfileItem.module.scss";

const cx = classNames.bind(styles);

function ProfileItem({ image, icon, className }) {

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

  return (
    <div className={cx("profile-item", { [className]: className })}>
      {image ? (
        <img src={image} alt="profile-image" />
      ) : (
        <div className={cx("profile-icon")}>
          <i data-lucide={icon} />
        </div>
      )}
    </div>
  );
}

ProfileItem.propTypes = {
  image: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ProfileItem;