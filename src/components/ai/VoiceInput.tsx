"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MicIcon, MicOffIcon } from "lucide-react"
import { toast } from "sonner"

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceInputProps {
  onTranscript?: (text: string) => void;
  onCommand?: (command: VoiceCommand) => void;
}

interface VoiceCommand {
  action: 'add-transaction' | 'search' | 'navigate' | 'unknown';
  amount?: number;
  category?: string;
  description?: string;
  query?: string;
  destination?: string;
}

export function VoiceInput({ onTranscript, onCommand }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onTranscript?.(transcript)
        
        // Parse command
        const command = parseVoiceCommand(transcript)
        onCommand?.(command)
        
        toast.success(`Heard: "${transcript}"`)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        toast.error('Voice recognition failed. Please try again.')
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognitionInstance
    }
  }, [onTranscript, onCommand])

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser')
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
      toast.info('Listening...')
    } catch (error) {
      console.error('Failed to start recognition:', error)
      toast.error('Failed to start voice recognition')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={isListening ? stopListening : startListening}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <MicOffIcon className="size-4 animate-pulse" />
      ) : (
        <MicIcon className="size-4" />
      )}
    </Button>
  )
}

function parseVoiceCommand(transcript: string): VoiceCommand {
  const lower = transcript.toLowerCase()

  // Add transaction: "add $50 coffee", "spent 30 dollars on lunch"
  const addMatch = lower.match(/(?:add|spent|paid)\s+(?:\$)?(\d+(?:\.\d+)?)\s+(?:dollars?\s+)?(?:on\s+)?(.+)/i)
  if (addMatch && addMatch[1] && addMatch[2]) {
    const amount = parseFloat(addMatch[1])
    const description = addMatch[2].trim()
    const category = inferCategory(description)
    
    return {
      action: 'add-transaction',
      amount,
      description,
      category,
    }
  }

  // Search: "find coffee transactions", "search for walmart"
  const searchMatch = lower.match(/(?:find|search|show)\s+(.+)/i)
  if (searchMatch && searchMatch[1]) {
    return {
      action: 'search',
      query: searchMatch[1].trim(),
    }
  }

  // Navigate: "go to budgets", "open settings"
  const navMatch = lower.match(/(?:go to|open|show)\s+(dashboard|budgets?|goals?|settings?|transactions?)/i)
  if (navMatch && navMatch[1]) {
    return {
      action: 'navigate',
      destination: navMatch[1].toLowerCase(),
    }
  }

  return {
    action: 'unknown',
  }
}

function inferCategory(description: string): string {
  const lower = description.toLowerCase()
  
  if (lower.match(/coffee|restaurant|lunch|dinner|food|eating/)) return 'Food & Dining'
  if (lower.match(/uber|lyft|gas|fuel|parking|transit/)) return 'Transportation'
  if (lower.match(/amazon|walmart|target|shopping|store/)) return 'Shopping'
  if (lower.match(/movie|concert|game|entertainment/)) return 'Entertainment'
  if (lower.match(/electric|water|internet|phone|bill/)) return 'Bills & Utilities'
  if (lower.match(/doctor|pharmacy|medicine|health/)) return 'Health'
  
  return 'Other'
}
