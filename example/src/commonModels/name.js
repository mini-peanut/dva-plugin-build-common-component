export default {
    namespace: 'name',
    prefix: ['tabA', 'tabB', 'tabC'],
    state: {
        value: ''
    },
    reducers: {
        changeValue(state, {payload: value}) {
            console.log(value)
            return {
                ...state,
                value
            }
        }
    },

};