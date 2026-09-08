// src/components/renderers/Card/CardComponent.tsx
import React from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import ItemRenderer from '../ItemRenderer';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

export const CardComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const padding     = resolveValue(item.padding, defaultStyle?.padding, 2);
  const gap         = resolveValue(item.gap, defaultStyle?.gap, 1.5);
  const title       = resolveValue(item.title, undefined, '');
  const footer      = resolveValue(item.footer, undefined, '');
  const showBorder  = resolveValue(item.showBorder, defaultStyle?.showBorder, true);
  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, 'divider');

  const handleClick = () => {
    if (onItemClick) onItemClick(item.id, item);
  };

  return (
    <Card
      onClick={handleClick}
      aria-label={title || item.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: showBorder ? '1px solid' : 'none',
        borderColor,
        cursor: 'pointer',
      }}
    >
      {title && (
        <CardHeader
          title={title}
          titleTypographyProps={{ variant: 'subtitle2', component: 'h2' }}
          sx={{ pt: 1.5, pb: 0.5, px: padding }}
        />
      )}

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap,
          p: `${padding * 8}px !important`,
          pt: title ? '8px !important' : undefined,
        }}
      >
        {Array.isArray(item.items) &&
          item.items.map((nestedItem) => (
            <ItemRenderer
              key={nestedItem.id}
              item={nestedItem}
              defaultStyle={defaultStyle}
              onItemClick={onItemClick}
            />
          ))}
      </CardContent>

      {footer && (
        <Box sx={{ px: padding, pb: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            {footer}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default CardComponent;
