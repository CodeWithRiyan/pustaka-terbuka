import { configureStore } from "@reduxjs/toolkit"

import { rootMiddleware } from "./rootMiddleware"
import { rootReducer } from "./rootReducer"

/** A fresh store; tests make their own so no state leaks between them. */
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rootMiddleware),
  })

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
