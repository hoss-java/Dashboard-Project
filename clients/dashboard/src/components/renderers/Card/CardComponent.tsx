// src/components/renderers/components/Card/CardComponent.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography
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

  // Tactical colors
  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, '#1f2a33');
  const backgroundColor = resolveValue(item.backgroundColor, defaultStyle?.backgroundColor, '#11181f');

  const onItemClickHandler = () => {
    console.info('[CardComponent] Card clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  // 🎖️ Tactical card styling
  const getCardSx = () => ({
    border: showBorder ? `1px solid ${borderColor}` : 'none',
    backgroundColor,
    borderRadius: 2,
    boxShadow: '0 0 20px rgba(0,255,157,0.05)',
    transition: '0.2s ease',
    '&:hover': {
      boxShadow: '0 0 25px rgba(0,255,157,0.15)',
      borderColor: '#00ff9d',
      cursor: 'pointer',
    }
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
        {title && (
            <CardHeader
                title={
                  <Typography
                      variant="h6"
                      sx={{
                        color: resolveValue(item.titleColor, defaultStyle?.titleColor, '#00ff9d'),
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 1,
                        textShadow: '0 0 8px rgba(0,255,157,0.6)',
                        textTransform: 'uppercase'
                      }}
                  >
                    {item.title}
                  </Typography>
                }
            />
        )}

        <CardContent sx={getContentSx()}>
          {renderItems()}
        </CardContent>

        {footer && (
            <Box
                sx={{
                  padding,
                  borderTop: `1px solid ${borderColor}`,
                  fontSize: '0.75rem',
                  color: '#00bcd4',
                  fontFamily: "'Share Tech Mono', monospace",
                  opacity: 0.7,
                  letterSpacing: 1,
                }}
            >
              {footer}
            </Box>
        )}
      </Card>
  );
};

export default CardComponent;
