import request from '@/utils/request'

export function getImgList(data){
    return request({
        url: '/api/img/getImgList',
        method: 'post',
        data
    })
}

export function addImgList(data){
    return request({
        url: '/api/img/addImgList',
        method: 'post',
        data
    })
}

export function delImgList(data){
    return request({
        url: '/api/img/delImgList',
        method: 'post',
        data
    })
}

export function clearImgList(data){
    return request({
        url: '/api/img/clearImgList',
        method: 'post',
        data
    })
}

export function shelveImgList(data){
    return request({
        url: '/api/img/shelveImgList',
        method: 'post',
        data
    })
}

export function unShelveImgList(data){
    return request({
        url: '/api/img/unShelveImgList',
        method: 'post',
        data
    })
}

export function getImgLike(data){
    return request({
        url: '/api/img/getImgLike',
        method: 'post',
        data
    })
}

export function updateImgAllowDownload(data){
    return request({
        url: '/api/img/updateImgAllowDownload',
        method: 'post',
        data
    })
}

