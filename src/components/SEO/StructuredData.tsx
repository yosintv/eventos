import { useEffect } from 'react'

interface StructuredDataProps {
  schema: string
  type?: 'event' | 'organization' | 'breadcrumb' | 'collection'
}

export function StructuredData({ schema }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = schema
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [schema])

  return null
}
