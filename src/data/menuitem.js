import { type } from "firebase/firestore/pipelines";
import { Globe, Settings, WholeWord, MessageCircleOff, House, PersonStanding, Users, BadgeInfo, ShieldAlert, Menu, LogOut, Keyboard} from "lucide-react";


const userMenu = [
        {
            icon: Settings,
            title: 'Tùy chọn',
            type: "setting"
        },
        {
            icon: WholeWord,
            title: 'Chỉnh sửa tên người dùng',
            type: "update-username",
            separate: true
        },{
            icon: MessageCircleOff,
            title: 'Tài khoản đã hạn chế',
            type : "restricted-account",
            separate: true
        },
        ,{
            icon: House,
            title: 'Quyền riêng tư và an toàn',
            type: 'privacy-and-safety',
            separate: true
        },
        {
            icon: PersonStanding,
            title: 'Trợ năng',
            type: 'accessibility',
        },
        {
            icon: Users,
            title: 'Trung tâm gia đình',
            type: 'family-center',
            separate: true
        },
        {
            icon: BadgeInfo,
            title: 'Trợ giúp',
            type: 'help',
            separate: true
        },
        {
            icon: ShieldAlert,
            title: 'Trợ năng',
            type: 'accessibility',
        },
        {
            icon: Menu,
            title: 'Điều khoản',
            type: 'terms',
            separate: true
        },
        {
            icon: Menu,
            title: 'Chính sách quyền riêng tư',
            type: 'privacy-policy',
        },
        {
            icon: Menu,
            title: 'Chính sách cookie',
            type: 'cookie-policy',
        },
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
            icon: LogOut,
            title: 'Đăng xuất',
            type: 'logout',
            separate: true
        }
    ]

export { userMenu };