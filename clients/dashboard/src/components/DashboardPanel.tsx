// src/components/DashboardPanel.tsx
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

import useManifest from '../hooks/useManifest';
import type { 
  DefaultStyle,
  Item,
} from './types';
import ItemRenderer from './renderers/ItemRenderer';
import dashboardItems from '../config/dashboardItems.json';
import defaultStyle from '../config/defaultStyle.json';

interface DashboardPanelProps {
  onClose?: () => void;
}

function DashboardPanel({ onClose }: DashboardPanelProps) {
  const manifest = useManifest();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // ============ SX Helpers ============
  const getContentWrapperSx = () => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    bgcolor: '#f5f5f5',
    p: 2,
    overflowY: 'auto',
  });

  const getContentBoxSx = () => ({
    bgcolor: 'white',
    p: 4,
    borderRadius: 1,
    boxShadow: 1,
    maxWidth: 800,
    width: '100%',
  });

  // ============ Component Helpers ============
  const renderAppBar = () => (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {manifest.name}
        </Typography>
      </Toolbar>
    </AppBar>
  );

  // ============ Lifecycle ============
  useEffect(() => {
    setItems((dashboardItems.items || []) as Item[]);
    setLoading(false);
  }, []);

  // ============ Handlers ============
  const handleItemClick = (itemId: string, item: Item) => {
    console.info('[DashboardPanel] clicked:', item.id);
  };

  // ============ Render ============
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {renderAppBar()}

      <Box sx={getContentWrapperSx()}>
        <Box sx={getContentBoxSx()}>
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
    </Box>
  );
}

export default DashboardPanel;

