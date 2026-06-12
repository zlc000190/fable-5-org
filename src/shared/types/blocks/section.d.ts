import { Image, Button } from '@/types/blocks/base'

export interface SectionItem {
  title?: string
  description?: string
  prompt?: string
  label?: string
  icon?: string
  image?: Image
  originalImage?: Image
  videoSrc?: string
  buttons?: Button[]
  url?: string
  target?: string
  children?: SectionItem[]
}

export interface VideoShowcaseSection {
  title?: string
  description?: string
  items?: SectionItem[]
  buttons?: Button[]
}

export interface Section {
  disabled?: boolean
  name?: string
  title?: string
  description?: string
  label?: string
  icon?: string
  image?: Image
  buttons?: Button[]
  items?: SectionItem[]
  textToVideo?: VideoShowcaseSection
  imageToVideo?: VideoShowcaseSection
}
