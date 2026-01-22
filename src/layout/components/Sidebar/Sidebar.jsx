import classNames from "classnames/bind";
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { menuGroups, menuItems, userMenu } from "~/data";
import MenuItem from "~/components/MenuItem/index.jsx";
import {ProfileItem, ProfileItemWithRef} from "~/components/ProfileItem/index.jsx";
import Menu from '~/components/Poper/Menu/index.jsx';
import { PanelLeftClose } from "lucide-react";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

function Sidebar({ className }) {
  const [activeIndexMenu, setActiveIndexMenu] = useState(0);
  const [show, setShow] = useState(false);
  const [levelhigh, setLevelhigh] = useState(false);
  const [activeIndexGroup, setActiveIndexGroup] = useState(-1);
  const profileRef = useRef(null);

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

  const handClickLevelHigh = useCallback(() => {
    setLevelhigh((prev) => !prev);
  }, []);

  return (
    <div className={cx("sidebar", { [className]: className, levelhigh: levelhigh })}>
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
          levelhigh={levelhigh}
        />
        ))}
        <MenuItem line title={"cộng đồng"} levelhigh={levelhigh}/>
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
            levelhigh={levelhigh}
          />
        ))}
      </div>
      <div className={cx("profile", { levelhigh: levelhigh })}>
        <Menu
          item={userMenu}
          onClick={() => setShow(!show)}
          show={show}
          onBack={() => {
            setShow(false);
          }}
        >
          <ProfileItemWithRef
            innerRef={profileRef}
            image="https://res.cloudinary.com/dpnza0kof/image/upload/v1761197706/vtdgumwes11xmnsxgt1u.jpg"
            icon="user"
            onClick={() => setShow(!show)}
            name="Marissa Nguyen"
            subname="marissa.nguyen090978"
            levelhigh={levelhigh}
          />
        </Menu>
        <ProfileItem
          icon={PanelLeftClose}
          onClick={handClickLevelHigh}
        />
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
