import React, { Component } from 'react';
import './App.css';
import { places } from './places.js';
import List from './components/List';
import InfoWindow from './components/InfoWindow';
import { mapStyle } from './mapStyle';

// Gracefully  handle errors if map fails to load
window.gm_authFailure = () => {
  const map = document.getElementById('googleMap');
  map.innerHTML = '';
  map.innerHTML = `<div class='error-message'><h2 class='error-title'><span class='red-brackets'>{</span> ERROR <span class='red-brackets'>}</span></h2><p>Something went wrong with Google Maps. Please try again later.<p></div>`;
}

class App extends Component {
  state = {
    loading: true,
    activeMarkerDescription: '',
    activeMarkerAddressCity: '',
    activeMarkerAddressStreet: '',
    showingInfoWindow: false,
    places: places,
    activeMarker: {},
    markers: [],
    googleMap: '',
    visible: false
  }

  componentDidMount(){
    window.initMap = this.initMap;
    this.loadJS();  
  }

  //Initialize map
  initMap = () => {
    const controlledThis = this;
  
    //Map details
    let map = new window.google.maps.Map(document.getElementById('googleMap'), {
      zoom: 13,
      center: {lat: 47.497055, lng: 19.03991},
      styles: mapStyle
    });

    this.setState({map})

    //Define marker for each places in places.js
    this.state.places.map(place => {
      let marker = new window.google.maps.Marker({
        map: map,
        position: place.position,
        title: place.title,
        id: place.venueId,
        animation: window.google.maps.Animation.DROP,
      });
  
      this.state.markers.push(marker);
  
      marker.addListener('click', function () {
        controlledThis.openInfoWindow(marker);
      });

      return marker;
      
    })

    map.addListener('click', ()=>{
      controlledThis.closeInfoWindow();
    })
  }

  //Fetch map
  loadJS = () => {
    let reference = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');
    
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4ra8QTtgFgFcjbooTuA7MQ1g3FG3xlUk&callback=initMap';
    script.async = true;
    reference.parentNode.insertBefore(script, reference);
  
    script.onerror = function () {
      document.write('Something went wrong with Google Maps. Please try again later.');
    };
  }

  //Fetch info for all markers from Foursquare
  getInfo = (marker) => {
    const client_id = 'FTTFIAWHTYUXZ4123VGFKR2YMK52MWAO2OLE124QCN04FLMA';
    const client_secret = 'ZVRP1CVBRLBFIEWGXNFISGDZYGQANHBSQF12NG3ZQ1J0BVVV';
    const version ='20180803';
    const url = `https://api.foursquare.com/v2/venues/${marker.id}?client_id=${client_id}&client_secret=${client_secret}&v=${version}`;
    
    fetch(url)
      .then(data => {
        if(data.ok) {
          return data.json();
        } else {
          alert('Something went wrong with Foursquare. Please try again later.' + new Error(data.statusText))
          }
    })
    .then(data => {
      console.log(data);
      this.setState({
        activeMarkerAddressCity: data.response.venue.location.formattedAddress[0],
        activeMarkerAddressStreet: data.response.venue.location.formattedAddress[1],
        activeMarkerRating: data.response.venue.rating,
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  //Initialize pop-up infowindow
  openInfoWindow = (marker) => {
    this.setState({
      showingInfoWindow: true,
      activeMarker: marker
    });

    this.getInfo(marker);
  }

  closeInfoWindow = () => {
    this.setState({
      showingInfoWindow: false,
      activeMarker: {}
    });
  }

  //Handle Menuicon clicks
  handleClick = (e) => {
    this.toggleMenu();
  }
    
  //Changes the visibiltiy of sidebar elements
  toggleMenu = () => {
    this.setState({visible: !this.state.visible})
  }

  render() {

    const { loading } = this.state
    
    return (
      loading ? (
      <div className='container'>

          <aside className='menu'>
            <List
                places={this.state.places}
                markers={this.state.markers}
                openInfoWindow={this.openInfoWindow}
            />

            {
                this.state.showingInfoWindow &&
                    <InfoWindow
                        activeMarker={this.state.activeMarker}
                        activeMarkerAddressCity={this.state.activeMarkerAddressCity}
                        activeMarkerAddressStreet={this.state.activeMarkerAddressStreet}
                        activeMarkerRating={this.state.activeMarkerRating}
                    />
            }   
          </aside>
          
          <main id='googleMap' tabIndex={-1} role='application' aria-label='Child-friendly places in Budapest'
            styles={mapStyle}
          >
          </main>
      </div>
    ) : (
      <div>
        <h1>Something went wrong with the Map. Please try again later.</h1>
      </div>
    )
  );
}
}

export default App;