"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AutoLogout({ timeout = 10 * 60 * 1000 }) { // 10 minutes
  const router = useRouter()

  useEffect(() => {
    let timer: any

    const resetTimer = () => {
      clearTimeout(timer)

      timer = setTimeout(() => {
        document.cookie = "token=; path=/; max-age=0"
        router.push("/login")
      }, timeout)
    }

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"]

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    )

    resetTimer()

    return () => {
      clearTimeout(timer)
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      )
    }
  }, [timeout, router])

  return null
}