import { combineReducers } from "@reduxjs/toolkit"

import { bookApi } from "./book/api"
import { modalReducer } from "./modal/reducer"

export const rootReducer = combineReducers({
  modal: modalReducer,
  [bookApi.reducerPath]: bookApi.reducer,
})
