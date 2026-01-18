
const arrContent = [
        {
            id: 1,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            arr_user: [1,27],
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: true,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            data_Message:[
                {
                    id: 1,
                    id_user: 1,
                    user: "Nguyen Van A",
                    content: "Hello, how are you?",
                    time: new Date("2025-10-11T10:30:00"),
                    status: "Đã gửi",
                    arrUser: [27],
                    type: "normal"
                },
                {
                    id: 2,
                    id_user: 1,
                    user: "Nguyen Van A",
                    content: "Hello, how are you?",
                    time: new Date("2025-11-11T10:30:00"),
                    status: "Đã gửi",
                    arrUser: [27],
                    type: "normal"
                },
                {
                    id: 3,
                    id_user: 1,
                    user: "Nguyen Van A",
                    content: "Hello, how are you?",
                    time: new Date("2025-11-11T10:30:00"),
                    status: "Đã gửi",
                    arrUser: [27],
                    type: "normal"
                },
                {
                    id: 4,
                    id_user: 27,
                    user: "Maris",
                    content: "I'm fine, thank you!",
                    time: new Date("2025-11-11T10:32:00"),
                    status: "Đã gửi",
                    arrUser: [1],
                    type: "reply",
                    rep: 1
                },
                {
                
                    id: 5,
                    id_user: 27,
                    user: "Maris",
                    content: "I'm fine, thank you!",
                    time: new Date("2025-11-11T10:32:00"),
                    status: "Đã gửi",
                    arrUser: [1],
                    type: "normal"
                },
                {
                    id: 6,
                    id_user: 27,
                    user: "Maris",
                    content: "I'm fine, thank you!",
                    time: new Date("2025-11-11T10:32:00"),
                    status: "Đã gửi",
                    arrUser: [1],
                    type: "normal"
                },
                {
                    id: 7,
                    id_user: 27,
                    user: "Maris",
                    content: "I'm fine, thank you!",
                    time: new Date("2025-11-11T10:32:00"),
                    status: "Đã gửi",
                    arrUser: [1],
                    type: "forward"
                },
                {
                    id: 8,
                    id_user: 1,
                    user: "Nguyen Van A",
                    content: "What about you?",
                    time: new Date("2025-11-11T10:33:00"),
                    status: "Đã gửi",
                    arrUser: [27],
                    type: "reply",
                    rep: 4
                },
                {
                    id: 9,
                    id_user: 27,
                    user: "Maris",
                    content: "I'm doing well too.",
                    time: new Date("2025-11-11T12:34:00"),
                    status: "Đã gửi",
                    arrUser: [1],
                    type: "reply",
                    rep:6
                },
                {
                    id: 10,
                    id_user: 1,
                    user: "Nguyen Van A",
                    content: "Great to hear that!",
                    time: new Date("2025-11-11T12:35:00"),
                    status: "Đã gửi",
                    arrUser: [27],
                    type: "normal"
                },
                {
                    id: 11,
                    id_user: 27,
                    user: "Maris",
                    content: "Let's catch up sometime.",
                    time: new Date("2025-11-11T12:36:00"),
                    status: "Đã gửi",
                    arrUser: [1],
                    type: "normal"
                },
                {
                    id: 12,
                    id_user: 27,
                    user: "Maris",
                    content: "Let's catch up sometime.",
                    time: new Date("2025-11-11T12:36:00"),
                    status: "Đã gửi",
                    arrUser: [1],
                    type: "normal"
                }
            ]

            
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: true,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            data_Message:[
                {
                    id_user: 2,
                    content: "Xin chào, bạn khỏe không?",
                    time: new Date("2025-11-11T10:30:00"),
                    status: "Đã gửi",
                    arrUser: [27]
                },
                {
                    id_user: 27,
                    content: "Tôi khỏe, cảm ơn bạn!",
                    time: new Date("2025-11-11T10:32:00"),
                    status: "Đã gửi",
                    arrUser: [2]
                },
                {
                    id_user: 2,
                    content: "Còn bạn thì sao?",
                    time: new Date("2025-11-11T10:33:00"),
                    status: "Đã gửi",
                    arrUser: [27]
                },
                {
                    id_user: 27,
                    content: "Tôi cũng khỏe.",
                    time: new Date("2025-11-11T12:34:00"),
                    status: "Đã gửi",
                    arrUser: [2]
                },
                {
                    id_user: 2,
                    content: "Rất vui khi nghe điều đó!",
                    time: new Date("2025-11-11T12:35:00"),
                    status: "Đã gửi",
                    arrUser: [27]
                },
                {
                    id_user: 27,
                    content: "Hẹn gặp lại bạn sau nhé.",
                    time: new Date("2025-11-11T12:36:00"),
                    status: "Đã gửi",
                    arrUser: [1]
                }
            ]

        },
        {
            id: 3,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 5,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 6,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 7,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 8,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 9,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 10,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 11,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
        {
            id: 12,
            image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            user: "Nguyen Van A",
            content: "Hello, how are you?",
            time: new Date("2025-11-11T10:30:00"),
            check: false,
            bell: false,
            imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
        },
    ];

    const arrContent1 = [
            {
                id: 1,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: true,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 2,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 3,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 4,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 5,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 6,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 7,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 8,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 9,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 10,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 11,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
            {
                id: 12,
                image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
                user: "Nguyen Van A",
                content: "Hello, how are you?",
                time: new Date("2025-11-11T10:30:00"),
                check: false,
                bell: false,
                imageSub: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg",
            },
        ]

    const menuGroups = [
    { to: "/group", id_G: "1", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", title: "Nhom 1" },
    { to: "/group", id_G: "2", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", title: "Nhóm 2" },
    { to: "/group", id_G: "3", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", title: "Nhóm 3" },
    { to: "/group", id_G: "4", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", title: "Nhóm 4" },
    { to: "/group", id_G: "5", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", title: "Nhóm 5" },
    { to: "/group", id_G: "6", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", title: "Nhóm 6" },
    { to: "/group", id_G: "7", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", title: "Nhóm 7" },
    { to: "/group", id_G: "8", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", title: "Nhóm 8" },
    { to: "/group", id_G: "9", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", title: "Nhóm 9" },
    { to: "/group", id_G: "10", image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", title: "Nhóm 10" },
  ];

  const groupItem = [
    {
        id: 1,
        name: "Nhóm chat 1",
        items: [
            { id: 1, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 1", number: 10, status: true },
            { id: 2, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 2", number: 8, status: false },
            { id: 3, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 3", number: 15, status: false },
        ]
    },
    {
        id: 2,
        name: "Nhóm chat 2",
        items: [
            { id: 4, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 4", number: 12, status: true },
            { id: 5, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 5", number: 9, status: false },
            { id: 6, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 6", number: 20, status: false },
        ]
    },
    {
        id: 3,
        name: "Nhóm chat 3",
        items: [
            { id: 7, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 7", number: 7, status: true },
            { id: 8, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 8", number: 14, status: false },
            { id: 9, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 9", number: 11, status: false },
        ]
    },
    {
        id: 4,
        name: "Nhóm chat 4",
        items: [
            { id: 10, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 1", number: 10, status: true },
            { id: 11, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 2", number: 8, status: false },
            { id: 12, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 3", number: 15, status: false },
        ]
    },
    {
        id: 5,
        name: "Nhóm chat 5",
        items: [
            { id: 13, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 4", number: 12, status: true },
            { id: 14, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 5", number: 9, status: false },
            { id: 15, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 6", number: 20, status: false },
        ]
    },
    {
        id: 6,
        name: "Nhóm chat 6",
        items: [
            { id: 16, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 7", number: 7, status: true },
            { id: 17, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 8", number: 14, status: false },
            { id: 18, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 9", number: 11, status: false },
        ]
    }
,
{
        id: 7,
        name: "Nhóm chat 7",
        items: [
            { id: 19, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 1", number: 10, status: true },
            { id: 20, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 2", number: 8, status: false },
            { id: 21, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 3", number: 15, status: false },
        ]
    },
    {
        id: 8,
        name: "Nhóm chat 8",
        items: [
            { id: 22, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 4", number: 12, status: true },
            { id: 23, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 5", number: 9, status: false },
            { id: 24, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 6", number: 20, status: false },
        ]
    },
    {
        id: 9,
        name: "Nhóm chat 9",
        items: [
            { id: 25, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 7", number: 7, status: true },
            { id: 26, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 8", number: 14, status: false },
            { id: 27, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 9", number: 11, status: false },
        ]
    },
    {
        id: 10,
        name: "Nhóm chat 10",
        items: [
            { id: 28, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 1", number: 10, status: true },
            { id: 29, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 2", number: 8, status: false },
            { id: 30, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 3", number: 15, status: false },
            { id: 31, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 4", number: 12, status: true },
            { id: 32, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 5", number: 9, status: false },
            { id: 33, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 6", number: 20, status: false },
            { id: 34, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 7", number: 7, status: true },
            { id: 35, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 8", number: 14, status: false },
            { id: 36, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748058/ruxfjqkuzj3qv5ivy1tf.jpg", user: "Nhóm 9", number: 11, status: false },
            { id: 37, image: "https://res.cloudinary.com/dpnza0kof/image/upload/v1762748251/skd8zd0hmzymm0f1ivwn.jpg", user: "Nhóm 10", number: 13, status: true },
            
        ]
    }
  ]

  const menuItems = [
    { to: "/", icon: "message-square", title: "Trò chuyện" },
    { to: "/marketplace", icon: "house", title: "Marketplace" },
    { to: "/msg_waiting", icon: "tv", title: "Tin nhắn đang chờ" },
    { to: "/warehouse", icon: "store", title: "Kho hàng" },
  ];

  
export { arrContent, arrContent1, menuGroups, groupItem , menuItems };