const initialState = {
    search: '',
}
function reducer(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_SEARCH':
            return {...state, search: action.payload}
        default:
            return state
    }
}
export default reducer;