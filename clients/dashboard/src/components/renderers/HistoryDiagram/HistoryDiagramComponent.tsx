// src/components/renderers/HistoryDiagram/HistoryDiagramComponent.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { dataRegistry } from '../../../services/DataRegistry';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

interface DataPoint { timestamp: number; value: number; }

export const HistoryDiagram: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [historyData, setHistoryData] = useState<DataPoint[]>([]);

  const dataName  = resolveValue(item.content, defaultStyle?.content, '');
  const label     = resolveValue(item.label, defaultStyle?.label, 'History Chart');
  const height    = resolveValue(item.height, defaultStyle?.height, 220);
  const minValue  = resolveValue(item.minValue, defaultStyle?.minValue, undefined);
  const maxValue  = resolveValue(item.maxValue, defaultStyle?.maxValue, undefined);
  const lineColor = resolveValue(item.lineColor, defaultStyle?.lineColor, '#4f8ef7');

  const callbackId = useMemo(() => `historyDiagram-${item.id}`, [item.id]);

  // ── Responsive width via ResizeObserver ──────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCanvasWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setCanvasWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // ── Data subscription ────────────────────────────────────────────────────
  useEffect(() => {
    if (!dataName) { setHistoryData([]); return; }
    if (!dataRegistry.get(dataName)) { setHistoryData([]); return; }

    const transform = (raw: any[]): DataPoint[] =>
      (Array.isArray(raw) ? raw : [])
        .filter((e) => e && typeof e === 'object')
        .map((e) => ({ timestamp: e.timestamp ?? Date.now(), value: e.newValue ?? 0 }));

    setHistoryData(transform(dataRegistry.getHistory(dataName)));

    const handleChange = () =>
      setHistoryData(transform(dataRegistry.getHistory(dataName)));

    dataRegistry.onChange(dataName, callbackId, handleChange);
    return () => dataRegistry.offChange(dataName, callbackId);
  }, [dataName, callbackId]);

  // ── Draw ─────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvasWidth;
    const h = height;
    canvas.width  = w;
    canvas.height = h;

    const pad = { top: 28, right: 16, bottom: 36, left: 48 };
    const dw  = w - pad.left - pad.right;
    const dh  = h - pad.top  - pad.bottom;

    // Background
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.fillRect(0, 0, w, h);

    if (historyData.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No data yet', w / 2, h / 2);
      return;
    }

    const timestamps = historyData.map((p) => p.timestamp);
    const values     = historyData.map((p) => p.value);
    const minT = Math.min(...timestamps);
    const maxT = Math.max(...timestamps);
    const tRange = maxT - minT || 1;

    const dataMin = minValue ?? Math.min(...values);
    const dataMax = maxValue ?? Math.max(...values);
    const vRange  = dataMax - dataMin || 1;

    const toX = (t: number) => pad.left + (dw * (t - minT)) / tRange;
    const toY = (v: number) => pad.top  + dh - (dh * (v - dataMin)) / vRange;

    // Grid lines
    const gridCount = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= gridCount; i++) {
      const y = pad.top + (dh / gridCount) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();

      const val = dataMax - (vRange / gridCount) * i;
      ctx.fillStyle    = '#64748b';
      ctx.font         = '11px Inter, sans-serif';
      ctx.textAlign    = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(val.toFixed(1), pad.left - 6, y);
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, h - pad.bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.left, h - pad.bottom); ctx.lineTo(w - pad.right, h - pad.bottom); ctx.stroke();

    // X-axis time labels
    const labelCount = Math.min(5, historyData.length);
    ctx.fillStyle    = '#64748b';
    ctx.font         = '10px Inter, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor((historyData.length - 1) * (i / Math.max(labelCount - 1, 1)));
      const pt  = historyData[idx];
      if (!pt) continue;
      const x   = toX(pt.timestamp);
      const d   = new Date(pt.timestamp);
      const lbl = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
      ctx.fillText(lbl, x, h - pad.bottom + 6);
    }

    // Area fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, lineColor + '55');
    grad.addColorStop(1, lineColor + '00');
    ctx.beginPath();
    ctx.moveTo(toX(historyData[0].timestamp), h - pad.bottom);
    historyData.forEach((p) => ctx.lineTo(toX(p.timestamp), toY(p.value)));
    ctx.lineTo(toX(historyData[historyData.length - 1].timestamp), h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    historyData.forEach((p, i) => {
      const x = toX(p.timestamp);
      const y = toY(p.value);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    ctx.fillStyle = lineColor;
    historyData.forEach((p) => {
      ctx.beginPath();
      ctx.arc(toX(p.timestamp), toY(p.value), 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [historyData, canvasWidth, height, minValue, maxValue, lineColor]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <Box
      ref={containerRef}
      onClick={() => onItemClick && onItemClick(item.id, item)}
      role="img"
      aria-label={label}
      sx={{
        width: '100%',
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        p: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', mb: 0.5, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height }}
      />
    </Box>
  );
};

export default HistoryDiagram;
