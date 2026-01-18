import classNames from "classnames/bind";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { menuGroups, menuItems } from "~/data";
import MenuItem from "~/components/MenuItem/index.jsx";
import ProfileItem from "~/components/ProfileItem/index.jsx";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

function Sidebar({ className }) {
  const [activeIndexMenu, setActiveIndexMenu] = useState(0);
  const [activeIndexGroup, setActiveIndexGroup] = useState(-1);

  useEffect(() => {
    function handleBorder(){
      const sidebar_menu = document.querySelector(`.${cx("menu")}`);
      if(sidebar_menu.scrollTop > 0){
        sidebar_menu.style.borderTop = "2px solid rgba(0, 0, 0, 0.05)";
      }else{
        sidebar_menu.style.borderTop = "none";
      }

      if((Math.ceil(sidebar_menu.scrollTop) >= (sidebar_menu.scrollHeight - sidebar_menu.clientHeight))){
        sidebar_menu.style.borderBottom = "none";
      }else{
        sidebar_menu.style.borderBottom = "2px solid rgba(0, 0, 0, 0.05)";
      }
    }

    const sidebar_menu = document.querySelector(`.${cx("menu")}`);
    sidebar_menu.addEventListener("scroll", handleBorder);

    return () => {
      sidebar_menu.removeEventListener("scroll", handleBorder);
    };
  }, [])


  return (
    <div className={cx("sidebar", { [className]: className })}>
      <div className={cx("menu")}>
        {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          to={item.to}
          icon={item.icon}
          active={activeIndexMenu === index}
          onClick={() => {
            setActiveIndexMenu(index);
            setActiveIndexGroup(-1);
          }}
          title={item.title}
        />
        ))}
        <MenuItem line/>
        {menuGroups.map((item, index) => (
          <MenuItem
            key={index}
            to={item.to + `/${item.id_G}`}
            image={item.image}
            active={activeIndexGroup === index}
            onClick={() => {
              setActiveIndexGroup(index);
              setActiveIndexMenu(-1);
            }}
            title={item.title}
          />
        ))}
      </div>
      <div className={cx("profile")}>
        <ProfileItem
          image="https://res.cloudinary.com/dpnza0kof/image/upload/v1761197706/vtdgumwes11xmnsxgt1u.jpg"
          icon="user"
        />
        <ProfileItem
          icon="panel-left-close"
        />
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
