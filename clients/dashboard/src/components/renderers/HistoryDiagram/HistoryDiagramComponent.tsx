// src/components/renderers/components/HistoryDiagram/HistoryDiagram.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { dataRegistry } from '../../../services/DataRegistry';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

export const HistoryDiagram: React.FC<ItemRendererProps> = ({
                                                              item,
                                                              defaultStyle,
                                                              onItemClick,
                                                            }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [historyData, setHistoryData] = useState<Array<{ timestamp: number; value: number }>>([]);

  // Resolve config
  const dataName = resolveValue(item.content, defaultStyle?.content, '');
  const label = resolveValue(item.label, defaultStyle?.label, 'History Chart');
  const width = resolveValue(item.width, defaultStyle?.width, 600);
  const height = resolveValue(item.height, defaultStyle?.height, 400);
  const minValue = resolveValue(item.minValue, defaultStyle?.minValue, undefined);
  const maxValue = resolveValue(item.maxValue, defaultStyle?.maxValue, undefined);

  // Tactical neon cyan line
  const lineColor = resolveValue(item.lineColor, defaultStyle?.lineColor, '#00bcd4');

  // Subscribe to data
  useEffect(() => {
    if (!dataName) return;

    const initial = dataRegistry.getHistory(dataName);
    if (Array.isArray(initial)) {
      setHistoryData(
          initial.map((e) => ({
            timestamp: e.timestamp ?? Date.now(),
            value: e.newValue ?? 0,
          }))
      );
    }

    const callbackId = `history-diagram-${item.id}-${Math.random()}`;
    const handleChange = () => {
      const updated = dataRegistry.getHistory(dataName);
      if (Array.isArray(updated)) {
        setHistoryData(
            updated.map((e) => ({
              timestamp: e.timestamp ?? Date.now(),
              value: e.newValue ?? 0,
            }))
        );
      }
    };

    dataRegistry.onChange(dataName, callbackId, handleChange);
    return () => dataRegistry.offChange(dataName, callbackId);
  }, [dataName]);

  /**
   * Tactical HUD Chart Drawing
   */
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!historyData.length) {
      ctx.fillStyle = '#11181f';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#00bcd4';
      ctx.font = '14px Share Tech Mono';
      ctx.textAlign = 'center';
      ctx.fillText('NO TELEMETRY DATA', width / 2, height / 2);
      return;
    }

    // Tactical padding
    const padding = { top: 40, right: 20, bottom: 40, left: 60 };
    const drawableWidth = width - padding.left - padding.right;
    const drawableHeight = height - padding.top - padding.bottom;

    // Matte tactical background
    ctx.fillStyle = '#0a0f14';
    ctx.fillRect(0, 0, width, height);

    // Extract data
    const timestamps = historyData.map((p) => p.timestamp);
    const values = historyData.map((p) => p.value);

    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeRange = maxTime - minTime || 1;

    const minVal = minValue ?? Math.min(...values);
    const maxVal = maxValue ?? Math.max(...values);
    const valRange = maxVal - minVal || 1;

    // Tactical grid lines
    ctx.strokeStyle = '#1f2a33';
    ctx.lineWidth = 1;

    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (drawableHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Tactical line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0,188,212,0.6)';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    let first = true;

    for (const p of historyData) {
      const x = padding.left + ((p.timestamp - minTime) / timeRange) * drawableWidth;
      const y = height - padding.bottom - ((p.value - minVal) / valRange) * drawableHeight;

      if (first) {
        ctx.moveTo(x, y);
        first = false;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Tactical dots
    ctx.fillStyle = '#00ff9d';
    ctx.shadowBlur = 12;

    for (const p of historyData) {
      const x = padding.left + ((p.timestamp - minTime) / timeRange) * drawableWidth;
      const y = height - padding.bottom - ((p.value - minVal) / valRange) * drawableHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tactical label
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00ff9d';
    ctx.font = 'bold 18px Share Tech Mono';
    ctx.textAlign = 'center';
    ctx.fillText(label.toUpperCase(), width / 2, padding.top - 15);
  };

  useEffect(() => {
    drawChart();
  }, [historyData, width, height, minValue, maxValue, lineColor, label]);

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
            padding: 2,
            backgroundColor: '#11181f',
            borderRadius: 2,
            border: '1px solid #1f2a33',
            boxShadow: '0 0 20px rgba(0,255,157,0.05)',
            cursor: 'pointer',
          }}
      >
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
              border: '1px solid #1f2a33',
              borderRadius: 6,
              backgroundColor: '#0a0f14',
            }}
        />
      </Box>
  );
};

export default HistoryDiagram;
