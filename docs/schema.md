# Firestore Database Schema - ChatBox AI

## 1. users/{uid} (doc ID = uid)
```
uid: string
name: string
username: string
avatar: string (URL)
createdAt: timestamp
```
**Sample**: `users/UKYP41BVmZceTEv9DHSrd7CIr9I3` - Nguyen Van An

## 2. groups/{groupId} (doc ID = group1, group2...)
```
uid: string (matches doc ID)
name: string (e.g. "Group 1")
avatar: string (URL)
createdBy: string (user UID)
createdAt: timestamp
```
**Sample**: `groups/group1`

## 3. groups/{groupId}/members/{userId} (userId = member UID)
```
userId: string (doc ID = UID)
role: string ("admin", "member") 
joinedAt: timestamp
```
**Sample**: `groups/group1/members/UKYP41BVmZceTEv9DHSrd7CIr9I3`

## 4. chatbox/{chatId} (auto ID)
```
type: string ("normal", "group", "channel")
status: string ("active", "opending", "spam", "market", "archived")
members: array<string> (UIDs, user1 heavy)
memberInfo: map<UID, object> {
  name: string
  avatar: string
  bell: boolean
}
lastMessage: string
lastMessageAt: timestamp
lastSenderId: string (UID)
lastRead: map<UID, timestamp>
group_id: string? (for channel)
```
**Sample**: 30 chatbox (10 each type), user1 in all

## 5. chatbox/{chatId}/messages/{msgId} (auto ID)
```
senderId: string (UID)
content: string?
content_image: string?
type: string ("normal", "reply", "icon", "file", "forward")
rep: number? (reply_to msg ID)
Icon: string? (lucide-react icon name)
titlefile: string?
sizefile: number? (bytes)
status: string ("Đã gửi", "Đang gửi", "Gửi thất bại")
createAt: timestamp
```
**No `arrUser` or `user` fields** - ~400+ messages total (10-20 per chatbox)

## Seeding Scripts
- `node addUser.js` - 21 users
- `node addChatData.js` - 30 chatbox + groups/members/messages

**Total**: Production-like sample data ready.

