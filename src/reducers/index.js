import {combineReducers} from 'redux'

// import reducers
import {userReducer} from './userReducer'
import {sliderReducer} from './sliderReducer'
import { historyReducer } from './historyReducer'

const Reducers = combineReducers({
    user: userReducer,
    sliderReducer,
    history: historyReducer
})

export default Reducers