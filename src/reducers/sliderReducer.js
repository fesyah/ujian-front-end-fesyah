export const sliderReducer =  (state = null, action) => {
    switch (action.type) {
        case "GET_SLIDER":
            console.log("Slider  Reducer ", action.payload)
            return action.payload
        default:
            return state
    }
}