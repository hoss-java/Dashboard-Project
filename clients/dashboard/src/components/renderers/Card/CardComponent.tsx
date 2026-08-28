// src/components/renderers/components/Card/CardComponent.tsx
import React from 'react';
import {
  Box,
  Card, 
  CardContent,
  CardHeader
} from '@mui/material';

import ItemRenderer from '../ItemRenderer';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

export const CardComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,

  onItemClick,
}) => {
  const padding = resolveValue(item.padding, defaultStyle?.padding, 2);
  const gap = resolveValue(item.gap, defaultStyle?.gap, 1);
  const title = resolveValue(item.title, undefined, '');
  const footer = resolveValue(item.footer, undefined, '');
  const showBorder = resolveValue(item.showBorder, defaultStyle?.showBorder, true);
  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, '#e0e0e0');
  const backgroundColor = resolveValue(item.backgroundColor, defaultStyle?.backgroundColor, '#ffffff');

  const onItemClickHandler = () => {
    console.info('[CardComponent] Card clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  const getCardSx = () => ({
    border: showBorder ? `1px solid ${borderColor}` : 'none',
    backgroundColor,
    boxShadow: 2,
    borderRadius: 1,
  });

  const getContentSx = () => ({
    display: 'flex',
    flexDirection: 'column',
    gap,
    padding,
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
    <Card onClick={onItemClickHandler} sx={getCardSx()}>
      {title && <CardHeader title={title} />}
      <CardContent sx={getContentSx()}>
        {renderItems()}
      </CardContent>
      {footer && (
        <Box sx={{ padding, borderTop: `1px solid ${borderColor}`, fontSize: 'small', color: '#666' }}>
          {footer}
        </Box>
      )}
    </Card>
  );
};

export default CardComponent;
