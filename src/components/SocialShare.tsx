import { SHARE_URLS } from '../utils/constants'

interface SocialShareProps {
  title: string
  url: string
}

export function SocialShare({ title, url }: SocialShareProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <a
        href={SHARE_URLS.twitter(title, url)}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold text-sm"
      >
        Twitter
      </a>
      <a
        href={SHARE_URLS.facebook(url)}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
      >
        Facebook
      </a>
      <a
        href={SHARE_URLS.linkedin(url)}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold text-sm"
      >
        LinkedIn
      </a>
      <button
        onClick={handleCopyLink}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
      >
        Copy Link
      </button>
    </div>
  )
}
