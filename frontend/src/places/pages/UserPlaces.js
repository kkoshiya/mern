import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';


const UserPlaces = () => {
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState();
  const {isLoading, error, sendRequest, clearError } =  useHttpClient();

  useEffect(() => {
    const fetchPlaces = async() => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
        setLoadedPlaces(responseData.places);
      } catch(err) {};
    }
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = async (deledPlaceId) => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deledPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
          {isLoading && (
              <div className='center'>
                  <LoadingSpinner/>
              </div>
          )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
    </React.Fragment>
  )
};

export default UserPlaces;
