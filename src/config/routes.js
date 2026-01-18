const publicRoutes = {
    dashboard: '/:chatId?',
    marketplace: '/marketplace/:chatId?',
    msg_waiting: '/msg_waiting/:chatId?',
    warehouse: '/warehouse/:chatId?',
    group: '/group/:idGroup/:chatId?',
    login : '/login',
    register : '/register'
    
}

const privateRoutes = {

}

export { publicRoutes, privateRoutes };