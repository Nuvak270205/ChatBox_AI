import classNames from 'classnames/bind';
import React, {useEffect} from 'react';
import styles from './Menu.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Header({title, onBack}) {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);
    return ( 
        <header className={cx('header')}>
            <button className={cx('back-btn')} onClick={onBack}>
                <i data-lucide="chevron-left"></i>
            </button>
            <h4 className={cx('header-title')}>{title}</h4>
        </header>
    )
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default Header;