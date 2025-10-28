"use client"

import React from "react"
import { cx } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import SiriOrb from "./SiriOrb"
import { useClickOutside } from "@/hooks/use-click-outside"

const SPEED = 1


interface FooterContext {
  showFeedback: boolean
  success: boolean
  isLoading: boolean
  customOrb?: React.ReactNode
  openFeedback: () => void
  closeFeedback: () => void
  onSend: (text: string) => void
}

const FooterContext = React.createContext({} as FooterContext)
const useFooter = () => React.useContext(FooterContext)

interface MorphSurfaceProps {
  onSend: (text: string) => void
  isLoading: boolean
  customOrb?: React.ReactNode
}

export function MorphSurface({ onSend, isLoading, customOrb }: MorphSurfaceProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)

  const feedbackRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [showFeedback, setShowFeedback] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const closeFeedback = React.useCallback(() => {
    setShowFeedback(false)
    feedbackRef.current?.blur()
  }, [])

  const openFeedback = React.useCallback(() => {
    setShowFeedback(true)
    setTimeout(() => {
      feedbackRef.current?.focus()
    })
  }, [])


  const onFeedbackSuccess = React.useCallback(() => {
    closeFeedback()
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
    }, 1500)
  }, [closeFeedback])

  useClickOutside(rootRef, closeFeedback)

  const context = React.useMemo(
    () => ({
      showFeedback,
      success,
      isLoading,
      customOrb,
      openFeedback,
      closeFeedback,
      onSend,
    }),
    [showFeedback, success, isLoading, customOrb, openFeedback, closeFeedback, onSend]
  )

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: FEEDBACK_WIDTH,
        height: FEEDBACK_HEIGHT,
      }}
    >
      <motion.div
        data-footer
        ref={rootRef}
        className={cx(
          "bg-background border-border relative bottom-8 z-3 flex flex-col items-center overflow-hidden border shadow-lg max-sm:bottom-5"
        )}
        initial={false}
        animate={{
          width: showFeedback ? FEEDBACK_WIDTH : "auto",
          height: showFeedback ? FEEDBACK_HEIGHT : 44,
          borderRadius: showFeedback ? 14 : 20,
        }}
        transition={{
          type: "spring",
          stiffness: 550 / SPEED,
          damping: 45,
          mass: 0.7,
          delay: showFeedback ? 0 : 0.08,
        }}
      >
        <FooterContext.Provider value={context}>
          <Dock />
          <Feedback ref={feedbackRef} onSuccess={onFeedbackSuccess} />
        </FooterContext.Provider>
      </motion.div>
    </div>
  )
}

function Dock() {
  const { showFeedback, openFeedback, isLoading, customOrb } = useFooter()
  const defaultOrb = (
    <motion.div
      key="siri-orb"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <SiriOrb
        size="32px"
        colors={{
          bg: "oklch(22.64% 0 0)",
        }}
      />
    </motion.div>
  )

  return (
    <footer className="mt-auto flex h-[44px] items-center justify-center whitespace-nowrap select-none">
      <div className="flex items-center justify-center gap-2 px-3 max-sm:h-10 max-sm:px-2">
        <div className="flex w-fit items-center gap-2 h-8">
          <AnimatePresence mode="wait">
            {showFeedback ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className="h-8 w-8"
              />
            ) : (
              <div className="h-8 w-8 flex items-center justify-center">
                {customOrb || defaultOrb}
              </div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="button"
          className="flex h-fit flex-1 justify-end rounded-full px-2 !py-0.5 text-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
          variant="ghost"
          onClick={openFeedback}
          disabled={isLoading}
        >
          <div className="flex items-center justify-center h-6 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-6">
                <span className="text-sm font-medium">Generating...</span>
              </div>
            ) : (
              <span className="truncate font-medium text-sm ">Text to Speech</span>
            )}
          </div>
        </Button>
      </div>
    </footer>
  )
}

const FEEDBACK_WIDTH = 360
const FEEDBACK_HEIGHT = 200

function Feedback({
  ref,
  onSuccess,
}: {
  ref: React.Ref<HTMLTextAreaElement>
  onSuccess: () => void
}) {
  const { closeFeedback, showFeedback, isLoading, onSend, customOrb } = useFooter()
  const submitRef = React.useRef<HTMLButtonElement>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isLoading) return

    const formData = new FormData(e.currentTarget)
    const text = formData.get("message") as string

    if (!text.trim()) return

    onSend(text)
    onSuccess()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      closeFeedback()
    }
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      submitRef.current?.click()
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="absolute bottom-0"
      style={{
        width: FEEDBACK_WIDTH,
        height: FEEDBACK_HEIGHT,
        pointerEvents: showFeedback ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 550 / SPEED,
              damping: 45,
              mass: 0.7,
            }}
            className="flex h-full flex-col p-1"
          >
            <div className="flex justify-between py-1">
              <p className="text-foreground z-2 ml-[42px] flex items-center gap-[6px] select-none text-sm font-medium">
                Text to Speech
              </p>
              <button
                type="submit"
                ref={submitRef}
                className="text-muted-foreground right-4 mt-1 flex -translate-y-[3px] cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-transparent pr-1 text-center select-none hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <Kbd>⌘</Kbd>
                <Kbd className="w-fit">Enter</Kbd>
              </button>
            </div>
            <textarea
              ref={ref}
              placeholder="Enter text to convert to speech..."
              name="message"
              className="bg-background text-foreground placeholder:text-muted-foreground h-full w-full resize-none scroll-py-2 rounded-md p-4 outline-0 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              onKeyDown={onKeyDown}
              spellCheck={false}
              disabled={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-3 h-8 w-8 flex items-center justify-center"
          >
            {customOrb || (
              <SiriOrb
                size="24px"
                colors={{
                  bg: "oklch(22.64% 0 0)",
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}


function Kbd({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <kbd
      className={cx(
        "bg-muted text-muted-foreground border-border flex h-6 w-fit items-center justify-center rounded-sm border px-[6px] font-sans text-xs font-medium",
        className
      )}
    >
      {children}
    </kbd>
  )
}

export const AiInput = MorphSurface

export default MorphSurface
