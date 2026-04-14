import React from 'react'
import classNames from 'classnames/bind'
import styles from './UpdateName.module.scss'
const cx = classNames.bind(styles)

function UpdateName() {
  return (
    <div className={cx('update-name')}>
      <h2>Chỉnh sửa tên người dùng</h2>
      <h4>Tên người dùng của bạn phải là duy nhất và sẽ hiển thị trong phần tìm kiếm trên Messenger.</h4>
      <div className={cx('update-name-input')}>
        <div className={cx('update-name-input-wrapper')}> 
            <div className={cx('update-name-label')}>Tên người dùng</div>
            <div className={cx('update-name-char-count')}>18/50</div>
        </div>
        <input type="text" placeholder='Marisaaa' />
      </div> 
      <p>
        Nếu bạn đổi tên người dùng, hệ thống cũng sẽ thay đổi URL trang cá nhân Messenger của bạn tại m.me/username và URL trang cá nhân Facebook tại facebook.com/username.
      </p>
    </div>
  )
}

export default UpdateName
