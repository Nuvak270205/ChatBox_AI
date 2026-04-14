import React from 'react';
import classNames from 'classnames/bind';
import { Ear, Type, CircleGauge } from 'lucide-react';
import styles from './Accessibility.module.scss';

const cx = classNames.bind(styles);

function Accessibility() {
  return (
    <div className={cx('access')}>
      <div className={cx('hero')}>
        <h2>Trợ năng</h2>
        <p>Tùy biến giao diện để nhìn rõ hơn, dễ đọc hơn và dễ tập trung hơn.</p>
      </div>

      <div className={cx('grid')}>
        <div className={cx('card')}>
          <Type />
          <h4>Cỡ chữ</h4>
          <p>Kích thước hiện tại: Vừa</p>
          <div className={cx('bar')}><span style={{ width: '58%' }}></span></div>
        </div>
        <div className={cx('card')}>
          <CircleGauge />
          <h4>Tương phản cao</h4>
          <p>Tăng độ tương phản cho các nút và văn bản.</p>
          <button type="button">Bật ngay</button>
        </div>
        <div className={cx('card')}>
          <Ear />
          <h4>Thông báo âm thanh</h4>
          <p>Phản hồi âm thanh cho sự kiện quan trọng.</p>
          <button type="button">Tùy chỉnh</button>
        </div>
      </div>
    </div>
  );
}

export default Accessibility;
