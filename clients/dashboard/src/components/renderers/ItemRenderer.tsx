// src/components/renderers/ItemRenderer.tsx
import React from 'react';
import { componentRegistry } from './ComponentRegistry';
import type { ItemRendererProps } from '../types';

export const ItemRenderer: React.FC<ItemRendererProps> = ({ item, defaultStyle, onItemClick }) => {
  const config = componentRegistry.getComponent(item.type);

  if (!config) {
    return (
      <div
        role="alert"
        style={{
          padding: '12px 16px',
          color: '#f87171',
          border: '1px solid #f87171',
          borderRadius: 8,
          fontSize: 13,
          background: 'rgba(248,113,113,0.08)',
        }}
      >
        Unknown component type: <strong>{item.type}</strong>
      </div>
    );
  }

  const Component = config.component;
  return (
    <Component
      item={item}
      defaultStyle={defaultStyle}
      onItemClick={onItemClick}
    />
  );
};

export default ItemRenderer;
