'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/lib/toast'

const REMINDER_KEY = 'x10-daily-reminder'

export default function NotificationManager() {
    const { showToast } = useToast()
    const [permission, setPermission] = useState<NotificationPermission>('default')

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    useEffect(() => {
        // Request permission if default.
        // Note: Browsers may block this if not triggered by user interaction.
        // We attempt it here for the sake of the feature, but ideally this should be a button click.
        if ('Notification' in window && permission === 'default') {
            Notification.requestPermission().then(status => {
                setPermission(status)
            })
        }
    }, [permission])

    useEffect(() => {
        if (!('Notification' in window)) return

        const checkReminder = () => {
            const now = new Date()
            const currentHour = now.getHours()

            const lastShown = localStorage.getItem(REMINDER_KEY)
            const todayStr = now.toDateString()

            if (lastShown === todayStr) return

            // If it's morning (e.g. 7 AM - 10 AM)
            if (currentHour >= 7 && currentHour <= 10) {
                if (permission === 'granted') {
                    try {
                        new Notification('Chào ngày mới! 🌞', {
                            body: 'Hôm nay năng lượng của bạn thế nào? Hãy chia sẻ với X10 nhé!',
                            icon: '/images/x10-logo.png',
                            data: { url: window.location.origin }
                        })
                        localStorage.setItem(REMINDER_KEY, todayStr)
                    } catch (e) {
                        console.error('Notification error:', e)
                        // Fallback
                        showToast('Chào ngày mới! 🌞 Hôm nay bạn thế nào?')
                        localStorage.setItem(REMINDER_KEY, todayStr)
                    }
                } else {
                    // Internal Toast fallback if app is open but notifications denied/default
                    showToast('Chào ngày mới! 🌞 Hôm nay bạn thế nào?')
                    localStorage.setItem(REMINDER_KEY, todayStr)
                }
            }
        }

        // Check every minute
        const interval = setInterval(checkReminder, 60000)

        // Initial check
        checkReminder()

        return () => clearInterval(interval)
    }, [permission, showToast])

    return null // Logic only component
}
