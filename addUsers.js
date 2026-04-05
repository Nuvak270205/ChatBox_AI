const admin = require('firebase-admin');

// 21 UIDs từ user
const userUIDs = [
  'UKYP41BVmZceTEv9DHSrd7CIr9I3',
  '0HoLPAHSX7hpajx3CY2T6MtByvl2',
  'WzVQbRM3F2RVkeQtyj1vnSI1moG3',
  'tfjBB7IfLbN1ogMVfGGdnhQlgPi2',
  'zKttYQGTPMXEOnxEnqhJhYdcDh93',
  'ITD0iKPcJKS4w4nspqux0Am79Rv1',
  'gBm6PByQKnOwSwsGmB2tsxGjhw63',
  'wKK2yfrmREULl5eyCB3j3HkhXoy2',
  'WbxZ69FQLfhEZQpgkvbR6PHa4dH3',
  '12lkopqtgAW9KGu2Q1Yiqk745BJ3',
  'j7O8fCqbq6XPfhEE48QCCiU6Msk1',
  'QYGYqZXOZaQLBXuSDh5mp2nboLD2',
  'QYGYqZXOZaQLBXuSDh5mp2nboLD2', // duplicate
  'QYGYqZXOZaQLBXuSDh5mp2nboLD2', // duplicate
  'XjpuvwDcRKZB3gYB0PeOl7g8Qrj1',
  'kh73NpoHADXvpFbEwYihYHw6CR52',
  'obsWD70qROV137FfE5zx8kzKkdm2',
  'WgjiWBWFc0cYJCqwaUvAkIjP6QB2',
  'JNyjsKVbqmSpLhj3POV76nG3s1x2',
  'jDoyd8Uj78drDU1c8yTlsLEM1GW2',
  'PcYsumYdSbQwfY3IvAZUjTOCNoB3'
];

// 2 avatars từ chatItem.js sample, alternate
const avatars = [
  'https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg',
  'https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg'
];

const names = [
  'Nguyen Van An', 'Tran Thi Bich', 'Le Van Cuong', 'Pham Thi Dung', 'Hoang Minh Em',
  'Vu Thi Phuong', 'Do Van Quang', 'Bui Thi Hoa', 'Nguyen Thi Lan', 'Tran Van Minh',
  'Le Thi Nga', 'Pham Van Hung', 'Hoang Thi Thu', 'Vu Van Long', 'Do Thi Mai',
  'Bui Van Nam', 'Nguyen Thi Oanh', 'Tran Van Phong', 'Le Thi Quyen', 'Pham Van Son',
  'Hoang Thi Tam'
];

async function addUsers() {
  try {
    // Init firebase-admin
    admin.initializeApp({
      credential: admin.credential.cert('./serviceAccountKey.json'),
      projectId: 'chatboxai-f8325' // Từ firebase.js
    });

    const db = admin.firestore();
    const batch = db.batch();

    userUIDs.forEach((uid, index) => {
      const userRef = db.collection('users').doc(uid);
      const userData = {
        uid: uid,
        name: names[index],
        avatar: avatars[index % 2],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      batch.set(userRef, userData);
      console.log(`Added ${names[index]} (${index + 1}): ${uid}`);
    });

    await batch.commit();
    console.log('✅ Successfully added 21 users to Firestore "users" collection!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addUsers();

