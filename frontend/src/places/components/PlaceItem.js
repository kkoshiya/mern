import React, {useState, useContext } from "react";
import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";
import Modal from "../../shared/UIElements/Modal";
import Map from "../../shared/UIElements/Map";
import { AuthContext } from "../../shared/Context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useParams, useHistory } from 'react-router-dom'
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";

import './PlaceItem.css';


const PlaceItem = props => {
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {isLoading, error, sendRequest, clearError } =  useHttpClient();


    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false)
        try {
            await sendRequest(
                `http://localhost:1000/api/places/${props.id}`, 
                'DELETE', 
                null, 
                {Authorization: 'Bearer ' + auth.token}
            );
            props.onDelete(props.id);
        } catch(err) {console.log(err)}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>

            <Modal 
                show={showMap} onCancel={closeMapHandler} header={props.address} contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions' footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16}></Map>
                </div>
            </Modal>

            <Modal 
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header='Are you sure?' 
                footerClass='place-item__modal-actions' 
                footer= { 
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
                        <Button danger onClick={confirmDeleteHandler}>Delete</Button>
                    </React.Fragment>
                    }
            >
                <p>Do you want to proceed and delete this place? Please note that it can't be undone.</p>
            </Modal>

            <li className="place-item">
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay/>}
                    <div className="place-item__image">
                        <img src={`http://localhost:1000/${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        {auth.userId === props.creatorId && 
                            <Button to={`/places/${props.id}`}>Edit</Button>
                        }
                        {auth.userId === props.creatorId && 
                            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                        }
                        <Button inverse onClick={openMapHandler}>View on Map</Button>
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )

};

export default PlaceItem;