// src/components/types.ts

export type ItemType = 
  | 'text' 
  | 'box'
  | 'card';


export interface Item {
  id: string;
  type: ItemType;
  icon?: any;
  visible?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export interface ItemRendererProps {
  item: Item;
  onItemClick?: (itemId: string, item: Item) => void;
  [key: string]: any;
}

// Generic style configuration for all items
export interface DefaultStyle {
  align?: 'left' | 'center' | 'right';
  padding?: number;
  gap?: number;
  showBorder?: boolean;
  borderColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  fontWeight?: 'normal' | 'bold';
  [key: string]: any;
}

// Base interface for all items
export interface BaseItemStyle {
  id: string;
  type: ItemType;
  label?: string;
  props?: Record<string, any>;
  [key: string]: any;
}

// Box-specific interface
export interface BoxItemStyle extends BaseItemStyle {
  type: 'box';

}

// Text-specific interface
export interface TextItemStyle extends BaseItemStyle {
  type: 'text';
  content?: string;
}

// Card-specific interface
export interface CardItemStyle extends BaseItemStyle {
  type: 'card';
  title?: string;
  footer?: string;
}
