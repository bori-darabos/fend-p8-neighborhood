import React from 'react';
import PropTypes from 'prop-types';

function Filter(props) {  
    const style = {
    padding: '0.5em',
    width: '30%',
    backgroundColor: 'white'
  }

  return(

    <div id='search'>
        <div aria-label='Location Filter' style={style}>Search</div>
                    <input
                        inputprops={{'aria-label': 'Search location by name'}}
                        autoFocus={true}
                        placeholder='Find a location'
                        value={props.onQuery}
                        onChange={(event) => props.onSearch(event.target.value)}
                    />
    </div>
  )
}

Filter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onQuery: PropTypes.string.isRequired,
}

export default Filter