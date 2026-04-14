const publicRoutes = {
    dashboard: '/dashboard/:chatId?',
    marketplace: '/marketplace/:chatId?',
    msg_waiting: '/msg_waiting/:chatId?',
    warehouse: '/warehouse/:chatId?',
    group: '/group/:idGroup/:chatId?',
    login : '/login',
    logout : '/logout',
    register : '/register',
    notfound : '*',
}

const privateRoutes = {

}

export { publicRoutes, privateRoutes };