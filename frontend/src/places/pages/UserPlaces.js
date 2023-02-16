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
        const responseData = await sendRequest(`http://localhost:1000/api/places/user/${userId}`);
        setLoadedPlaces(responseData.places);
      } catch(err) {};
    }
    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
          {isLoading && (
              <div className='center'>
                  <LoadingSpinner/>
              </div>
          )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
    </React.Fragment>
  )
};

export default UserPlaces;
