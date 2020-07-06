export const LogIn = (data) => {
    return {
        type : 'LOG_IN',
        payload : data
    }
}

export const LogOut = () => {
    return {
        type : 'LOG_OUT'
    }
}

export const updateCart = (data) => {
    return {
        type : 'UPDATE_CART',
        payload : data
    }
}