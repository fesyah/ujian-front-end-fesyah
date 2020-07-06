// const INITIAL_STATE = {
//     id: null,
//     userID : null,
//     username: null,
//     date : null,
//     total : null,
//     product : []
// }

export const historyReducer = (state = [], action) => {
    switch(action.type){
        case 'HISTORY_TRANSACTION' :
            return action.payload
        default : 
            return state
    }
}