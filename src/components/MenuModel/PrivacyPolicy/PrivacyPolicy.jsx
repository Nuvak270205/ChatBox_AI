import React from 'react';
import classNames from 'classnames/bind';
import { Database, ShieldCheck } from 'lucide-react';
import styles from './PrivacyPolicy.module.scss';

const cx = classNames.bind(styles);

function PrivacyPolicy() {
  const rows = [
    ['Thông tin tài khoản', 'Xác thực và bảo mật'],
    ['Dữ liệu sử dụng', 'Tối ưu trải nghiệm'],
    ['Dữ liệu thiết bị', 'Phát hiện bất thường'],
  ];

  return (
    <div className={cx('policy')}>
      <div className={cx('head')}>
        <h2>Chính sách quyền riêng tư</h2>
        <p>Minh bạch cách thu thập, sử dụng và bảo vệ dữ liệu của bạn.</p>
      </div>

      <div className={cx('table')}>
        <div className={cx('row', 'header-row')}>
          <span><Database /> Loại dữ liệu</span>
          <span><ShieldCheck /> Mục đích</span>
        </div>
        {rows.map((row) => (
          <div className={cx('row')} key={row[0]}>
            <span>{row[0]}</span>
            <span>{row[1]}</span>
          </div>
        ))}
      </div>

      <div className={cx('foot')}>
        <button type="button">Yêu cầu xóa dữ liệu</button>
        <button type="button">Tải bản sao dữ liệu</button>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
