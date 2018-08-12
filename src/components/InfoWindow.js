import React from 'react';

function InfoWindow(props) {
    const {activeMarker, activeMarkerAddressCity, activeMarkerAddressStreet, activeMarkerRating} = props;
    return (
        <div 
            tabIndex={0}
            className="info-window-box"
        >
            <div className="activeMarkerTitle">{activeMarker.title}</div>
            <div className="activeMarkerAddressCity"><i>Address</i>: {activeMarkerAddressCity}</div>
            <div className="activeMarkerStreet">{activeMarkerAddressStreet}</div>
            <div className="attribution"><i>Rating from <a href="https://foursquare.com/">Foursquare</a></i>: {activeMarkerRating}</div>
        </div>
    )
}

export default InfoWindow;