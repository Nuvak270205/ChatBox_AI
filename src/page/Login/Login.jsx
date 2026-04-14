import classNames from "classnames/bind";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";

import styles from "./Login.module.scss";
import Button from "../../components/Button";

const cx = classNames.bind(styles);

function Login({ className }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login:", { email, password });
    };

    return (
        <div className={cx("login", { [className]: className })}>
            <motion.div
                className={cx("container")}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2
                    className={cx("title")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Đăng Nhập
                </motion.h2>
                <form onSubmit={handleSubmit} className={cx("form")}>
                    <motion.div
                        className={cx("input-group")}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <label htmlFor="email" className={cx("label")}>
                            <Mail size={18} className={cx("icon")} />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cx("input")}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </motion.div>
                    <motion.div
                        className={cx("input-group")}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <label htmlFor="password" className={cx("label")}>
                            <Lock size={18} className={cx("icon")} />
                            Mật Khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cx("input")}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Button primary large className={cx("submit-btn")}>
                            <LogIn size={18} className={cx("btn-icon")} />
                            Đăng Nhập
                        </Button>
                    </motion.div>
                </form>
                <motion.div
                    className={cx("links")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Link to="/register" className={cx("link")}>Chưa có tài khoản? Đăng ký</Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Login;

Login.propTypes = {
    className: PropTypes.string,
};