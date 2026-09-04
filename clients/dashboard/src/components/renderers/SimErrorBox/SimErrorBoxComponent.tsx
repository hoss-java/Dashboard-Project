// src/components/renderers/components/SimErrorBox/SimErrorBoxComponent.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import type { ItemRendererProps } from '../../types';

type SimError = {
    id: string;
    timestamp: number;
    message: string;
};

export const SimErrorBoxComponent: React.FC<ItemRendererProps> = ({
                                                                      item,
                                                                      defaultStyle,
                                                                  }) => {

    // Tactical error pool
    const errorPool = [
        "ENGINE OVERHEATED",
        "WATERPUMP TEMPERATURE CRITICAL",
        "FUEL PRESSURE UNSTABLE",
        "BATTERY VOLTAGE DROP",
        "COOLING SYSTEM OVERLOAD",
        "OIL TEMPERATURE SPIKE",
        "PROPULSION TORQUE ANOMALY",
        "NAVIGATION SENSOR FAULT",
        "HYDRAULIC PRESSURE WARNING",
    ];

    const [errors, setErrors] = useState<SimError[]>([
        {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            message: "SYSTEM ONLINE",
        }
    ]);

    // Generate new simulated error every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const msg = errorPool[Math.floor(Math.random() * errorPool.length)];

            setErrors(prev => [
                {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    message: msg,
                },
                ...prev
            ].slice(0, 20)); // keep last 20
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    // Tactical container styling
    const getContainerSx = (): SxProps<Theme> => ({
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        px: 2,
        py: 2,
        backgroundColor: '#11181f',
        borderRadius: 2,
        border: `1px solid #1f2a33`,
        boxShadow: '0 0 12px rgba(0,255,157,0.15)',
        width: '100%',
        maxWidth: item.width ?? 260,
        height: item.height ?? 260,
        overflowY: 'auto',
    });

    const getTitleSx = (): SxProps<Theme> => ({
        fontWeight: 600,
        color: '#00ff9d',
        fontFamily: "'Share Tech Mono', monospace",
        letterSpacing: 1,
        textTransform: 'uppercase',
        mb: 1,
    });

    const getErrorItemSx = (): SxProps<Theme> => ({
        backgroundColor: '#0d141a',
        borderLeft: '3px solid #ff4d4d',
        borderRadius: 1,
        px: 1,
        py: 0.5,
        mb: 1,
    });

    return (
        <Box sx={getContainerSx()}>
            <Typography variant="subtitle2" sx={getTitleSx()}>
                {item.label ?? "SYSTEM ERRORS"}
            </Typography>

            {errors.map(err => (
                <Box key={err.id} sx={getErrorItemSx()}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#ff4d4d',
                            fontFamily: "'Share Tech Mono', monospace",
                            letterSpacing: 1,
                            fontWeight: 600,
                        }}
                    >
                        {err.message}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            color: '#00bcd4',
                            opacity: 0.8,
                            fontFamily: "'Share Tech Mono', monospace",
                        }}
                    >
                        {formatTime(err.timestamp)}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default SimErrorBoxComponent;
