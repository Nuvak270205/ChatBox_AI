import { MessageSquare, House, Tv, Store } from "lucide-react";
const menuItems = [
    { to: "/", icon: MessageSquare, title: "Trò chuyện" },
    { to: "/marketplace", icon: House, title: "Marketplace" },
    { to: "/msg_waiting", icon: Tv, title: "Tin nhắn đang chờ" },
    { to: "/warehouse", icon: Store, title: "Kho hàng" },
  ];

export { menuItems };