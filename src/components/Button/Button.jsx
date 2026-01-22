import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const cx = classNames.bind(styles);

function Button({
    to,
    href,
    onClick,
    children,
    text = false,
    primary = false,
    online = false,
    small = false,
    large = false,
    disablesd = false,
    rounder = false,
    className,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    ...passProps
}) {
    const props = {
        onClick,
        ...passProps
    };
    let Conponent = 'button';
    if (disablesd) {
        Object.keys(props).forEach( key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        })
    }
    if (to){
        props.to = to;
        Conponent = Link;
    }else if (href){
        props.href = href;
        Conponent = 'a';
    }
    const classes = cx('wrapper', {
        primary,
        online,
        small,
        large,
        text,
        disablesd,
        rounder,
        LeftIcon,
        RightIcon,
        [className]: className
    });
    
    return ( 
        <Conponent className={classes} {...props} onClick={onClick}>
            {LeftIcon && (<span className={cx('icon')}>
               <LeftIcon />
            </span>)}
            <span className={cx('title')}>{children}</span>
            {RightIcon && (<span className={cx('icon')}>
                <RightIcon />
            </span>)}
        </Conponent>
     );
}

Button.propTypes = {
    to: PropTypes.string, 
    href: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    text: PropTypes.bool,
    primary: PropTypes.bool,
    online: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    disablesd: PropTypes.bool,
    rounder: PropTypes.bool,
    className: PropTypes.string,
    leftIcon: PropTypes.elementType,
    rightIcon: PropTypes.elementType,
    passProps: PropTypes.object,
}
export default Button;