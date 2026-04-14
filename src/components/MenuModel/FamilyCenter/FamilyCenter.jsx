import React from 'react';
import classNames from 'classnames/bind';
import { Users, Clock3, ShieldCheck } from 'lucide-react';
import styles from './FamilyCenter.module.scss';

const cx = classNames.bind(styles);

function FamilyCenter() {
  return (
    <div className={cx('family')}>
      <div className={cx('top')}>
        <h2>Trung tâm gia đình</h2>
        <p>Giám sát, thiết lập giới hạn và theo dõi các thay đổi quan trọng.</p>
      </div>

      <div className={cx('stats')}>
        <article>
          <Users />
          <h4>3 thành viên</h4>
          <p>Đang liên kết với tài khoản gia đình</p>
        </article>
        <article>
          <Clock3 />
          <h4>90 phút/ngày</h4>
          <p>Giới hạn sử dụng hiện tại</p>
        </article>
        <article>
          <ShieldCheck />
          <h4>An toàn nâng cao</h4>
          <p>Cảnh báo bất thường đang được bật</p>
        </article>
      </div>

      <div className={cx('panel')}>
        <h3>Hoạt động gần đây</h3>
        <ul>
          <li>Lần cuối cập nhật giới hạn: 20:15 hôm qua</li>
          <li>Yêu cầu kết nối mới: 1 thông báo</li>
          <li>Tổng số cảnh báo tuần này: 0</li>
        </ul>
      </div>
    </div>
  );
}

export default FamilyCenter;
