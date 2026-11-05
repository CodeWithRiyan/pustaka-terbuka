import { ModalAction } from "./action"

const initialState: ModalAction["payload"] = {
  isOpenSearch: false,
}

export function modalReducer(state = initialState, action: ModalAction) {
  switch (action.type) {
    case "SET_SEARCH_MODAL":
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
