import React from 'react'
import classNames from 'classnames/bind'
import style from './Model.module.scss'
import { X } from 'lucide-react';

const cx = classNames.bind(style);

function Model({children}) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('icon')}>
        <X className={cx('close-icon')}/>
      </div>
      <div className={cx('content')}>
        {children}
      </div>
    </div>
  )
}

export default Model
