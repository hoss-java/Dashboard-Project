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

    // -------------------------------
    // 🚤 1. Route around Gotland
    // -------------------------------
    const gotlandRoute: [number, number][] = [
        // 🟦 Start: Oskarshamn
        [57.2640, 16.4480],

        // 🟦 Ut från Oskarshamn mot Gotland
        [57.3500, 16.9000],
        [57.4500, 17.4000],
        [57.5500, 17.9000],

        // 🟦 Gotland (Visby)
        [57.6400, 18.3000],

        // 🟦 Mot Stockholm
        [58.0000, 18.4000],
        [58.5000, 18.3000],
        [59.0000, 18.2000],

        // 🟦 Stockholm (centralt)
        [59.3290, 18.0680],

        // 🟦 Tillbaka mot Oskarshamn
        [58.8000, 17.8000],
        [58.3000, 17.2000],
        [57.8000, 16.8000],

        // 🟦 Slut: Oskarshamn igen
        [57.2640, 16.4480],
    ];

    // -------------------------------
    // 🚤 2. Simulated movement + trail
    // -------------------------------
    const [simIndex, setSimIndex] = useState(0);
    const [simTrail, setSimTrail] = useState<[number, number][]>([gotlandRoute[0]]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSimIndex((i) => {
                const next = (i + 1) % gotlandRoute.length;

                //  Add new point to the trail
                setSimTrail((trail) => [...trail, gotlandRoute[next]]);

                return next;
            });
        }, 8000); //  slower movement (8 seconds)

        return () => clearInterval(interval);
    }, []);

    const simulatedPos = gotlandRoute[simIndex];

    // -------------------------------
    // 🛰 3. Real GPS history
    // -------------------------------
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
                    border: '1px solid #1f2a33',
                    borderRadius: 6,
                    backgroundColor: '#11181f',
                    color: '#00bcd4',
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: 1,
                }}
            >
                NO GPS TELEMETRY
            </div>
        );
    }

    const positions = gpsHistory.map((p) => [p.lat, p.lng]) as [number, number][];

    // -------------------------------
    // 🚤 4. Tactical neon boat icon
    // -------------------------------
    const boatIcon = L.divIcon({
        className: "",
        html: `
            <div style="
                width: 22px;
                height: 22px;
                background: #00ff9d;
                border-radius: 50%;
                border: 3px solid #003f2f;
                box-shadow: 0 0 12px rgba(0,255,157,0.6);
            "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
    });

    return (
        <div
            style={{
                width: '100%',
                maxWidth: width,
                height,
                border: '1px solid #1f2a33',
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(0,255,157,0.05)',
            }}
        >
            <MapContainer
                center={simulatedPos}   //  follow the boat
                zoom={6}                //  zoomed out for Gotland
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />



                {/* Simulated trail */}
                <Polyline
                    positions={simTrail}
                    color="#00ff9d"
                    weight={4}
                    opacity={0.7}
                />

                {/*  Boat moving around Gotland */}
                <Marker position={simulatedPos} icon={boatIcon} />
            </MapContainer>
        </div>
    );
};
