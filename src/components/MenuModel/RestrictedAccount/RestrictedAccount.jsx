import React from 'react';
import classNames from 'classnames/bind';
import { ShieldBan, CircleAlert, UserX } from 'lucide-react';
import styles from './RestrictedAccount.module.scss';

const cx = classNames.bind(styles);

function RestrictedAccount() {
  const accounts = [
    { name: 'alex.nguyen', reason: 'Spam liên tiếp', date: '2 ngày trước' },
    { name: 'hannah.lim', reason: 'Nội dung gây rối', date: '1 tuần trước' },
    { name: 'user_8891', reason: 'Gửi link nghi ngờ', date: '3 tuần trước' },
  ];

  return (
    <div className={cx('restricted')}>
      <div className={cx('header')}>
        <span><ShieldBan /> Bảo vệ tài khoản</span>
        <h2>Tài khoản đã hạn chế</h2>
        <p>Những tài khoản này không thể nhắn tin, gọi hoặc tìm thấy bạn trong Messenger.</p>
      </div>

      <div className={cx('warning')}>
        <CircleAlert />
        <p>Bạn có thể gỡ hạn chế bất kỳ lúc nào nếu không còn cần chặn.</p>
      </div>

      <div className={cx('list')}>
        {accounts.map((item) => (
          <div className={cx('item')} key={item.name}>
            <div className={cx('avatar')}><UserX /></div>
            <div className={cx('meta')}>
              <h4>{item.name}</h4>
              <p>{item.reason}</p>
            </div>
            <span>{item.date}</span>
          </div>
        ))}
      </div>

      <div className={cx('actions')}>
        <button type="button">Thêm hạn chế</button>
        <button type="button">Quản lý danh sách</button>
      </div>
    </div>
  );
}

export default RestrictedAccount;
