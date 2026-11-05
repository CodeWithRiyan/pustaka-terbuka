import { AlertMessageAction } from "./action"

const initialState: AlertMessageAction["payload"] = {
  isOpen: false,
}

export function alertMessageReducer(
  state = initialState,
  action: AlertMessageAction
) {
  switch (action.type) {
    case "SET_ALERT":
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
