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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: 2,
                backgroundColor: '#fafafa',
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
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
