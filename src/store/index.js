import { createStore } from 'vuex'

import carList from './modules/carList'
import auth from './modules/auth'
import carLoan from './modules/carLoan'
import borrowingHistory from './modules/borrowingHistory'

export const store = createStore({
    modules: {
        carList,
        auth,
        carLoan,
        borrowingHistory,
    }
})