import React from 'react';
import classNames from 'classnames/bind';
import { FileText } from 'lucide-react';
import styles from './Terms.module.scss';

const cx = classNames.bind(styles);

function Terms() {
  return (
    <div className={cx('terms')}>
      <div className={cx('header')}>
        <FileText />
        <h2>Điều khoản sử dụng</h2>
      </div>

      <div className={cx('doc')}>
        <h4>1. Phạm vi áp dụng</h4>
        <p>Điều khoản này áp dụng cho tất cả tài khoản đang sử dụng Messenger.</p>

        <h4>2. Nội dung và hành vi</h4>
        <p>Không được đăng tải nội dung vi phạm pháp luật hoặc gây ảnh hưởng đến người khác.</p>

        <h4>3. Quyền và trách nhiệm</h4>
        <p>Bạn chịu trách nhiệm bảo mật tài khoản và thông tin đăng nhập của mình.</p>

        <h4>4. Cập nhật</h4>
        <p>Điều khoản có thể được cập nhật theo từng giai đoạn, vui lòng theo dõi thông báo mới.</p>
      </div>

      <button type="button">Đọc bản đầy đủ</button>
    </div>
  );
}

export default Terms;
