// src/components/DashboardPanel.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography
} from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import useManifest from '../hooks/useManifest';
import type { DefaultStyle, Item } from './types';
import ItemRenderer from './renderers/ItemRenderer';
import dashboardItems from '../config/dashboardItems.json';
import defaultStyle from '../config/defaultStyle.json';

interface DashboardPanelProps {
    onClose?: () => void;
}

// =====================
// ️ Tactical Theme
// =====================
const tacticalTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#11181f',
            paper: '#11181f',
        },
        primary: { main: '#2a3440' },
        secondary: { main: '#00bcd4' },
        error: { main: '#ff3b3b' },
        warning: { main: '#f5a623' },
        info: { main: '#29b6f6' },
        success: { main: '#ffffff' }
    },
    typography: {
        fontFamily: "'Roboto Condensed', 'Share Tech Mono', monospace",
        h6: {
            letterSpacing: 1.5,
            textTransform: 'uppercase'
        },
        body1: { letterSpacing: 0.5 }
    },
    shape: {
        borderRadius: 4
    }
});

// =====================
// 🎖 Component
// =====================
function DashboardPanel({ onClose }: DashboardPanelProps) {
    const manifest = useManifest();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    // =====================
    // 🎖 Tactical Layout Helpers
    // =====================
    const wrapperSx = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 3,
        overflowY: 'auto'
    };

    // =====================
    // ️ Tactical AppBar
    // =====================
    const renderAppBar = () => (
        <AppBar
            position="static"
            sx={{
                bgcolor: '#11181f',
                borderBottom: '1px solid #ffffff'
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#ffffff',
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 1.5
                    }}
                >
                    BOAT DASHBOARD
                </Typography>
            </Toolbar>
        </AppBar>
    );

    // =====================
    // 🎖 Lifecycle
    // =====================
    useEffect(() => {
        setItems((dashboardItems.items || []) as Item[]);
        setLoading(false);
    }, []);

    // =====================
    // 🎖 Handlers
    // =====================
    const handleItemClick = (itemId: string, item: Item) => {
        console.info('[DashboardPanel] clicked:', item.id);
    };

    // =====================
    // 🎖 Render
    // =====================
    return (
        <ThemeProvider theme={tacticalTheme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                {renderAppBar()}

                <Box sx={wrapperSx}>
                    {loading ? (
                        <Typography color="textSecondary">Loading...</Typography>
                    ) : (
                        items.map((item) => (
                            <ItemRenderer
                                key={item.id}
                                item={item}
                                defaultStyle={defaultStyle as DefaultStyle}
                                onItemClick={handleItemClick}
                            />
                        ))
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default DashboardPanel;
