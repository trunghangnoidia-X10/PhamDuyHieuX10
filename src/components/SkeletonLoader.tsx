interface SkeletonLoaderProps {
    isDarkMode?: boolean;
}

export default function SkeletonLoader({ isDarkMode = true }: SkeletonLoaderProps) {
    return (
        <div className="flex mb-4 justify-start chat-bubble">
            <div className={`w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 mt-1 flex items-center justify-center animate-pulse ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
            </div>
            <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${isDarkMode ? 'glass' : 'bg-white shadow-md'}`}>
                <div className="opacity-70 space-y-2">
                    <div className={`h-4 rounded w-[200px] animate-pulse ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    <div className={`h-4 rounded w-[150px] animate-pulse delay-75 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    <div className={`h-4 rounded w-[180px] animate-pulse delay-150 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                </div>
                <div className="mt-3 opacity-50 space-y-2">
                    <div className={`h-3 rounded w-[100px] animate-pulse delay-200 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                </div>
            </div>
        </div>
    )
}
