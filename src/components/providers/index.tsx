"use client"

import { ProgressProvider } from "@bprogress/next/app"
import { PropsWithChildren } from "react"
import { Provider } from "react-redux"

import { I18nProvider } from "@/i18n/I18nProvider"

import { store } from "../../store"
import { CONTENT_ID, SkipLink } from "../custom/skip-link"
import Footer from "../mvpblocks/footer-4col"
import Header from "../mvpblocks/header"
import { ThemeProvider } from "../ui/theme-provider"
import GlobalModalProvider from "./global-modal-provider"

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <I18nProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProgressProvider
            height="4px"
            color="#e87749"
            options={{ showSpinner: false }}
            shallowRouting
          >
            <GlobalModalProvider>
              <SkipLink />
              <Header />
              <main id={CONTENT_ID} tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
            </GlobalModalProvider>
          </ProgressProvider>
        </ThemeProvider>
      </I18nProvider>
    </Provider>
  )
}
