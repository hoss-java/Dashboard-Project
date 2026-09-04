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

  // Layout values
  const padding = resolveValue(item.padding, defaultStyle?.padding, 2);
  const gap = resolveValue(item.gap, defaultStyle?.gap, 1);

  const direction = resolveValue(item.direction, defaultStyle?.direction, 'column');
  const wrap = resolveValue(item.wrap, defaultStyle?.wrap, 'nowrap');

  const align = resolveValue(item.align, defaultStyle?.align, 'left') as
      | 'left'
      | 'center'
      | 'right';

  //  Full-width by default (instead of auto)
  const width = resolveValue(item.width, defaultStyle?.width, '100%');

  // Visuals
  const showBorder = resolveValue(item.showBorder, defaultStyle?.showBorder, false);
  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, '#1f2a33');
  const backgroundColor = resolveValue(item.backgroundColor, defaultStyle?.backgroundColor, '#11181f');

  const onItemClickHandler = () => {
    console.info('[BoxComponent] Box clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  const getBoxSx = () => ({
    display: 'flex',
    flexDirection: direction,
    flexWrap: wrap,
    gap,
    padding,
    width, //  full-width tactical layout
    border: showBorder ? `1px solid ${borderColor}` : 'none',
    borderRadius: 2,
    backgroundColor,
    justifyContent:
        align === 'left'
            ? 'flex-start'
            : align === 'center'
                ? 'center'
                : 'flex-end',
  });

  const renderItems = () => {
    if (!item.items || !Array.isArray(item.items)) return null;

    return item.items.map((nestedItem) => (
        <ItemRenderer
            key={nestedItem.id}
            item={nestedItem}
            defaultStyle={defaultStyle}
            onItemClick={onItemClickHandler}
        />
    ));
  };

  return (
      <Box onClick={onItemClickHandler} sx={getBoxSx()}>
        {renderItems()}
      </Box>
  );
};

export default BoxComponent;
