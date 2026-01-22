import classNames from "classnames/bind";
import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import GroupItem from "~/components/GroupItem/index.jsx";
import { groupItem } from "~/data";
import styles from "./Group.module.scss";

const cx = classNames.bind(styles);

function Group({ className }) {
    const { idGroup, chatId } = useParams();
    const groupItemData = groupItem.find(item => item.id === Number(idGroup));
    const [isActive, setIsActive] = useState(chatId ? Number(chatId) : null);
    useEffect(() => {
        const contentElement = document.querySelector(`.${cx("content")}`);
        function handBorderTopContent(){
            if(contentElement.scrollTop > 0){
                contentElement.style.borderTop = "2px solid rgba(0, 0, 0, 0.05)";
            }else{
                contentElement.style.borderTop = "none";
            }
    
        }
        contentElement.addEventListener("scroll", handBorderTopContent);
        return () => {
            contentElement.removeEventListener("scroll", handBorderTopContent);
        }
    }, []);

    return <div className={cx("group", {
        [className]: className
    })}>
        <div className={cx("header")}>
            <div className={cx("header-title")}>
                {groupItemData ? groupItemData.name : "Nhóm không tồn tại"}
            </div>
        </div>
        <div>
            <div className={cx("header-subtitle")}>
                {groupItemData.items.reduce((acc, item) => acc + item.number, 0)} thành viên
            </div>
        </div>
        <div className={cx("body")}>
            <div className={cx("content")}>
                {groupItemData.items.map((item) => (
                    <GroupItem
                        key={item.id}
                        id ={item.id}
                        image={item.image}
                        user={item.user}
                        number={item.number}
                        status={item.status}
                        onClick={() => setIsActive(item.id)}
                        active={isActive === item.id}
                    />
                ))}
            </div>
        </div> 
    </div>;
}

Group.propTypes = {
    className: PropTypes.string,
};

export default Group;