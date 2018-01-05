export default {

    namespace: 'tab',

    state: {
        value: 'tabA'
    },
    reducers: {
        switchTab(state, {payload: tab}) {
            return {
                ...state,
                value: tab
            }
        }
    },

};
