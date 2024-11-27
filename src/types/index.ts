export interface Partner {
  name: string;
  logo: string;
  alt?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
} 

export interface Settings {
  amount: number;
  frequency: string;
  dueDay: number;
}