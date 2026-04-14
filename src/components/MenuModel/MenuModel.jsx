import React from 'react'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import styles from './MenuModel.module.scss'
import { Model } from '../Model'
import Setting from './Setting'
import UpdateName from './UpdateName'
import RestrictedAccount from './RestrictedAccount'
import PrivacySafety from './PrivacySafety'
import Accessibility from './Accessibility'
import FamilyCenter from './FamilyCenter'
import HelpCenter from './HelpCenter'
import Terms from './Terms'
import PrivacyPolicy from './PrivacyPolicy'
import CookiePolicy from './CookiePolicy'

const cx = classNames.bind(styles)

function MenuModel({type, onClose}) {
  const renderContent = () => {
    if (type === 'setting') {
      return <Setting />;
    } else if (type === 'update-username') {
      return <UpdateName />;
    } else if (type === 'restricted-account') {
      return <RestrictedAccount />;
    } else if (type === 'privacy-and-safety') {
      return <PrivacySafety />;
    } else if (type === 'accessibility') {
      return <Accessibility />;
    } else if (type === 'family-center') {
      return <FamilyCenter />;
    } else if (type === 'help') {
      return <HelpCenter />;
    } else if (type === 'terms') {
      return <Terms />;
    } else if (type === 'privacy-policy') {
      return <PrivacyPolicy />;
    } else if (type === 'cookie-policy') {
      return <CookiePolicy />;
    }

    return null;
  };

  const content = renderContent();

  if (!content) {
    return null;
  }

  return (
    <div className={cx('menu-model')}>
        <Model onClose={onClose}>
            {content}
        </Model>
    </div>
  )
}

MenuModel.propTypes = {
    type: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default MenuModel


