import classNames from "classnames/bind";
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuthUser } from "~/store/authSlice";
import { userMenu, menuItems} from "~/data";
import MenuItem from "~/components/MenuItem/index.jsx";
import {ProfileItem, ProfileItemWithRef} from "~/components/ProfileItem/index.jsx";
import Menu from '~/components/Poper/Menu/index.jsx';
import * as Icons from "lucide-react";
const iconMap = Icons;
import styles from "./Sidebar.module.scss";
import MenuModel from "~/components/MenuModel";
import { getUserGroups } from "~/services/group";
import { logout } from "~/services/auth";

const cx = classNames.bind(styles);
const modalTypes = new Set([
  "setting",
  "update-username",
  "restricted-account",
  "privacy-and-safety",
  "accessibility",
  "family-center",
  "help",
  "terms",
  "privacy-policy",
  "cookie-policy",
]);

function Sidebar({ className }) {
  const [activeIndexMenu, setActiveIndexMenu] = useState(0);
  const [show, setShow] = useState(false);
  const [levelhigh, setLevelhigh] = useState(false);
  const [activeIndexGroup, setActiveIndexGroup] = useState(-1);
  const [groups, setGroups] = useState([]);
  const [showModel, setShowModel] = useState(null);
  const profileRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImage = user?.avatar || user?.avatarUrl || user?.photoURL || "";
  const profileName = user?.name || user?.displayName || "User";
  const profileUsername = user?.username || user?.email?.split("@")[0] || "";

  useEffect(() => {
    let isMounted = true;

    async function loadGroups() {
      if (!user?.uid) {
        setGroups([]);
        return;
      }

      try {
        const userGroups = await getUserGroups(user.uid);

        if (isMounted) {
          setGroups(userGroups);
        }
      } catch (error) {
        console.error("[Sidebar] Load groups failed:", error);
        if (isMounted) {
          setGroups([]);
        }
      }
    }

    loadGroups();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

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

  const handleClickShowModel = useCallback((value) => {
    if (value === "logout") {
      logout();
      dispatch(clearAuthUser());
      setShow(false);
      navigate("/login");
      return;
    }

    if (!modalTypes.has(value)) {
      return;
    }

    setShowModel(value);
  }, [dispatch, navigate]);

  return (
    <div className={cx("sidebar", { [className]: className, levelhigh: levelhigh })}>
        {showModel && <MenuModel type={showModel} onClose={() => setShowModel(null)} />}
      <div className={cx("menu")}>
        {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          to={item.to}
          icon={iconMap[item.icon]}
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
        {groups.map((item, index) => (
          <MenuItem
            key={item.id_G}
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
          onHandleShowModel={handleClickShowModel}
          onClick={() => setShow(!show)}
          show={show}
          onBack={() => {
            setShow(false);
          }}
        >
          <ProfileItemWithRef
            ref={profileRef}
            image={profileImage}
            icon={iconMap.User}
            onClick={() => setShow(!show)}
            name={profileName}
            subname={profileUsername}
            levelhigh={levelhigh}
          />
        </Menu>
        
        <ProfileItem
          icon={iconMap["PanelLeftClose"]}
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
