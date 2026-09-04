import React from 'react';
import { Box } from '@mui/material';
import type { ItemRendererProps } from '../../types';
import { resolveValue } from '../../utils/resolveValue';
import { GpsMap } from './GpsMap';

export const GpsMapComponent: React.FC<ItemRendererProps> = ({
                                                                 item,
                                                                 defaultStyle,
                                                                 onItemClick,
                                                             }) => {
    const width = resolveValue(item.width, defaultStyle?.width, 600);
    const height = resolveValue(item.height, defaultStyle?.height, 400);
    const label = resolveValue(item.label, defaultStyle?.label, 'GPS Map');
    const dataName = resolveValue(item.content, defaultStyle?.content, '');

    const onItemClickHandler = () => {
        if (onItemClick) onItemClick(item.id, item);
    };

    return (
        <Box
            onClick={onItemClickHandler}
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',

                // ⭐ Tactical theme colors
                backgroundColor: '#11181f',
                borderRadius: 2,
                border: '1px solid #1f2a33',
                boxShadow: '0 0 20px rgba(0,255,157,0.05)',

                padding: 2,
                gap: 2,
            }}
        >
            <GpsMap
                width={width}
                height={height}
                label={label}
                dataName={dataName}
            />
        </Box>
    );
};

export default GpsMapComponent;
