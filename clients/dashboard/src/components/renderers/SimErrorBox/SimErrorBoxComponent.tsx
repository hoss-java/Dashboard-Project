import React, { useEffect, useState } from 'react';
import { Box, Typography, SxProps, Theme, Modal } from '@mui/material';
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

    const errorPool = [
        "ENGINE OVERHEATED",
        "WATERPUMP TEMPERATURE CRITICAL",
        "FUEL PRESSURE UNSTABLE",
        "BATTERY VOLTAGE DROP",
        "COOLING SYSTEM OVERLOAD",
        "OIL TEMPERATURE SPIKE",
        "PROPULSION TORQUE ANOMALY",
        "NAVIGATION SENSOR FAULT",
        "HYDRAULIC PRESSURE WARNING"
    ];

    const [errors, setErrors] = useState<SimError[]>([
        {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            message: "SYSTEM ONLINE"
        }
    ]);

    const [selectedError, setSelectedError] = useState<SimError | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const msg = errorPool[Math.floor(Math.random() * errorPool.length)];

            setErrors(prev => [
                {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    message: msg
                },
                ...prev
            ].slice(0, 20));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    // ⭐ FAILURE DESCRIPTION GENERATOR
    const getFailureDescription = (msg: string): string => {
        switch (msg) {
            case "ENGINE OVERHEATED":
                return "The engine block temperature has exceeded safe operational limits. Continued operation may cause piston seizure or cylinder wall damage. Immediate cooldown recommended.";
            case "WATERPUMP TEMPERATURE CRITICAL":
                return "The primary cooling pump is overheating, reducing coolant flow. This can lead to rapid engine temperature spikes and potential pump failure.";
            case "FUEL PRESSURE UNSTABLE":
                return "Fuel rail pressure is fluctuating outside normal tolerance. Possible causes include clogged injectors, failing fuel pump, or air intrusion in the fuel line.";
            case "BATTERY VOLTAGE DROP":
                return "Battery output has fallen below expected levels. Alternator output may be insufficient or the battery may be nearing end-of-life.";
            case "COOLING SYSTEM OVERLOAD":
                return "Coolant temperature is rising faster than the system can dissipate heat. Radiator flow or pump efficiency may be compromised.";
            case "OIL TEMPERATURE SPIKE":
                return "Lubrication oil temperature has increased sharply. This can reduce lubrication efficiency and accelerate engine wear.";
            case "PROPULSION TORQUE ANOMALY":
                return "Detected irregular torque output from the propulsion system. Possible shaft misalignment or propeller obstruction.";
            case "NAVIGATION SENSOR FAULT":
                return "One or more navigation sensors are returning invalid data. GPS, compass, or gyro calibration may be required.";
            case "HYDRAULIC PRESSURE WARNING":
                return "Hydraulic system pressure is below operational threshold. Potential leak or failing hydraulic pump.";
            default:
                return "No additional diagnostic information available.";
        }
    };

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

        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: '#2a3440' },
        '&::-webkit-scrollbar-thumb': { background: '#ffffff', borderRadius: '4px' }
    });

    const getErrorItemSx = (): SxProps<Theme> => ({
        backgroundColor: '#2a3440',
        borderLeft: '3px solid #ff4d4d',
        borderRadius: 1,
        px: 1,
        py: 0.5,
        mb: 1,
        cursor: 'pointer',
        transition: '0.15s ease',
        '&:hover': {
            backgroundColor: '#3a4555',
            boxShadow: '0 0 10px rgba(255,77,77,0.4)'
        }
    });

    return (
        <>
            <Box sx={getContainerSx()}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: '#ffffff',
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        mb: 1
                    }}
                >
                    {item.label ?? "SYSTEM ERRORS"}
                </Typography>

                {errors.map(err => (
                    <Box
                        key={err.id}
                        sx={getErrorItemSx()}
                        onClick={() => setSelectedError(err)}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: err.message === "SYSTEM ONLINE" ? '#00ff9d' : '#ff4d4d',
                                fontFamily: "'Share Tech Mono', monospace",
                                letterSpacing: 1,
                                fontWeight: 600
                            }}
                        >
                            {err.message}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: '#ffffff',
                                opacity: 0.8,
                                fontFamily: "'Share Tech Mono', monospace"
                            }}
                        >
                            {formatTime(err.timestamp)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* POPUP WINDOW */}
            <Modal
                open={!!selectedError}
                onClose={() => setSelectedError(null)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#11181f',
                        border: '1px solid #00ff9d',
                        boxShadow: '0 0 20px rgba(0,255,157,0.4)',
                        borderRadius: 2,
                        p: 3,
                        width: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography
                        sx={{
                            color: '#ff4d4d',
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: '1.3rem',
                            fontWeight: 700
                        }}
                    >
                        {selectedError?.message}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#ffffff',
                            opacity: 0.9,
                            fontFamily: "'Share Tech Mono', monospace",
                            lineHeight: 1.4
                        }}
                    >
                        {selectedError ? getFailureDescription(selectedError.message) : ""}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#ffffff',
                            opacity: 0.6,
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: '0.85rem'
                        }}
                    >
                        Time Logged: {selectedError ? formatTime(selectedError.timestamp) : ""}
                    </Typography>

                    <Box
                        sx={{
                            mt: 2,
                            alignSelf: 'flex-end',
                            px: 2,
                            py: 1,
                            backgroundColor: '#00ff9d',
                            color: '#000',
                            borderRadius: 1,
                            cursor: 'pointer',
                            fontFamily: "'Share Tech Mono', monospace",
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#00d688'
                            }
                        }}
                        onClick={() => setSelectedError(null)}
                    >
                        CLOSE
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default SimErrorBoxComponent;
