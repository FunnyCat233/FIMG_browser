import request from '@/utils/request'

export function getLikeList(data){
    return request({
        url: '/api/like/getLikeList',
        method: 'post',
        data
    })
}

export function getPrivateLikeList(data){
    return request({
        url: '/api/like/getPrivateLikeList',
        method: 'post',
        data
    })
}

export function addLikeList(data){
    return request({
        url: '/api/like/addLikeList',
        method: 'post',
        data
    })
}

export function delLikeList(data){
    return request({
        url: '/api/like/delLikeList',
        method: 'post',
        data
    })
}