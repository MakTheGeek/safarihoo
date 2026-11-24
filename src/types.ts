export type ServiceTab = 'Flights' | 'Hotels' | 'Cars' | 'Cruises';

export type NavItem =
  | 'Flights'
  | 'Hotels'
  | 'Cars'
  | 'AirHelp'
  | 'Contact'
  | 'About'
  | 'Careers'
  | 'FAQs'
  | 'Whitepaper'
  | 'Privacy'
  | 'Security'
  | 'Terms'
  | 'Acceptance'
  | 'Admin';

export interface DestinationSuggestion {
  id: string;
  city: string;
  country: string;
  price: string;
  imageUrl: string;
  tag?: string;
  likes?: number;
}

export interface SearchState {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  adults: number;
  children: number;
  cabinClass: string;
}

export type CmsContentGroup =
  | 'hero'
  | 'hotels'
  | 'cars'
  | 'airhelp'
  | 'trust'
  | 'destinations'
  | 'reviews'
  | 'about'
  | 'faq'
  | 'footer'
  | 'attractions'
  | 'contact'
  | 'custom';

export interface SiteContentItem {
  id: string;
  key: string;
  en: string;
  fr: string;
  group: CmsContentGroup;
  label: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type SiteFileCategory = 'image' | 'document' | 'media' | 'asset';
export type SiteFileStorageMode = 'inline' | 'external';

export interface SiteFileItem {
  id: string;
  name: string;
  mimeType: string;
  category: SiteFileCategory;
  storageMode: SiteFileStorageMode;
  dataUrl: string;
  externalUrl: string;
  sizeBytes: number;
  description: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type SiteLinkPlacement =
  | 'header'
  | 'footer_company'
  | 'footer_services'
  | 'footer_resources'
  | 'footer_legal'
  | 'custom_bar';

export interface SiteLinkItem {
  id: string;
  labelEn: string;
  labelFr: string;
  url: string;
  placement: SiteLinkPlacement;
  openInNewTab: boolean;
  active: boolean;
  order: number;
  description: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type AttractionCategory = 'Adventure' | 'Culture' | 'Wellness';

export interface SiteAttractionItem {
  id: string;
  title: string;
  titleFr: string;
  price: number;
  description: string;
  descriptionFr: string;
  tag: string;
  tagFr: string;
  duration: string;
  durationFr: string;
  category: AttractionCategory;
  location: string;
  imageUrl: string;
  bookingUrl: string;
  highlights: string[];
  highlightsFr: string[];
  active: boolean;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type DestinationCategory = 'Cities' | 'Historic' | 'Beach' | 'Wonders';

export interface SiteDestinationItem {
  id: string;
  title: string;
  titleFr: string;
  name: string;
  location: string;
  country: string;
  categories: DestinationCategory[];
  mainImage: string;
  thumbnails: string[];
  distance: string;
  temp: string;
  rating: string;
  price: string;
  tag: string;
  tagFr: string;
  description: string;
  descriptionFr: string;
  bookingUrl: string;
  active: boolean;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type ReviewCategory = 'flights' | 'hotels' | 'cars' | 'airhelp';

export type ReviewCardStyle =
  | 'quote-top'
  | 'avatar-top-stars'
  | 'headline-stars'
  | 'quote-bottom-avatar'
  | 'cursive-signature'
  | 'headline-avatars';

export interface SiteReviewItem {
  id: string;
  name: string;
  role: string;
  roleFr: string;
  headline: string;
  headlineFr: string;
  text: string;
  textFr: string;
  rating: number;
  category: ReviewCategory;
  cardStyle: ReviewCardStyle;
  avatar: string;
  active: boolean;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

