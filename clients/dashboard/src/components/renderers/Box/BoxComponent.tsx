// src/components/renderers/components/Box/BoxComponent.tsx
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

  const padding = resolveValue(item.padding, defaultStyle?.padding, 2);
  const gap = resolveValue(item.gap, defaultStyle?.gap, 1);
  const align = resolveValue(item.align, defaultStyle?.align, 'left') as 'left' | 'center' | 'right';
  const showBorder = resolveValue(item.showBorder, defaultStyle?.showBorder, false);
  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, '#e0e0e0');
  const backgroundColor = resolveValue(item.backgroundColor, defaultStyle?.backgroundColor, '#fafafa');

  const onItemClickHandler = () => {
    console.info('[BoxComponent] Box clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  const getBoxSx = () => ({
    display: 'flex',
    flexDirection: 'column',
    gap,
    padding,
    border: showBorder ? `1px solid ${borderColor}` : 'none',
    borderRadius: 1,
    backgroundColor,
    justifyContent: {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    }[align],
  });

  const renderItems = () => {
    if (!item.items || !Array.isArray(item.items)) return null;
    return item.items.map((nestedItem) => (
      <ItemRenderer
        item={nestedItem}
        defaultStyle={defaultStyle}

        onItemClick={onItemClickHandler}
      />
    ));
  };

  return (
    <Box
      onClick={onItemClickHandler}
      sx={getBoxSx()}
    >
      {renderItems()}
    </Box>
  );
};

export default BoxComponent;
