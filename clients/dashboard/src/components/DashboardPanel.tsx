// src/components/DashboardPanel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Skeleton,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import useManifest from '../hooks/useManifest';
import type { DefaultStyle, Item } from './types';
import ItemRenderer from './renderers/ItemRenderer';
import dashboardItems from '../config/dashboardItems.json';
import defaultStyle from '../config/defaultStyle.json';

function DashboardPanel() {
  const manifest = useManifest();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate brief load so skeleton is visible
    const t = setTimeout(() => {
      setItems((dashboardItems.items || []) as Item[]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleItemClick = useCallback((itemId: string, item: Item) => {
    console.info('[DashboardPanel] clicked:', itemId);
  }, []);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}
    >
      {/* ── AppBar ── */}
      <AppBar position="sticky" role="banner">
        <Toolbar sx={{ gap: 1.5 }}>
          <DashboardIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            {manifest.name}
          </Typography>
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: 'success.main' }} />}
            label="Live"
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'success.main',
              color: 'success.main',
              fontSize: '0.7rem',
              height: 24,
              '& .MuiChip-icon': { ml: '6px' },
            }}
          />
        </Toolbar>
      </AppBar>

      {/* ── Main content ── */}
      <Box
        component="main"
        role="main"
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
        }}
      >
        {loading ? (
          <SkeletonGrid />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <ItemRenderer
                key={item.id}
                item={item}
                defaultStyle={defaultStyle as DefaultStyle}
                onItemClick={handleItemClick}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ── Footer ── */}
      <Box
        component="footer"
        sx={{
          py: 1.5,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          color: 'text.secondary',
          fontSize: '0.75rem',
        }}
      >
        Real-time monitoring — All data updates from DataRegistry
      </Box>
    </Box>
  );
}

function SkeletonGrid() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: { xs: 2, sm: 3 },
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={180}
          sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}
        />
      ))}
    </Box>
  );
}

export default DashboardPanel;
