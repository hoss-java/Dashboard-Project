// src/components/DashboardPanel.tsx
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import useManifest from '../hooks/useManifest';
import type { Item } from './types';
import ItemRenderer from './renderers/ItemRenderer';
import dashboardItems from '../config/dashboardItems.json';

interface DashboardPanelProps {
  onClose?: () => void;
}

function DashboardPanel({ onClose }: DashboardPanelProps) {
  const manifest = useManifest();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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



          {loading ? (
            <Typography color="textSecondary">Loading...</Typography>
          ) : (
            items.map((item) => (
              <ItemRenderer
                key={item.id}
                item={item}
                onItemClick={handleItemClick}
              />
            ))
          )}
        </Box>


  );
}

export default DashboardPanel;

