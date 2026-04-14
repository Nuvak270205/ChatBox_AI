import React from 'react'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import style from './Model.module.scss'
import { X } from 'lucide-react';

const cx = classNames.bind(style);

function Model({children, onClose}) {
  return (
    <div className={cx('wrapper')} onClick={(event) => event.stopPropagation()}>
      <div className={cx('icon')} onClick={onClose}>
        <X className={cx('close-icon')}/>
      </div>
      <div className={cx('content')}>
        {children}
      </div>
    </div>
  )
}

Model.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
}

Model.defaultProps = {
  children: null,
  onClose: undefined,
}

export default Model
