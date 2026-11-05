import MessageModal from "../custom/message-modal"
import SearchModal from "../custom/search-modal"

export default function GlobalModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <MessageModal />
      <SearchModal />
    </>
  )
}
