import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Wrapper as PoperWrapper } from '~/conponents/Poper/index.jsx';
import MenuItem from './MenuItem';
import styles from './Menu.module.scss';
import Header from './Header';

const cx = classNames.bind(styles);
const defaultChange = () => {};

function Menu({children, item = [], onChange = defaultChange}) {

    const [history, setHistory] = useState([{ data: item }]);
    const current = history[history.length - 1];

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            return (
               <MenuItem
                    key={index}
                    data={item}
                    onClick={() => {
                    if (isParent) {
                        setHistory(prev => [...prev, item.children]);
                    } else if (!item.to) {
                        onChange(item);
                    }
                }}

                />
            );
        });
    };

    const handleHide = () => {
        setHistory(history => history.slice(0, 1))
    };

    const handleBack = () => {
        setHistory(history => history.slice(0, history.length - 1));
    };

    const renderResult = (attrs) => (
        <div className={cx('menu-items')} tabIndex="-1" {...attrs}>
            <PoperWrapper className={cx('menu-list')}>
                {history.length > 1 && <Header 
                    title={current.title} 
                    onBack={handleBack}
                />}
                <div className={cx('menu-body')}>
                    {renderItems()}
                </div>
                       
            </PoperWrapper>
        </div>
    );

    return ( 
        <Tippy
            interactive
            delay={[0, 800]}
            offset={[12, 8]}
            placement='bottom-end'
            onHide={handleHide}
            hideOnClick={false}
            render={renderResult}
        >
            {children}
        </Tippy> );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    item: PropTypes.array,
    onChange: PropTypes.func,
};

export default Menu;