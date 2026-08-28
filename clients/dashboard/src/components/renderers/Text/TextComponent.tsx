// src/components/renderers/components/Text/TextComponent.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

export const TextComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,

  onItemClick,
}) => {

  const fontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 16);
  const fontWeight = resolveValue(item.fontWeight, defaultStyle?.fontWeight, 'normal') as 'normal' | 'bold' | 'lighter';
  const content = resolveValue(item.content, defaultStyle?.content, '');

  const onItemClickHandler = () => {
    console.info('[TextComponent] Text clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  const getTextSx = () => ({
    fontSize,
    fontWeight,
    cursor: 'pointer',
    mb: 2,
  });

  return (
    <Typography
      sx={getTextSx()}
      onClick={onItemClickHandler}
    >
      {content}
    </Typography>
  );
};

export default TextComponent;
