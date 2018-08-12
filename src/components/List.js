import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import PropTypes from 'prop-types';
import { places } from '../places.js';
import Filter from './Filter.js';

let markers = [];

class List extends Component {

    state = {
        query: '',
        filteredPlaces: places,
        filteredMarkers: [],
        activeMarker: {},
    }

    componentDidMount(){
        this.setState({filteredMarkers: this.props.markers})
    }

    //Add actions to places clicked in sidebar list
    placeItemClicked = (place) => {

        let placeList = this; 

        this.addAnimation(place);
        this.removeAnimation();

        setTimeout(()=>{
            this.removeAnimation();
        },400)

        this.placeItem(place);
        
        setTimeout(function(){
            placeList.props.openInfoWindow(placeList.state.activeMarker)
        }, 400);

    }

    placeItem = (place) => {
        let selected = markers.filter((currentOne)=> currentOne.title === place.title)
        window.google.maps.event.trigger(selected[0], 'click');
    }

    //Filter places with Search input in sidebar list
    searchPlaces = (query) => {
        let placeList = this;
        this.setState({query: query});
        if(query){
            const match = new RegExp(escapeRegExp(query), 'i');
            let foundPlaces = this.props.places.filter(place => 
                match.test(place.title)
            );
            this.setState({filteredPlaces: foundPlaces});
            let foundMarkers = this.props.markers.filter(marker => 
                match.test(marker.title)
            );
            this.setState({filteredMarkers: foundMarkers});
        
        } else {
            this.setState({
                filteredPlaces: this.props.places,
                filteredMarkers: this.props.markers
            })
        }

        this.props.markers.map(marker=>marker.setVisible(false));
        
        setTimeout(function(){
            placeList.props.markers.map(marker=>
                placeList.makeMarkersVisible(marker)
            )
        },400)
    }

    // Add and remove animation of markers
    addAnimation = (place) => {
        this.state.filteredMarkers.map(marker=>
            marker.title === place.title &&
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
        )        
    }
    removeAnimation = () => {
        this.state.filteredMarkers.map(marker=>
            marker.setAnimation(null)
        )
    }

    makeMarkersVisible = (marker) => {
        this.state.filteredMarkers.map(filteredMarker=>
            filteredMarker.title === marker.title && filteredMarker.setVisible(true)
        )
    }

    render(){
        const style = {
            backgroundColor: 'grey',
            fontWeight: '400'
        }
      
        return(     
            <section>
                <Filter
                    onQuery={this.state.query}
                    onSearch={this.searchPlaces}
                />

                <div className="placeList">
                <ul>
                    
                    {this.state.filteredPlaces.map(place =>
                        <li key={place.key}>
                            <button
                                aria-label={place.title}
                                role="button"
                                variant="contained"
                                id={place.id}
                                className='location-button'
                                onClick={ () => this.placeItemClicked(place)}
                                style={style}>
                                    {place.title}
                            </button>
                        </li>
                    )}  
                </ul>
                </div>
            </section>
        )   
    }
}

List.propTypes = {
  places: PropTypes.array.isRequired,
}

export default List;