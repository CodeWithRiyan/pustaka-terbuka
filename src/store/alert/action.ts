export interface AlertMessageAction {
  type: string
  payload: {
    isOpen: boolean
    status?: "success" | "failed"
    message?: string
  }
}

export function setAlertMessage(
  payload: AlertMessageAction["payload"]
): AlertMessageAction {
  return {
    type: "SET_ALERT",
    payload,
  }
}
