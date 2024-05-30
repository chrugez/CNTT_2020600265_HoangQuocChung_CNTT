const path = {

    //PUBLIC
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS__CATEGORY: ':category',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    FAQ: 'faqs',
    DETAILCART: 'Detail-cart',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    CHECKOUT: 'checkout',
    PRODUCTS: 'products',

    //ADMIN
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCT: 'manage-product',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCT: 'create-product',

    //MEMBER
    MEMBER: 'member',
    PERSONAL: 'personal',
    MYCART: 'my-cart',
    WISHLIST: 'wishlist',
    HISTORY: 'history'
}

export default path