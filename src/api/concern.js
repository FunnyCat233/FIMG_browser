import request from '@/utils/request'

export function getConcernList(data){
    return request({
        url: '/api/concern/getConcernList',
        method: 'post',
        data
    })
}

export function getConcernImgList(data){
    return request({
        url: '/api/concern/getConcernImgList',
        method: 'post',
        data
    })
}

export function getConcernUserList(data){
    return request({
        url: '/api/concern/getConcernUserList',
        method: 'post',
        data
    })
}

export function addConcernList(data){
    return request({
        url: '/api/concern/addConcernList',
        method: 'post',
        data
    })
}

export function delConcernList(data){
    return request({
        url: '/api/concern/delConcernList',
        method: 'post',
        data
    })
}