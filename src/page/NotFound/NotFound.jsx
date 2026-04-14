import React from 'react'
import classNames from 'classnames/bind'
import styles from './NotFound.module.scss'

const cx = classNames.bind(styles)
function NotFound() {
  return (
    <div className={cx('not-found')}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound
