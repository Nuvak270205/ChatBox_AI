import React, { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '~/store/authSlice'
import Button from '~/components/Button'
import { updateUsername } from '~/services/auth'
import styles from './UpdateName.module.scss'
const cx = classNames.bind(styles)

function UpdateName() {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const currentUsername = user?.username || user?.email?.split('@')?.[0] || ''

  useEffect(() => {
    setUsername(currentUsername)
  }, [currentUsername])

  const charCount = username.length

  const handleSave = async () => {
    if (!user?.uid) {
      setError('Không tìm thấy người dùng hiện tại')
      return
    }

    const nextUsername = username.trim()
    if (!nextUsername) {
      setError('Username không được để trống')
      return
    }

    if (nextUsername === currentUsername) {
      setSuccess('Username không thay đổi')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const profile = await updateUsername(user.uid, nextUsername)
      const nextUser = {
        ...user,
        username: nextUsername,
        ...(profile ?? {}),
      }

      dispatch(setAuthUser({
        token,
        user: nextUser,
      }))

      setSuccess('Đã cập nhật username')
    } catch (saveError) {
      setError(saveError?.message || 'Cập nhật username thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cx('update-name')}>
      <h2>Chỉnh sửa tên người dùng</h2>
      <h4>Tên người dùng của bạn phải là duy nhất và sẽ hiển thị trong phần tìm kiếm trên Messenger.</h4>
      <div className={cx('update-name-input')}>
        <div className={cx('update-name-input-wrapper')}> 
            <div className={cx('update-name-label')}>Tên người dùng</div>
            <div className={cx('update-name-char-count')}>{charCount}/50</div>
        </div>
        <input
          type="text"
          placeholder='Marisaaa'
          value={username}
          maxLength={50}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div> 
      {(error || success) && (
        <p className={cx('message', { error, success })}>{error || success}</p>
      )}
      <div className={cx('actions')}>
        <Button primary large disablesd={saving} onClick={handleSave}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
      <p>
        Nếu bạn đổi tên người dùng, hệ thống cũng sẽ thay đổi URL trang cá nhân Messenger của bạn tại m.me/username và URL trang cá nhân Facebook tại facebook.com/username.
      </p>
    </div>
  )
}

export default UpdateName
