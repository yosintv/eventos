import { useEffect } from 'react'
import type { MetaTags as IMetaTags } from '../../utils/seo'
import { buildMetaTags } from '../../utils/seo'

interface MetaTagsProps extends IMetaTags {}

export function MetaTags({ title, description, image, url, type, keywords }: MetaTagsProps) {
  useEffect(() => {
    // Update page title
    document.title = title

    // Get or create meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement('meta')
        element.name = name
        document.head.appendChild(element)
      }
      element.content = content
    }

    const updateProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.content = content
    }

    const meta = buildMetaTags({ title, description, image, url, type, keywords })

    // Update all meta tags
    Object.entries(meta).forEach(([key, value]) => {
      if (key === 'og:title' || key.startsWith('og:')) {
        updateProperty(key, value)
      } else if (key === 'twitter:card' || key.startsWith('twitter:')) {
        updateMeta(key, value)
      } else if (key !== 'canonical') {
        updateMeta(key, value)
      }
    })

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, image, url, type, keywords])

  return null
}
