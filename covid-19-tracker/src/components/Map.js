import React from 'react'
import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "../util";
import ChangeView from './ChangeView';

const Map = ({ countries, casesType, center, zoom }) => {
    return (
        <div className="map">
            <MapContainer  center={center} zoom={zoom} scrollWheelZoom={false}>
                <ChangeView center={center} zoom={zoom} key="changeView"/>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    key="tileLayer"
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
