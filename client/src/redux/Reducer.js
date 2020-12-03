const initialState = {
    notification: [],
}
function reducer(state = initialState, action) {
    switch (action.type) {
        case 'NOTIFICATION':
            return {...state, notification: [...action.payload]}
        default:
            return state
    }
}
export default reducer;