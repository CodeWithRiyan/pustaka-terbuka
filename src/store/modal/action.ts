export interface ModalAction {
  type: string
  payload: {
    isOpenSearch?: boolean
  }
}

export function setSearchModal(payload: {
  isOpenSearch: boolean
}): ModalAction {
  return {
    type: "SET_SEARCH_MODAL",
    payload,
  }
}
