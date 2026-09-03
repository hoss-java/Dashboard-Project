import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { dataRegistry } from '../../../services/DataRegistry';
import L from 'leaflet';


type LatLngPoint = {
    timestamp: number;
    lat: number;
    lng: number;
};

interface GpsMapProps {
    width: number;
    height: number;
    label: string;
    dataName: string;
}

export const GpsMap: React.FC<GpsMapProps> = ({
                                                  width,
                                                  height,
                                                  label,
                                                  dataName,
                                              }) => {
    const [gpsHistory, setGpsHistory] = useState<LatLngPoint[]>([]);

    useEffect(() => {
        if (!dataName) return;

        const initial = dataRegistry.getHistory(dataName);
        if (Array.isArray(initial)) {
            const cleaned = initial.map((e) => ({
                timestamp: e.timestamp,
                lat: e.newValue?.lat ?? 0,
                lng: e.newValue?.lng ?? 0,
            }));
            setGpsHistory(cleaned);
        }

        const callbackId = `gps-map-${dataName}-${Math.random()}`;
        const handleChange = () => {
            const updated = dataRegistry.getHistory(dataName);
            if (Array.isArray(updated)) {
                const cleaned = updated.map((e) => ({
                    timestamp: e.timestamp,
                    lat: e.newValue?.lat ?? 0,
                    lng: e.newValue?.lng ?? 0,
                }));
                setGpsHistory(cleaned);
            }
        };

        dataRegistry.onChange(dataName, callbackId, handleChange);
        return () => dataRegistry.offChange(dataName, callbackId);
    }, [dataName]);

    if (gpsHistory.length === 0) {
        return (
            <div
                style={{
                    width,
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    backgroundColor: '#fff',
                }}
            >
                No GPS data available
            </div>
        );
    }

    const last = gpsHistory[gpsHistory.length - 1];
    const positions = gpsHistory.map((p) => [p.lat, p.lng]) as [number, number][];

    const boatIcon = L.divIcon({
        className: "",
        html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: red;
    ">
      <span class="material-icons" style="font-size: 32px;">
        directions_boat
      </span>
    </div>
  `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    return (
        <div style={{ width, height }}>
            <MapContainer
                center={[last.lat, last.lng]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Polyline positions={positions} color="#2196F3" weight={20} />

                <Marker position={[last.lat, last.lng]} icon={boatIcon} />
            </MapContainer>
        </div>
    );
};
