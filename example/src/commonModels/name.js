export default {
    namespace: 'name',
    prefix: ['tabA', 'tabB', 'tabC'],
    state: {
        value: ''
    },
    reducers: {
        changeValue(state, {payload: value}) {
            return {
                ...state,
                value
            }
        }
    },

};
