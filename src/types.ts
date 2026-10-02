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
  | 'Acceptance';

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
