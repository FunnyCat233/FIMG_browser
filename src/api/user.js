import request from '@/utils/request'

export function getUserList(data){
    return request({
        url: '/api/user/getUserList',
        method: 'post',
        data
    })
}

export function addUser(data){
    return request({
        url: '/api/user/addUser',
        method: 'post',
        data
    })
}

export function updateUserList(data){
    return request({
        url: '/api/user/updateUserList',
        method: 'post',
        data
    })
}

export function delUserList(data){
    return request({
        url: '/api/user/delUserList',
        method: 'post',
        data
    })
}

export function reopenUserList(data){
    return request({
        url: '/api/user/reopenUserList',
        method: 'post',
        data
    })
}

export function resetPassword(data){
    return request({
        url: '/api/user/resetPassword',
        method: 'post',
        data
    })
}


