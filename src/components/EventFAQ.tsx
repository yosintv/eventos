import { useState } from 'react'
import type { Event } from '../types/event'
import { formatDate, formatDateTime } from '../utils/formatters'

interface EventFAQProps {
  event: Event
}

export function EventFAQ({ event }: EventFAQProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      question: `When is ${event.name}?`,
      answer: `${event.name} starts on ${formatDate(event.start)} at ${formatDateTime(event.start).split(' ').slice(-2).join(' ')}. Mark your calendar now!`,
    },
    {
      question: `What time does ${event.name} start?`,
      answer: `${event.name} starts at ${formatDateTime(event.start).split(' ').slice(-2).join(' ')} on ${formatDate(event.start)}.`,
    },
    {
      question: `Where can I watch ${event.name}?`,
      answer: `${event.name} will be available on various streaming platforms and official broadcasters. Check the event details for more information about viewing options.`,
    },
    {
      question: `Is ${event.name} confirmed?`,
      answer: `${event.isConfirmed ? 'Yes, this event is confirmed.' : 'This event is tentative and may be subject to change.'}`,
    },
    {
      question: `How many days until ${event.name}?`,
      answer: `Use our countdown timer above to see exactly how many days, hours, minutes, and seconds until ${event.name} begins!`,
    },
    {
      question: `Can I add ${event.name} to my calendar?`,
      answer: `Yes! Click the "Add to Calendar" button on this page to add ${event.name} to Google Calendar or download an .ics file.`,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="card overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full px-6 py-4 md:py-5 flex items-center justify-between gap-4 hover:bg-blue-50/50 transition-colors text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-expanded={openFaq === index}
              aria-controls={`faq-${index}`}
            >
              <h3 className="font-bold text-gray-900 text-sm md:text-base pr-4">
                {faq.question}
              </h3>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center transition-transform duration-300 ${
                openFaq === index ? 'rotate-180' : ''
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {/* Answer */}
            {openFaq === index && (
              <div
                id={`faq-${index}`}
                className="px-6 py-4 md:py-5 bg-blue-50/50 border-t border-blue-100 animate-slide-down text-gray-700 leading-relaxed"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Schema */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        })}
      </script>
    </div>
  )
}
