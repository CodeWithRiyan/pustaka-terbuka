import { combineReducers } from "@reduxjs/toolkit"
import { alertMessageReducer } from "./alert/reducer"
import { bookApi } from "./book/api"
import { modalReducer } from "./modal/reducer"

export const rootReducer = combineReducers({
  alert: alertMessageReducer,
  modal: modalReducer,
  [bookApi.reducerPath]: bookApi.reducer,
})
