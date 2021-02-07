import React, { useEffect } from 'react';
// import { Counter } from './features/counter/Counter';
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from "./screens/ProfileScreen";
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        // Logged in
        console.log(userAuth);
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email
        })

        );
      } else {
        // Logged Out
        dispatch(logout());
      }
    })

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="App">

      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
            <Switch>
              <Route path="/profile">
                <ProfileScreen />
              </Route>

              <Route path="/">
                <HomeScreen />
              </Route>
            </Switch>
          )}
      </Router>

    </div>
  );
}

export default App;
