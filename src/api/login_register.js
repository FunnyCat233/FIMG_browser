import request from '@/utils/request'

export function Login(data){
    return request({
        url: '/api/login_register/Login',
        method: 'post',
        data
    })
}

export function verificationUser(data){
    return request({
        url: '/api/login_register/verificationUser',
        method: 'post',
        data
    })
}

export function verificationCode(data){
    return request({
        url: '/api/login_register/verificationCode',
        method: 'post',
        data
    })
}

export function getCode(data){
    return request({
        url: '/api/login_register/getCode',
        method: 'post',
        data
    })
}