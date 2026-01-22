import classNames from 'classnames/bind';
import React, {useEffect, useRef} from 'react';
import styles from './Menu.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Header({title, onBack}) {
    const headerRef = useRef(null);
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        if (headerRef.current) {
            headerRef.current.blur();
        }
    }, []);

    const handleBackClick = (e) => {
        e.currentTarget.blur();
        onBack();
    };

    return ( 
        <header className={cx('header')} tabIndex={-1}>
            <button className={cx('back-btn')} onClick={handleBackClick} ref={headerRef}>
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