// src/components/types.ts

export type ItemType = 
  | 'text' 
  | 'box'
  | 'card'
  | 'historyDiagram'
  | 'binarySwitch'
  | 'numericDisplay';

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

export interface BinarySwitchItemStyle extends BaseItemStyle {
  type: 'binarySwitch';
  label?: string;
  onLabel?: string;
  offLabel?: string;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
  borderColor?: string;
  onStatusColor?: string;
  offStatusColor?: string;
}

// History Diagram-specific interface
export interface HistoryDiagramItemStyle extends BaseItemStyle {
  type: 'historyDiagram';
  content?: string;
  width?: number;
  height?: number;
  minValue?: number;
  maxValue?: number;
  lineColor?: string;
}


// src/components/types.ts - Add to NumericDisplayItemStyle

export interface NumericDisplayItemStyle extends BaseItemStyle {
  type: 'numericDisplay';
  content?: string; // data name to subscribe to
  label?: string;
  value?: number;
  
  // ===== TEXT FORMATTING =====
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: 'standard' | 'currency' | 'percentage' | 'custom';
  showUnit?: boolean;
  
  // ===== TEXT STYLING =====
  fontSize?: number;
  labelFontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'lighter';
  alignment?: 'left' | 'center' | 'right';
  valueColor?: string;
  labelColor?: string;
  
  // ===== CONTAINER STYLING =====
  backgroundColor?: string;
  borderColor?: string;
  showBorder?: boolean;
  padding?: number;
  gap?: number;
  animateChanges?: boolean;
  
  // ===== VISUAL VARIANTS =====
  variant?: 'text' | 'bar' | 'gauge' | 'thermometer' | 'trend'; // NEW
  minValue?: number; // for range-based variants
  maxValue?: number; // for range-based variants
  barHeight?: number; // for 'bar' variant (default: 8)
  barColor?: string; // for 'bar' variant (default: 'primary')
  gaugeSize?: number; // for 'gauge' variant in pixels (default: 120)
  gaugeThickness?: number; // for 'gauge' variant (default: 8)
  gaugeColor?: string; // for 'gauge' variant (default: 'primary')
  thermometerHeight?: number; // for 'thermometer' variant in pixels (default: 150)
  trendWindow?: number; // for 'trend' variant - number of data points to track (default: 10)
}

