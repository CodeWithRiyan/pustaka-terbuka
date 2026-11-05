import { cn } from "@/lib/utils"
import { setAlertMessage } from "@/store/alert/action"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useEffect, useState } from "react"
import Modal from "./modal"

export default function MessageModal() {
  const dispatch = useAppDispatch()
  const { isOpen, status, message } = useAppSelector((state) => state.alert)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const isSuccess = status === "success"
  const defaultMessage = isSuccess ? "Berhasil" : "Gagal"
  const src = isSuccess
    ? "https://lottie.host/05a8078d-d316-40fe-8606-99e86f7ce0fe/IH8IOt9W9q.lottie"
    : "https://lottie.host/540c81a8-19fb-4c80-8068-b7c4ef0da6a4/EwhEd792PO.lottie"
  const size = 180

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isOpen) {
      timer = setTimeout(() => setShowDetail(true), 1000)
    }

    return () => clearTimeout(timer)
  }, [isOpen])

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        dispatch(setAlertMessage({ isOpen: false }))
        setShowDetail(false)
      }}
      footer={<></>}
      className={cn(
        "relative flex flex-col items-stretch justify-start gap-0 p-0 pb-10"
      )}
    >
      <div className="flex justify-center">
        <DotLottieReact
          src={src}
          speed={isSuccess ? 1 : 0.5}
          autoplay={isOpen}
          style={{ width: size, height: size }}
        />
      </div>
      <h3
        className={cn(
          "-mt-10 scale-0 text-center text-2xl font-bold transition-all duration-300 ease-in-out",
          showDetail && "scale-100"
        )}
      >
        {message || defaultMessage}
      </h3>
    </Modal>
  )
}
