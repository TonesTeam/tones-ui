import { combineReducers } from "redux";
import protocolReducer from "./protocolReducer"

const reducers = combineReducers({
    protocolState: protocolReducer
})

export default reducers;
export type State = ReturnType<typeof reducers>;