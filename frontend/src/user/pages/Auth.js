import React, {useState, useContext, useEffect} from "react";

import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import Card from "../../shared/UIElements/Card";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/FormElements/ImageUpload";


import { AuthContext } from "../../shared/Context/auth-context";

import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH, 
    VALIDATOR_EMAIL
  } from '../../shared/util/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from "../../shared/hooks/http-hook";

import './Auth.css';

// const Auth = () => {
//     const auth = useContext(AuthContext);
//     const [isLoginMode, setIsLoginMode] = useState(true);
//     const {isLoading, error, sendRequest, clearError } =  useHttpClient();

//     const [formState, inputHandler, setFormData] = useForm({
//         email: {
//           value: '',
//           isValid: false
//         },
//         password: {
//           value: '',
//           isValid: false
//         },
//     }, false);
    
//     const authSubmitHandler = async event => {
//         event.preventDefault();
            
        
//         if (isLoginMode) {
//             try {
//                 const responseData = await sendRequest(
//                     'http://localhost:1000/api/users/login', 
//                     'POST',
//                     JSON.stringify({
//                         email: formState.inputs.email.value,
//                         password: formState.inputs.password.value
//                     }),
//                     {
//                         'Content-Type': 'application/json'
//                     },
//                     );
//                     auth.login(responseData.user.id);
//             } catch (err) {
//                 console.log(err)
//             };

//         } else {
//             try {
//                 const formData = new FormData();
//                 formData.append('email', formState.inputs.email.value);
//                 formData.append('name', formState.inputs.name.value);
//                 formData.append('password', formState.inputs.passowrd.value);
//                 formData.append('image', formState.inputs.image.value);
//                 const responseData = await sendRequest(
//                     'http://localhost:1000/api/users/signup', 
//                     'POST',
//                     formData
//                 );
//                 auth.login(responseData.user.id);
//             } catch (err) {};
//         };
//     };

//     const switchModeHandler = () => {
//         if (!isLoginMode) { //we are in sign up and trying to move into log in
//             setFormData({
//                 ...formState.inputs,
//                 name: undefined,
//                 image: undefined
//             }, formState.inputs.email.isvalid && formState.inputs.password.isvalid)
//         } else { //we are in log in but trying to move into sign up mode
//             setFormData({
//                 ...formState.inputs,
//                 name: {
//                     value: '',
//                     isvalid: false
//                 },
//                 image: {
//                     value: null,
//                     isValid: false
//                 }
//             }, false)
//         }
//         setIsLoginMode(prevMode => !prevMode)
//     };



//     return (
//         <React.Fragment>
//             <ErrorModal error={error} onClear={clearError} />
//             <Card className='authentication'>
//                 {isLoading && <LoadingSpinner asOverlay/>}
//                 <h2>Login Required</h2>
//                 <hr />
//                 <form onSubmit={authSubmitHandler}>
//                     {!isLoginMode && (
//                         <Input 
//                             element='input'
//                             id='name'
//                             type='text'
//                             label='Your Name'
//                             validators={[VALIDATOR_REQUIRE]}
//                             errorText='Please Enter a Name'
//                             onInput={inputHandler}
//                         />

//                     )}
//                     {!isLoginMode && <ImageUpload id='image' center onInput={inputHandler}/>}
//                     <Input 
//                         element='input'
//                         id='email'
//                         type='email'
//                         label='E-Mail'
//                         validators={[VALIDATOR_EMAIL()]}
//                         errorText='Please enter a valid email'
//                         onInput={inputHandler}
//                     />
//                     <Input 
//                         element='input'
//                         id='password'
//                         type='password'
//                         label='Password'
//                         validators={[VALIDATOR_MINLENGTH(6)]}
//                         errorText='Please enter a valid password, at least 6 charchaters'
//                         onInput={inputHandler}
//                     />
//                     <Button type='submit' disabled={!formState.isValid}>
//                     {/* <Button type='submit' > */}
//                         {isLoginMode ? 'LOGIN' : 'SIGNUP'}
//                     </Button>
//                 </form>
//                 <Button inverse onClick={switchModeHandler}>
//                     Switch To {isLoginMode ? 'SIGNUP' : 'LOGIN'}
//                 </Button>
//             </Card>
//         </React.Fragment>
//     );

// };


const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
    const [formState, inputHandler, setFormData] = useForm(
      {
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      },
      false
    );
  
    const switchModeHandler = () => {
      if (!isLoginMode) {
        setFormData(
          {
            ...formState.inputs,
            name: undefined,
            image: undefined
          },
          formState.inputs.email.isValid && formState.inputs.password.isValid
        );
      } else {
        setFormData(
          {
            ...formState.inputs,
            name: {
              value: '',
              isValid: false
            },
            image: {
              value: null,
              isValid: false
            }
          },
          false
        );
      }
      setIsLoginMode(prevMode => !prevMode);
    };
  
    const authSubmitHandler = async event => {
      event.preventDefault();
  
      if (isLoginMode) {
        try {
          const responseData = await sendRequest(
            'http://localhost:1000/api/users/login',
            'POST',
            JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            }),
            {
              'Content-Type': 'application/json'
            }
          );
          auth.login(responseData.user.id);
        } catch (err) {}
      } else {
        try {
          const formData = new FormData();
          formData.append('email', formState.inputs.email.value);
          formData.append('name', formState.inputs.name.value);
          formData.append('password', formState.inputs.password.value);
          formData.append('image', formState.inputs.image.value);
          const responseData = await sendRequest(
            'http://localhost:1000/api/users/signup',
            'POST',
            formData
          );
  
          auth.login(responseData.user.id);
        } catch (err) {}
      }
    };
  
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <Card className="authentication">
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>Login Required</h2>
          <hr />
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
              />
            )}
            {!isLoginMode && (
              <ImageUpload center id="image" onInput={inputHandler} />
            )}
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password, at least 6 characters."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? 'LOGIN' : 'SIGNUP'}
            </Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
            SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
          </Button>
        </Card>
      </React.Fragment>
    );
  };
  

export default Auth;