// src/components/renderers/ItemRenderer.tsx
import { componentRegistry } from './ComponentRegistry';
import type { 
  ItemRendererProps,
  Item
} from '../types';

export const ItemRenderer: React.FC<ItemRendererProps> = ({
  item,

  onItemClick,
}) => {

  const config = componentRegistry.getComponent(item.type);

  if (!config) {
    return (
      <div style={{ padding: '16px', color: 'red', border: '1px solid red' }}>
        Unknown component type: <strong>{item.type}</strong>
      </div>
    );
  }

  const Component = config.component;
  return (
    <Component 
      item={item} 
      onItemClick={onItemClick} 
    />
  );
}

export default ItemRenderer;
