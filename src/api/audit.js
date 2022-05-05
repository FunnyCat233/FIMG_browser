import request from '@/utils/request'

export function addAuditList(data){
    return request({
        url: '/api/audit/addAuditList',
        method: 'post',
        data
    })
}

export function getAuditList(data){
    return request({
        url: '/api/audit/getAuditList',
        method: 'post',
        data
    })
}

export function updateAuditList(data){
    return request({
        url: '/api/audit/updateAuditList',
        method: 'post',
        data
    })
}

export function readAuditMes(data){
    return request({
        url: '/api/audit/readAuditMes',
        method: 'post',
        data
    })
}