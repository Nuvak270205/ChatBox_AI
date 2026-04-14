import React from 'react'
import classNames from 'classnames/bind'
import styles from './Setting.module.scss'
import { Circle, Volume2, Moon, CreditCard, MessageCircleMore, CircleOff } from 'lucide-react'
import Button from '~/components/Button'

const cx = classNames.bind(styles)

function Setting() {
  return (
    <div className={cx('setting-modal')}>
      <h2 className={cx('title')}>Tùy chọn</h2>

      <div className={cx('setting')}>
        <h3>Tài khoản</h3>
        <div className={cx('setting_item')}>
            <img src="https://res.cloudinary.com/dpnza0kof/image/upload/v1761197706/vtdgumwes11xmnsxgt1u.jpg" alt="avatar" />
            <div className={cx('setting_item_info')}>
                <h4>Marissa Nguyen</h4>
                <p>marissa.nguyen090978</p>
            </div>
        </div>
      </div>

      <div className={cx('setting')}>
        <div className={cx('setting_item')}>
            <div className={cx('setting_item_icon')}>
                <Circle />
            </div>
            <h4>
                Trạng thái hoạt động <span>Đang hoạt động</span>
            </h4>
        </div>
      </div>

      <div className={cx('setting')}>
        <h3>Thông báo</h3>
        <div className={cx('setting_item')}>
            <div className={cx('setting_item_icon')}>
                <Volume2 />
            </div>
            <div className={cx('setting_item_content')}>
                <h4>Âm thanh thông báo</h4>
                <p>Dùng thông báo bằng âm thanh để biết về tin nhắn, cuộc gọi đến, đoạn chat video và âm thanh trong ứng dụng.</p>
            </div>
            <label className={cx('switch')}>
              <input type="checkbox" defaultChecked />
              <span className={cx('slider')}></span>
            </label>
        </div>

        <div className={cx('setting_item')}>
            <div className={cx('setting_item_icon')}>
                <Volume2 />
            </div>
            <div className={cx('setting_item_content')}>
                <h4>Không làm phiền</h4>
              <p>Tạm dừng toàn bộ thông báo trong một khoảng thời gian.</p>
            </div>
            <label className={cx('switch')}>
              <input type="checkbox" />
              <span className={cx('slider')}></span>
            </label>
        </div>

        <div className={cx('setting_item')}>
            <div className={cx('setting_item_icon')}>
                <Moon />
            </div>
            <div className={cx('setting_item_content')}>
                <h4>Chế độ tối</h4>
                <p>Điều chỉnh giao diện của Messenger để giảm độ chói và cho đôi mắt được nghỉ ngơi..</p>
            </div>
            <label className={cx('switch')}>
              <input type="checkbox" />
              <span className={cx('slider')}></span>
            </label>
        </div>
      </div>

      <div className={cx('setting', 'setting_actions')}>
        <Button className={cx('setting_button')} leftIcon={CreditCard}>Quản lý thanh toán</Button>
        <Button className={cx('setting_button')} leftIcon={MessageCircleMore}>Quản lý hoạt động tin nhắn</Button>
        <Button className={cx('setting_button')} leftIcon={CircleOff}>Quản lý phần chặn</Button>
      </div>
    </div>
  )
}

export default Setting
