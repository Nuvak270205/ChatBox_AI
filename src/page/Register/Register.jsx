import classNames from "classnames/bind";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";

import styles from "./Register.module.scss";
import Button from "../../components/Button";
import { register } from "~/services/auth";
import { setAuthUser } from "~/store/authSlice";

const cx = classNames.bind(styles);

function Register({ className }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const authResult = await register({ name, email, password });
            dispatch(setAuthUser(authResult));
            navigate("/dashboard");
        } catch (registerError) {
            setError(registerError?.message || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx("register", { [className]: className })}>
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
                    Đăng Ký
                </motion.h2>
                {error && (
                    <motion.p
                        className={cx("error")}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: "#ff6b6b", marginBottom: 16, textAlign: "center" }}
                    >
                        {error}
                    </motion.p>
                )}
                <form onSubmit={handleSubmit} className={cx("form")}>
                    <motion.div
                        className={cx("input-group")}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <label htmlFor="name" className={cx("label")}>
                            <User size={18} className={cx("icon")} />
                            Tên
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cx("input")}
                            placeholder="Nhập tên của bạn"
                            required
                        />
                    </motion.div>
                    <motion.div
                        className={cx("input-group")}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
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
                        transition={{ delay: 0.5, duration: 0.5 }}
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
                        className={cx("input-group")}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <label htmlFor="confirmPassword" className={cx("label")}>
                            <Lock size={18} className={cx("icon")} />
                            Xác Nhận Mật Khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cx("input")}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <Button primary large className={cx("submit-btn")} disablesd={loading}>
                            <UserPlus size={18} className={cx("btn-icon")} />
                            {loading ? "Đang đăng ký..." : "Đăng Ký"}
                        </Button>
                    </motion.div>
                </form>
                <motion.div
                    className={cx("links")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Link to="/login" className={cx("link")}>Đã có tài khoản? Đăng nhập</Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Register;

Register.propTypes = {
    className: PropTypes.string,
};