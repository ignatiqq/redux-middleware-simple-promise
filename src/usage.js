const {applyMiddleware, createStore} = require("redux");
const {FULFILLED, PENDING, REJECTED} = require("./index");

const reduxSimpleAsyncPayload = require("./index");

const initialData = {
    isLoading: false,
    error: null,
    data: null
};

const action = {
    type: "TEST",
    payload: new Promise((res) => setTimeout(() => res({}),1000)),
};

const reducer = (state = initialData, action) => {
    switch(action.type) {
        case `TEST_${FULFILLED}`: {
            return {
                ...state,
                isLoading: false,
                data: action.payload
            }
        }
        break;

        case `TEST_${PENDING}`: {
            return {
                ...state,
                isLoading: true
            }
        }
        break;

        case `TEST_${REJECTED}`: {
            return {
                ...state,
                error: action.payload
            }
        }
        break;

        default: return state;
    }
}

const store = createStore(reducer, applyMiddleware(reduxSimpleAsyncPayload));

module.exports = {reducer, store};