'use client'

import { useState, useEffect } from 'react'
import horoscopeData from '../data/horoscopes.json'

type SignKey = 'frontend' | 'backend' | 'devops' | 'mobile' | 'fullstack' | 'security'

interface Reading {
  vibe: string
  warning: string
  luckyCommit: string
  bugPrediction: string
  beverage: string
  luckyHours: string
  color: string
}

interface Sign {
  name: string
  symbol: string
  readings: Reading[]
}

const signs: Record<SignKey, Sign> = horoscopeData.horoscopes as Record<SignKey, Sign>

function getDailyIndex(): number {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  return dayOfYear % 5
}

function StarBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
    </div>
  )
}

function SignCard({ 
  signKey, 
  sign, 
  reading, 
  isSelected, 
  onClick 
}: { 
  signKey: SignKey
  sign: Sign
  reading: Reading
  isSelected: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-2xl border transition-all duration-300 text-left w-full
        ${isSelected 
          ? 'border-white/40 bg-white/10 scale-105 shadow-2xl' 
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:scale-102'
        }`}
      style={{ 
        boxShadow: isSelected ? `0 0 60px ${reading.color}30` : undefined 
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{sign.symbol}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{sign.name}</h3>
          <p className="text-sm text-white/60">Click to reveal your destiny</p>
        </div>
      </div>
      
      {isSelected && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div 
            className="p-4 rounded-xl border-l-4"
            style={{ borderLeftColor: reading.color, backgroundColor: `${reading.color}15` }}
          >
            <p className="text-lg leading-relaxed">{reading.vibe}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-200">⚠️ {reading.warning}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Lucky Commit</p>
              <p className="font-mono text-emerald-300">{reading.luckyCommit}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Bug Prophecy</p>
              <p className="text-orange-300">{reading.bugPrediction}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Sacred Beverage</p>
              <p className="text-blue-300">{reading.beverage}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Auspicious Hours</p>
              <p className="text-purple-300">{reading.luckyHours}</p>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}

export default function Home() {
  const [selectedSign, setSelectedSign] = useState<SignKey | null>(null)
  const [dailyIndex, setDailyIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDailyIndex(getDailyIndex())
  }, [])

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  if (!mounted) return null

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <StarBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-float">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mb-6">
            <div className="bg-slate-900 rounded-full p-4">
              <span className="text-5xl">🗿</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
            Dev Horoscope
          </h1>
          <p className="text-xl text-white/70 mb-2">Daily prophecies for the coding cosmos</p>
          <p className="text-sm text-white/50">{today}</p>
        </header>

        {/* Intro */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-white/80 leading-relaxed">
            The stars have aligned. The servers are watching. Select your code sign 
            to receive today's cosmic guidance for your development journey.
          </p>
        </div>

        {/* Sign Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.keys(signs) as SignKey[]).map((key) => (
            <SignCard
              key={key}
              signKey={key}
              sign={signs[key]}
              reading={signs[key].readings[dailyIndex]}
              isSelected={selectedSign === key}
              onClick={() => setSelectedSign(selectedSign === key ? null : key)}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-white/40 text-sm">
          <p>Made with 🗿 by Henry the Great</p>
          <p className="mt-2">Remember: The stars may guide us, but git blame reveals the truth.</p>
        </footer>
      </div>
    </main>
  )
}
