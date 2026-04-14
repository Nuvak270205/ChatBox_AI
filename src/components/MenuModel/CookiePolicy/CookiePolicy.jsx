import React from 'react';
import classNames from 'classnames/bind';
import { Cookie, ChartBar } from 'lucide-react';
import styles from './CookiePolicy.module.scss';

const cx = classNames.bind(styles);

function CookiePolicy() {
  const items = [
    { title: 'Cần thiết', usage: '100%', active: true },
    { title: 'Phân tích', usage: '65%', active: true },
    { title: 'Cá nhân hóa', usage: '40%', active: false },
  ];

  return (
    <div className={cx('cookie')}>
      <div className={cx('hero')}>
        <h2>Chính sách cookie</h2>
        <p>Quản lý cách cookie được sử dụng để cải thiện hiệu suất và trải nghiệm.</p>
      </div>

      <div className={cx('list')}>
        {items.map((item) => (
          <div className={cx('item')} key={item.title}>
            <div className={cx('left')}>
              <h4><Cookie /> {item.title}</h4>
              <p>Mức sử dụng hiện tại: {item.usage}</p>
              <div className={cx('bar')}><span style={{ width: item.usage }}></span></div>
            </div>
            <label>
              <input type="checkbox" defaultChecked={item.active} />
              <span></span>
            </label>
          </div>
        ))}
      </div>

      <div className={cx('summary')}>
        <ChartBar />
        <p>Cập nhật cookie có hiệu lực ngay sau khi bạn lưu thay đổi.</p>
      </div>
    </div>
  );
}

export default CookiePolicy;
