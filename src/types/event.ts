export interface Event {
  id: string
  name: string
  instanceName: string
  url: string
  image: string
  imageThumbnail: string
  start: string // ISO 8601 datetime
  end: string // ISO 8601 datetime
  isLocal: boolean // true if local time, false if UTC
  period: string // ISO 8601 duration
  isConfirmed: boolean
  isTbd: boolean
  category: string
  evp: boolean
  isLive: boolean
  youtubeTrailerId?: string
}

export type CategoryType = string
