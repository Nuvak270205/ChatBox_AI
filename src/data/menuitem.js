import { Globe, Settings, WholeWord, MessageCircleOff, House, PersonStanding, Users, BadgeInfo, ShieldAlert, Menu, LogOut, Keyboard} from "lucide-react";

const MenuItem = [
    {
        icon: Globe,
        title: 'Ngôn ngữ',
        children : {
            title: 'Ngôn ngữ',
            data: [
                {
                    code: 'en',
                    title: 'English',
                    type: 'language'
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                    type: 'language'

                },
                {
                    code: 'ja',
                    title: '日本語',
                    type: 'language'
                },
                {
                    code: 'zh',
                    title: '中文',
                    type: 'language'
                },
                {
                    code: 'fr',
                    title: 'Français',
                    type: 'language'
                },
                {
                    code: 'de',
                    title: 'Deutsch',
                    type: 'language'
                },
                {
                    code: 'es',
                    title: 'Español',
                    type: 'language'
                },
                {
                    code: 'it',
                    title: 'Italiano',
                    type: 'language'
                },
                {
                    code: 'pt',
                    title: 'Português',
                    type: 'language'
                },
                {
                    code: 'ru',
                    title: 'Русский',
                    type: 'language'
                },
                {
                    code: 'ar',
                    title: 'العربية',
                    type: 'language'
                },
                {
                    code: 'hi',
                    title: 'हिन्दी',
                    type: 'language'
                },
                {
                    code: 'bn',
                    title: 'বাংলা',
                    type: 'language'
                },
                {
                    code: 'ur',
                    title: 'اردو',
                    type: 'language'
                },
                {
                    code: 'tr',
                    title: 'Türkçe',
                    type: 'language'
                },
                {
                    code: 'ko',
                    title: '한국어',
                    type: 'language'
                },
            ]
        },
        separate: true
    },
    {
        icon: Keyboard,
        title: 'Phím tắt bàn phím',
        to: '/keyboard-shortcuts'
    }
]

const userMenu = [
        {
            icon: Settings,
            title: 'Tùy chọn',
            to: '/@duongnv',
        },
        {
            icon: WholeWord,
            title: 'Chỉnh sửa tên người dùng',
            to: '/@duongnv',
            separate: true
        },{
            icon: MessageCircleOff,
            title: 'Tài khoản đã hạn chế',
            to: '/coins',
            separate: true
        },
        ,{
            icon: House,
            title: 'Quyền riêng tư và an toàn',
            to: '/coins',
            separate: true
        },
        {
            icon: PersonStanding,
            title: 'Trợ năng',
            to: '/@duongnv',
        },
        {
            icon: Users,
            title: 'Trung tâm gia đình',
            to: '/coins',
            separate: true
        },
        {
            icon: BadgeInfo,
            title: 'Trợ giúp',
            to: '/coins',
            separate: true
        },
        {
            icon: ShieldAlert,
            title: 'Trợ năng',
            to: '/@duongnv',
        },
        {
            icon: Menu,
            title: 'Điều khoản',
            to: '/coins',
            separate: true
        },
        {
            icon: Menu,
            title: 'Chính sách quyền riêng tư',
            to: '/coins',
        },
        {
            icon: Menu,
            title: 'Chính sách cookie',
            to: '/coins',
        },
        ...MenuItem,
        {
            icon: LogOut,
            title: 'Đăng xuất',
            to: '/logout',
            separate: true
        }
    ]

export { userMenu };