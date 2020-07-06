export const History = (data) => {
    console.log(data)
    return {
        type : 'HISTORY_TRANSACTION',
        payload: data
    }
}