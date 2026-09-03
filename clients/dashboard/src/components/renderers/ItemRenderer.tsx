// src/components/renderers/ItemRenderer.tsx

import React from 'react';
import { componentMap } from './ComponentRegistry';
import type { ItemRendererProps } from '../types';

export const ItemRenderer: React.FC<ItemRendererProps> = (props) => {
  const { item } = props;
  const Component = componentMap[item.type];

  if (!Component) {
    return (
        <div style={{ color: 'red', padding: '10px', border: '2px solid red', margin: '10px' }}>
          ❌ Unknown component type: <strong>{item.type}</strong>
        </div>
    );
  }

  return <Component {...props} />;
};

export default ItemRenderer;