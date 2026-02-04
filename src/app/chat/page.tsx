'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { useAuth } from '@/lib/auth'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    rating?: 'up' | 'down' | null
}

interface Conversation {
    id: string
    title: string
    messages: Message[]
    createdAt: Date
    updatedAt: Date
}

// Storage keys
const CONVERSATIONS_KEY = 'x10-conversations'
const CURRENT_CONV_KEY = 'x10-current-conversation'
const THEME_STORAGE_KEY = 'x10-theme'
const LAST_VISIT_KEY = 'x10-last-visit'

// Initial welcome message
const createWelcomeMessage = (): Message => ({
    id: Date.now().toString(),
    role: 'assistant',
    content: 'Xin chào bạn! 👋 Tôi là X10 - người bạn đồng hành của bạn.\n\nTôi ở đây để đồng hành cùng bạn trên hành trình phá vỡ "trần tăng trưởng" và kiến tạo hiện thực mới. Triết lý của X10 là: **Hiện thực mới đến từ Sự rung động mới**.\n\n**Bạn có thể hỏi tôi về:**\n- 🎯 Thay đổi niềm tin và tư duy\n- 💼 Phát triển sự nghiệp và kinh doanh\n- 🧘 Tu tập trong doanh nghiệp\n- 🚀 Phá vỡ giới hạn bản thân\n- 💡 Lãnh đạo tỉnh thức\n\nHãy chia sẻ với tôi - bạn đang quan tâm đến điều gì nhất lúc này?',
    timestamp: new Date()
})

// Create new conversation
const createNewConversation = (): Conversation => ({
    id: Date.now().toString(),
    title: 'Cuộc trò chuyện mới',
    messages: [createWelcomeMessage()],
    createdAt: new Date(),
    updatedAt: new Date()
})

// Speech Recognition types
interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
}

interface SpeechRecognitionAlternative {
    transcript: string
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    onresult: (event: SpeechRecognitionEvent) => void
    onerror: (event: Event) => void
    onend: () => void
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition
        webkitSpeechRecognition: new () => SpeechRecognition
    }
}

function ChatPageContent() {
    const { user, signOut, authRequired } = useAuth()
    // Conversations state
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [currentConvId, setCurrentConvId] = useState<string | null>(null)
    const [showSidebar, setShowSidebar] = useState(false)

    // Current conversation messages
    const currentConv = conversations.find(c => c.id === currentConvId)
    const messages = currentConv?.messages || []

    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    // Voice input state
    const [isListening, setIsListening] = useState(false)
    const [speechSupported, setSpeechSupported] = useState(false)
    const recognitionRef = useRef<SpeechRecognition | null>(null)

    // Text-to-Speech state
    const [speakingId, setSpeakingId] = useState<string | null>(null)
    const [ttsSupported, setTtsSupported] = useState(false)

    // Welcome back state
    const [showWelcomeBack, setShowWelcomeBack] = useState(false)
    const [daysAway, setDaysAway] = useState(0)

    // Streaming state
    const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const audioContextRef = useRef<AudioContext | null>(null)

    // Initialize on mount
    useEffect(() => {
        setIsMounted(true)

        // Check speech recognition support
        if (typeof window !== 'undefined') {
            setSpeechSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
            // Check TTS support
            setTtsSupported('speechSynthesis' in window)
        }

        // Load theme
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme !== null) {
            setIsDarkMode(savedTheme === 'dark')
        }

        // Check last visit for welcome back message
        const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
        if (lastVisit) {
            const lastDate = new Date(lastVisit)
            const now = new Date()
            const diffTime = now.getTime() - lastDate.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            if (diffDays >= 1) {
                setShowWelcomeBack(true)
                setDaysAway(diffDays)
            }
        }
        // Update last visit
        localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString())

        // Load conversations
        const savedConvs = localStorage.getItem(CONVERSATIONS_KEY)
        const savedCurrentId = localStorage.getItem(CURRENT_CONV_KEY)

        if (savedConvs) {
            try {
                const parsed = JSON.parse(savedConvs)
                const convsWithDates = parsed.map((c: Conversation & { messages: (Message & { timestamp: string })[], createdAt: string, updatedAt: string }) => ({
                    ...c,
                    createdAt: new Date(c.createdAt),
                    updatedAt: new Date(c.updatedAt),
                    messages: c.messages.map(m => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    }))
                }))
                setConversations(convsWithDates)

                if (savedCurrentId && convsWithDates.find((c: Conversation) => c.id === savedCurrentId)) {
                    setCurrentConvId(savedCurrentId)
                } else if (convsWithDates.length > 0) {
                    setCurrentConvId(convsWithDates[0].id)
                }
            } catch (e) {
                console.error('Failed to parse conversations:', e)
                const newConv = createNewConversation()
                setConversations([newConv])
                setCurrentConvId(newConv.id)
            }
        } else {
            const newConv = createNewConversation()
            setConversations([newConv])
            setCurrentConvId(newConv.id)
        }
    }, [])

    // Save conversations to localStorage
    useEffect(() => {
        if (isMounted && conversations.length > 0) {
            localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
        }
    }, [conversations, isMounted])

    // Save current conversation ID
    useEffect(() => {
        if (isMounted && currentConvId) {
            localStorage.setItem(CURRENT_CONV_KEY, currentConvId)
        }
    }, [currentConvId, isMounted])

    // Apply theme
    useEffect(() => {
        if (isMounted) {
            document.body.classList.toggle('light-mode', !isDarkMode)
            localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light')
        }
    }, [isDarkMode, isMounted])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Play notification sound
    const playNotificationSound = useCallback(() => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
            }
            const ctx = audioContextRef.current
            const oscillator = ctx.createOscillator()
            const gainNode = ctx.createGain()
            oscillator.connect(gainNode)
            gainNode.connect(ctx.destination)
            oscillator.frequency.setValueAtTime(880, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1)
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.3)
        } catch (e) {
            console.log('Audio not supported:', e)
        }
    }, [])

    // Voice input handlers
    const startListening = () => {
        if (!speechSupported) return

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognitionAPI()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'vi-VN'

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from({ length: event.results.length }, (_, i) => i)
                .map(i => event.results[i][0].transcript)
                .join('')
            setInput(transcript)
        }

        recognitionRef.current.onerror = () => {
            setIsListening(false)
        }

        recognitionRef.current.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current.start()
        setIsListening(true)
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
        setIsListening(false)
    }

    // Update messages in current conversation
    const updateCurrentConvMessages = (newMessages: Message[]) => {
        setConversations(prev => prev.map(c =>
            c.id === currentConvId
                ? {
                    ...c,
                    messages: newMessages,
                    updatedAt: new Date(),
                    title: newMessages.length > 1 && newMessages[1].role === 'user'
                        ? newMessages[1].content.slice(0, 30) + (newMessages[1].content.length > 30 ? '...' : '')
                        : c.title
                }
                : c
        ))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading || !currentConvId) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        }

        const newMessages = [...messages, userMessage]
        updateCurrentConvMessages(newMessages)
        setInput('')
        setIsLoading(true)

        const assistantMessageId = (Date.now() + 1).toString()
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date()
        }

        // Add empty assistant message first
        updateCurrentConvMessages([...newMessages, assistantMessage])
        setStreamingMessageId(assistantMessageId)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                    stream: true
                }),
            })

            if (!response.ok) throw new Error('Failed to get response')

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let fullContent = ''

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value)
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6)
                            if (data === '[DONE]') continue
                            try {
                                const parsed = JSON.parse(data)
                                if (parsed.content) {
                                    fullContent += parsed.content
                                    // Update message content progressively
                                    setConversations(prev => prev.map(c =>
                                        c.id === currentConvId
                                            ? {
                                                ...c,
                                                messages: c.messages.map(m =>
                                                    m.id === assistantMessageId
                                                        ? { ...m, content: fullContent }
                                                        : m
                                                ),
                                                updatedAt: new Date()
                                            }
                                            : c
                                    ))
                                }
                            } catch {
                                // Skip invalid JSON
                            }
                        }
                    }
                }
            }

            playNotificationSound()
        } catch (error) {
            console.error('Error:', error)
            // Update with error message
            setConversations(prev => prev.map(c =>
                c.id === currentConvId
                    ? {
                        ...c,
                        messages: c.messages.map(m =>
                            m.id === assistantMessageId
                                ? { ...m, content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.' }
                                : m
                        )
                    }
                    : c
            ))
        } finally {
            setIsLoading(false)
            setStreamingMessageId(null)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    // Rating handlers
    const handleRating = (messageId: string, rating: 'up' | 'down') => {
        setConversations(prev => prev.map(c =>
            c.id === currentConvId
                ? {
                    ...c,
                    messages: c.messages.map(m =>
                        m.id === messageId
                            ? { ...m, rating: m.rating === rating ? null : rating }
                            : m
                    )
                }
                : c
        ))
    }

    // Conversation handlers
    const createConversation = () => {
        const newConv = createNewConversation()
        setConversations(prev => [newConv, ...prev])
        setCurrentConvId(newConv.id)
        setShowSidebar(false)
    }

    const deleteConversation = (id: string) => {
        if (conversations.length === 1) {
            const newConv = createNewConversation()
            setConversations([newConv])
            setCurrentConvId(newConv.id)
        } else {
            setConversations(prev => prev.filter(c => c.id !== id))
            if (currentConvId === id) {
                const remaining = conversations.filter(c => c.id !== id)
                setCurrentConvId(remaining[0]?.id || null)
            }
        }
    }

    const switchConversation = (id: string) => {
        setCurrentConvId(id)
        setShowSidebar(false)
    }

    // Dismiss welcome back message
    const dismissWelcomeBack = () => {
        setShowWelcomeBack(false)
    }

    const copyToClipboard = async (messageId: string, content: string) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedId(messageId)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    // Date formatting
    const formatDateLabel = (date: Date): string => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (date.toDateString() === today.toDateString()) return 'Hôm nay'
        if (date.toDateString() === yesterday.toDateString()) return 'Hôm qua'
        return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    }

    const shouldShowDateSeparator = (currentMsg: Message, prevMsg: Message | null): boolean => {
        if (!prevMsg) return true
        return currentMsg.timestamp.toDateString() !== prevMsg.timestamp.toDateString()
    }

    // Export chat
    const exportToTxt = () => {
        const content = messages.map(m => {
            const time = m.timestamp.toLocaleString('vi-VN')
            const role = m.role === 'user' ? 'Bạn' : 'X10'
            return `[${time}] ${role}:\n${m.content}\n`
        }).join('\n---\n\n')
        const header = `Cuộc trò chuyện với X10\nXuất ngày: ${new Date().toLocaleString('vi-VN')}\n${'='.repeat(50)}\n\n`
        const blob = new Blob([header + content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `chat-x10-${new Date().toISOString().slice(0, 10)}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const toggleTheme = () => setIsDarkMode(prev => !prev)

    // Text-to-Speech functions
    const speakMessage = (messageId: string, content: string) => {
        if (!ttsSupported) return

        // Stop any current speech
        window.speechSynthesis.cancel()

        if (speakingId === messageId) {
            // Toggle off if same message
            setSpeakingId(null)
            return
        }

        const utterance = new SpeechSynthesisUtterance(content)

        // Get available voices and find Vietnamese voice
        const voices = window.speechSynthesis.getVoices()
        const vietnameseVoice = voices.find(voice =>
            voice.lang.startsWith('vi') ||
            voice.name.toLowerCase().includes('vietnam') ||
            voice.name.toLowerCase().includes('vietnamese')
        )

        if (vietnameseVoice) {
            utterance.voice = vietnameseVoice
        }

        utterance.lang = 'vi-VN'
        utterance.rate = 1.0
        utterance.pitch = 1.0

        utterance.onstart = () => setSpeakingId(messageId)
        utterance.onend = () => setSpeakingId(null)
        utterance.onerror = () => setSpeakingId(null)

        // If voices not loaded yet, wait for them
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                const loadedVoices = window.speechSynthesis.getVoices()
                const viVoice = loadedVoices.find(v =>
                    v.lang.startsWith('vi') ||
                    v.name.toLowerCase().includes('vietnam')
                )
                if (viVoice) {
                    utterance.voice = viVoice
                }
                window.speechSynthesis.speak(utterance)
            }
        } else {
            window.speechSynthesis.speak(utterance)
        }
    }

    const stopSpeaking = () => {
        window.speechSynthesis.cancel()
        setSpeakingId(null)
    }

    const suggestedQuestions = [
        'Làm sao để phá vỡ trần tăng trưởng?',
        'Tôi muốn hiểu về Virtual Me và Real Me',
        'Chia sẻ về triết lý X10',
        'Làm sao để sống thật với chính mình?'
    ]

    return (
        <div className={`min-h-screen flex transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-purple-100 to-pink-100'}`}>
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-lg border-r ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-white/10">
                        <button
                            onClick={createConversation}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Cuộc trò chuyện mới
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer mb-1 ${conv.id === currentConvId ? (isDarkMode ? 'bg-white/10' : 'bg-purple-100') : 'hover:bg-white/5'}`}
                                onClick={() => switchConversation(conv.id)}
                            >
                                <svg className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className={`flex-1 truncate text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {conv.title}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                                    className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {showSidebar && (
                <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowSidebar(false)} />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className={`fixed top-0 left-0 right-0 z-30 glass ${!isDarkMode ? 'bg-white/80' : ''}`}>
                    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowSidebar(true)}
                                className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'}`}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-white flex items-center justify-center">
                                    <img src="/images/x10-logo.png" alt="X10" className="w-full h-full object-contain p-1" />
                                </div>
                                <div>
                                    <h1 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>X10</h1>
                                    <div className="flex items-center text-xs gap-2">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                            <span className="text-green-400">Online</span>
                                        </div>
                                        <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                                        <span className={`${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>v4.2</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-1">
                            <button onClick={exportToTxt} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'}`} title="Xuất chat">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                            <button onClick={toggleTheme} className={`p-2 rounded-full theme-toggle ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'}`} title={isDarkMode ? 'Sáng' : 'Tối'}>
                                {isDarkMode ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                )}
                            </button>
                            <Link href="/" className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'}`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Welcome Back Popup */}
                {showWelcomeBack && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className={`mx-4 max-w-md w-full rounded-2xl p-6 shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-500 bg-white flex items-center justify-center">
                                    <img src="/images/x10-logo.png" alt="X10" className="w-full h-full object-contain p-2" />
                                </div>
                                <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    👋 Chào mừng bạn quay lại!
                                </h2>
                                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {daysAway === 1
                                        ? 'Đã 1 ngày kể từ lần trước bạn ghé thăm.'
                                        : `Đã ${daysAway} ngày kể từ lần trước bạn ghé thăm.`
                                    }
                                </p>
                                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    💡 <em>Mỗi ngày dành 5 phút để reflect sẽ giúp bạn tiến bộ hơn!</em>
                                </p>
                                <button
                                    onClick={dismissWelcomeBack}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition"
                                >
                                    Bắt đầu trò chuyện ✨
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <main className="flex-1 overflow-y-auto pt-20 pb-40">
                    <div className="max-w-4xl mx-auto px-4">
                        {messages.map((message, index) => {
                            const prevMessage = index > 0 ? messages[index - 1] : null
                            const showDateSeparator = shouldShowDateSeparator(message, prevMessage)

                            return (
                                <div key={message.id}>
                                    {showDateSeparator && (
                                        <div className="flex items-center justify-center my-6">
                                            <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`}></div>
                                            <span className={`px-4 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDateLabel(message.timestamp)}</span>
                                            <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`}></div>
                                        </div>
                                    )}

                                    <div className={`flex mb-4 chat-bubble message-container group ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {message.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 mt-1 bg-white flex items-center justify-center border border-gray-200">
                                                <img src="/images/x10-logo.png" alt="X10" className="w-full h-full object-contain p-1" />
                                            </div>
                                        )}
                                        <div className="relative max-w-[80%]">
                                            <div className={`rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : isDarkMode ? 'glass text-gray-100' : 'bg-white shadow-md text-gray-800'}`}>
                                                <div className="text-sm md:text-base leading-relaxed">
                                                    {message.role === 'user' ? (
                                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                                    ) : (
                                                        <>
                                                            <MarkdownRenderer content={message.content} isDarkMode={isDarkMode} />
                                                            {streamingMessageId === message.id && (
                                                                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1"></span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className={`text-xs ${message.role === 'user' ? 'text-white/70' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        {/* TTS and Rating buttons for assistant messages */}
                                                        {message.role === 'assistant' && ttsSupported && message.content && (
                                                            <button
                                                                onClick={() => speakMessage(message.id, message.content)}
                                                                className={`p-1 rounded transition-colors ${speakingId === message.id ? 'text-cyan-400 animate-pulse' : isDarkMode ? 'text-gray-500 hover:text-cyan-400' : 'text-gray-400 hover:text-cyan-500'}`}
                                                                title={speakingId === message.id ? 'Dừng đọc' : 'Đọc tin nhắn'}
                                                            >
                                                                {speakingId === message.id ? (
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M6 6h12v12H6z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        )}
                                                        {/* Rating buttons for assistant messages */}
                                                        {message.role === 'assistant' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleRating(message.id, 'up')}
                                                                    className={`p-1 rounded transition-colors ${message.rating === 'up' ? 'text-green-400' : isDarkMode ? 'text-gray-500 hover:text-green-400' : 'text-gray-400 hover:text-green-500'}`}
                                                                >
                                                                    <svg className="w-4 h-4" fill={message.rating === 'up' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRating(message.id, 'down')}
                                                                    className={`p-1 rounded transition-colors ${message.rating === 'down' ? 'text-red-400' : isDarkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                                                                >
                                                                    <svg className="w-4 h-4" fill={message.rating === 'down' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => copyToClipboard(message.id, message.content)} className={`copy-btn p-1 rounded transition-colors ${copiedId === message.id ? 'text-green-400' : message.role === 'user' ? 'text-white/70 hover:text-white' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                                                            {copiedId === message.id ? (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {message.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 ml-3 flex-shrink-0 mt-1 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {isLoading && (
                            <div className="flex mb-4 justify-start chat-bubble">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 mt-1 bg-white flex items-center justify-center border border-gray-200">
                                    <img src="/images/x10-logo.png" alt="X10" className="w-full h-full object-contain p-1" />
                                </div>
                                <div className={`rounded-2xl px-4 py-3 ${isDarkMode ? 'glass' : 'bg-white shadow-md'}`}>
                                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Đang trả lời...</p>
                                </div>
                            </div>
                        )}

                        {messages.length <= 1 && (
                            <div className="mt-4 mb-8">
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gợi ý câu hỏi:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.map((question, index) => (
                                        <button key={index} onClick={() => setInput(question)} className={`text-sm px-4 py-2 rounded-full transition-all ${isDarkMode ? 'glass text-gray-300 hover:bg-white/10' : 'bg-white shadow-sm text-gray-700 hover:bg-gray-50'}`}>
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </main>

                {/* Input Area */}
                <div className={`fixed bottom-0 left-0 right-0 glass border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200 bg-white/80'}`}>
                    <div className="max-w-4xl mx-auto px-4 py-3">
                        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                            {/* Voice Input Button */}
                            {speechSupported && (
                                <button
                                    type="button"
                                    onClick={isListening ? stopListening : startListening}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isListening ? 'bg-red-500 animate-pulse' : isDarkMode ? 'bg-white/10 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                                >
                                    <svg className="w-5 h-5" fill={isListening ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                            )}

                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isListening ? 'Đang nghe...' : 'Nhập tin nhắn của bạn...'}
                                    className={`w-full rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[48px] max-h-[200px] transition-colors ${isDarkMode ? 'bg-white/10 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'}`}
                                    rows={1}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement
                                        target.style.height = 'auto'
                                        target.style.height = Math.min(target.scrollHeight, 200) + 'px'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all flex-shrink-0"
                            >
                                {isLoading ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Export wrapped with AuthGuard
export default function ChatPage() {
    return (
        <AuthGuard>
            <ChatPageContent />
        </AuthGuard>
    )
}
