// src/components/renderers/Box/BoxComponent.tsx
import React from 'react';
import { Box } from '@mui/material';
import ItemRenderer from '../ItemRenderer';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

export const BoxComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const padding         = resolveValue(item.padding, defaultStyle?.padding, 2);
  const gap             = resolveValue(item.gap, defaultStyle?.gap, 2);
  const showBorder      = resolveValue(item.showBorder, defaultStyle?.showBorder, false);
  const borderColor     = resolveValue(item.borderColor, defaultStyle?.borderColor, 'divider');
  const backgroundColor = resolveValue(item.backgroundColor, defaultStyle?.backgroundColor, 'transparent');

  return (
    <Box
      role="group"
      aria-label={item.label || item.id}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap,
        p: padding,
        border: showBorder ? '1px solid' : 'none',
        borderColor,
        borderRadius: 2,
        backgroundColor,
        width: '100%',
        alignItems: 'stretch',
      }}
    >
      {Array.isArray(item.items) &&
        item.items.map((nestedItem) => (
          <Box key={nestedItem.id} sx={{ flex: '1 1 240px', minWidth: 0 }}>
            <ItemRenderer
              item={nestedItem}
              defaultStyle={defaultStyle}
              onItemClick={onItemClick}
            />
          </Box>
        ))}
    </Box>
  );
};

export default BoxComponent;
