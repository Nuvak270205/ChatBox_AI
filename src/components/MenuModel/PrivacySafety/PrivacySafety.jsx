import React from 'react';
import classNames from 'classnames/bind';
import { LockKeyhole, EyeOff, PhoneOff } from 'lucide-react';
import styles from './PrivacySafety.module.scss';

const cx = classNames.bind(styles);

function PrivacySafety() {
  return (
    <div className={cx('privacy')}>
      <div className={cx('header')}>
        <span><LockKeyhole /> Privacy hub</span>
        <h2>Quyền riêng tư và an toàn</h2>
        <p>Kiểm soát cách người khác tìm thấy bạn và tương tác với bạn trên Messenger.</p>
      </div>

      <div className={cx('settings')}>
        <label>
          <div>
            <h4>Ẩn trạng thái hoạt động</h4>
            <p>Người khác sẽ không thấy bạn đang online.</p>
          </div>
          <input type="checkbox" />
        </label>
        <label>
          <div>
            <h4>Tắt cuộc gọi từ người lạ</h4>
            <p>Chỉ cho phép cuộc gọi từ người trong danh bạ.</p>
          </div>
          <input type="checkbox" defaultChecked />
        </label>
        <label>
          <div>
            <h4>Cảnh báo liên kết nghi ngờ</h4>
            <p>Hiện cảnh báo trước khi mở liên kết không an toàn.</p>
          </div>
          <input type="checkbox" defaultChecked />
        </label>
      </div>

      <div className={cx('chips')}>
        <span><EyeOff /> Visibility</span>
        <span><PhoneOff /> Calls</span>
        <span><LockKeyhole /> Security</span>
      </div>
    </div>
  );
}

export default PrivacySafety;
