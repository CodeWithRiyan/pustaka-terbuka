"use client"
import { ProgressProvider } from "@bprogress/next/app"
import { PropsWithChildren } from "react"
import { Provider } from "react-redux"
import { store } from "../../store"
import Footer from "../mvpblocks/footer-4col"
import Header from "../mvpblocks/header"
import { ThemeProvider } from "../ui/theme-provider"
import GlobalModalProvider from "./global-modal-provider"

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ProgressProvider
          height="4px"
          color="#e87749"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <GlobalModalProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </GlobalModalProvider>
        </ProgressProvider>
      </ThemeProvider>
    </Provider>
  )
}
