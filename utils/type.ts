/* eslint-disable prettier/prettier */

export type AccessPayload = {
    id:string,
    name:string
}

export type RefreshPayload = {
    id:string,
    name:string,
    sessionId:string
}

export type NewJob = {
    jobId:string,
    userId:string,
    input:string,
    chatId:string
}
