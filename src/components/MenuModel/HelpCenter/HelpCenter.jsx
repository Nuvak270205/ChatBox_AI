import React from 'react';
import classNames from 'classnames/bind';
import { Search, LifeBuoy, MessageSquareText } from 'lucide-react';
import styles from './HelpCenter.module.scss';

const cx = classNames.bind(styles);

function HelpCenter() {
  const faqs = [
    'Làm sao đổi mật khẩu nhanh?',
    'Vì sao thông báo không đến?',
    'Cách khôi phục tin nhắn đã ẩn?',
    'Làm sao báo cáo người dùng?',
  ];

  return (
    <div className={cx('help')}>
      <div className={cx('header')}>
        <h2>Trợ giúp</h2>
        <p>Tra cứu nhanh câu hỏi phổ biến và nhận hỗ trợ trực tiếp.</p>
      </div>

      <div className={cx('search')}>
        <Search />
        <input type="text" placeholder="Tìm vấn đề của bạn..." />
      </div>

      <div className={cx('faq')}>
        {faqs.map((q) => (
          <button key={q} type="button">{q}</button>
        ))}
      </div>

      <div className={cx('contact')}>
        <article>
          <LifeBuoy />
          <h4>Trung tâm trợ giúp</h4>
          <p>Xem hướng dẫn chi tiết theo chủ đề.</p>
        </article>
        <article>
          <MessageSquareText />
          <h4>Chat với hỗ trợ</h4>
          <p>Nhận phản hồi từ đội ngũ trong thời gian ngắn.</p>
        </article>
      </div>
    </div>
  );
}

export default HelpCenter;
