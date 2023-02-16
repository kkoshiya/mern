import React from "react";

import PlaceItem from "./PlaceItem";
import Button from "../../shared/FormElements/Button";
import Card from "../../shared/UIElements/Card";
import './PlaceList.css';


const PlaceList = props => {

    if (props.items.length === 0) {
        return (
            <div className="places-list center">
                <Card>
                    <h2>No plaeces found, Maybe create one?</h2>
                    <Button to='/places/new'>Share Place</Button>
                </Card>
            </div>
        );
    };

    return (
        <ul className="place-list">
            {props.items.map(place => 
                <PlaceItem
                    key={place.id} 
                    id={place.id} 
                    image={place.image} 
                    title={place.title} 
                    description={place.description} 
                    address={place.address} 
                    creatorId={place.creator} 
                    coordinates={place.location}
                />)}
        </ul>
    )



};

export default PlaceList;