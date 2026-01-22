import classNames from "classnames/bind";
import PropTypes from "prop-types";
import React, {useState} from "react";
import Image from "~/components/Image/index.jsx";
import Button from "~/components/Button/index.jsx";
import {arrContent, infor, InforItem} from "~/data";
import { ChevronRight, ChevronDown, ChevronLeft, Lock, Facebook, Bell, Search} from "lucide-react";
import styles from "./Information.module.scss";

const cx = classNames.bind(styles);


function Information({className}) {
    const [result, setResult] = useState(InforItem);
    const [page, setPage] = useState([]);
    return (
        <div className={cx("information", {
            [className]: className
            })}>
            {
                page.length == 0 ?
                    (<div className={cx("information--content")}>
                        <div className={cx("information--image")}>
                            <div className={cx("image--wrapper")}>
                                <Image src={arrContent[0].image} alt="information" />
                            </div>
                        </div>
                        <div className={cx("information--text")}>
                            <h3 className={cx("information--name")}>{infor.name}</h3>
                            <p className={cx("information--subname")}>{infor.subname}</p>
                        </div>
                        <div className={cx("information--notification")}>
                            <div className={cx("notification--text")}>
                                <Lock />
                                <span>Được mã hóa đầu cuối</span>
                            </div>
                        </div>
                        <div className={cx("information--icon")}>
                            <div className={cx("icon--item")}>
                                <div className={cx("icon")}>
                                    <Facebook />
                                </div>
                                <span>Trang cá nhân</span>
                            </div>
                            <div className={cx("icon--item")}>
                                <div className={cx("icon")}>
                                    <Bell />
                                </div>
                                <span>Thông báo</span>
                            </div>
                            <div className={cx("icon--item")}>
                                <div className={cx("icon")}>
                                    <Search />
                                </div>
                                <span>Tìm kiếm</span>
                            </div>
                        </div>
                    </div>
                    ) : (
                    <div className={cx("information--header")}>
                        <button 
                            className={cx('back-btn')} 
                            onClick={() => setPage([])}
                        >
                            <ChevronLeft />
                        </button>
                        <h4 className={cx('header-title')}>{page[page.length - 1].title}</h4>
                    </div>
                    )
            }
            <div className={cx("information__list-functions")}>
                {page.length === 0 ? result.map((item, index) => (
                    <div key={index}>
                        <Button key={`btn-${index}`} rightIcon={item.right_icon} className={cx("information__function-item")} onClick={() => {
                            console.log("clicked");
                            item.right_icon === ChevronRight ? 
                            setResult(prev => prev.map((infor, idx) => {
                                if (index === idx) {
                                    return {
                                        ...infor,
                                        right_icon: ChevronDown,
                                    }
                                }
                                return infor;
                            })) : 
                            setResult(prev => prev.map((infor, idx) => {
                                if (index === idx) {
                                    return {
                                        ...infor,
                                        right_icon: ChevronRight,
                                    }
                                }
                                return infor;
                            }));
                        }}>
                            {item.title}
                        </Button>
                        {
                            item.right_icon !== ChevronRight ? 
                                item.children.map((child, idx) => (
                                    <Button 
                                        key={`${index}-${idx}`} 
                                        leftIcon={child.left_icon} 
                                        className={cx("information__function-item")}
                                        onClick={() =>{
                                            if(child.type === 'page'){
                                                console.log("page clicked");
                                                setPage(prev => [...prev, child]);
                                            }
                                        }}
                                    >
                                        {child.title}
                                    </Button>
                                )) : null
                        }
                    </div>
                )) : null}
            </div>
        </div>
    );
}

Information.propTypes = {
    className: PropTypes.string,
};

export default Information;