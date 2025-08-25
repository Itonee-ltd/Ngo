import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const useDebounce = (value: any, delay = 1000) => {
    const [debouncedValue, setDebouncedValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (!value) return setDebouncedValue("")
        setIsTyping(true)
        const handler = setTimeout(() => {
            if (value?.includes("<") || value?.includes("/>")) {
                 toast.error('Invalid search word or sentence.')
            } else {
                setDebouncedValue(value)
                setIsTyping(false)
            }
        }, delay)

        return () => clearTimeout(handler)
    }, [value])

    return { debouncedValue, isTyping }
}