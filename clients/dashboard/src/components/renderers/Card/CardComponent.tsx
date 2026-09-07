// src/components/renderers/components/Card/CardComponent.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ItemRenderer from '../ItemRenderer';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps, Item } from '../../types';

export const CardComponent: React.FC<ItemRendererProps> = ({
                                                               item,
                                                               defaultStyle,
                                                               onItemClick,
                                                           }) => {
    const padding = resolveValue(item.padding, defaultStyle?.padding, 2);
    const gap = resolveValue(item.gap, defaultStyle?.gap, 1);
    const title = resolveValue(item.title, undefined, '');
    const footer = resolveValue(item.footer, undefined, '');
    const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, '#2a3440');
    const backgroundColor = resolveValue(item.backgroundColor, defaultStyle?.backgroundColor, '#2a3440');

    const onItemClickHandler = () => {
        if (onItemClick) onItemClick(item.id, item);
    };

    return (
        <Box
            onClick={onItemClickHandler}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap,
                padding,
                backgroundColor,
                borderRadius: 2,
                border: `1px solid ${borderColor}`,
                boxShadow: '0 0 20px rgba(255,255,255,0.05)',   // white glow
                transition: '0.2s ease',
                '&:hover': {
                    boxShadow: '0 0 25px rgba(255,255,255,0.15)', // white hover glow
                    borderColor: '#ffffff',                       // white hover border
                    cursor: 'pointer',
                }
            }}
        >
            {title && (
                <Typography
                    variant="h6"
                    sx={{
                        color: '#ffffff',                            // white title
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        mb: 1
                    }}
                >
                    {title}
                </Typography>
            )}

            {item.items?.map((nestedItem: Item) => (
                <ItemRenderer
                    key={nestedItem.id}
                    item={nestedItem}
                    defaultStyle={defaultStyle}
                    onItemClick={onItemClickHandler}
                />
            ))}

            {footer && (
                <Typography
                    sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: `1px solid ${borderColor}`,
                        color: '#ffffff',                            // white footer text
                        fontFamily: "'Share Tech Mono', monospace",
                        opacity: 0.7,
                        letterSpacing: 1,
                        fontSize: '0.75rem'
                    }}
                >
                    {footer}
                </Typography>
            )}
        </Box>
    );
};

export default CardComponent;
