import { createContext, useEffect, useState } from 'react';
import AuthenticatedUser from './AuthenticatedUser';
import PhysioUser from './PhysioUser';
import ReceptionUser from './ReceptionUser';
import UnauthenticatedUser from './UnauthenticatedUser';

export const AppContext = createContext(null);

function App() {

  const [user, setUser] = useState(localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null)
  //const [doctor, setDoctor] = useState("")
  const userObject = { user, setUser }

  useEffect(() => {

    // setInterval(() => {
    //   window.location.reload()
    // }, 60000)

  });

  function selectView() {

    if(!user)
    return <UnauthenticatedUser/>
    else{
    switch (user?.userID) {
      case 1 :
      case 2:
        return <AuthenticatedUser />
      case 3:
        return <PhysioUser />

    }
  }
  }

  return (
    <AppContext.Provider
      value={userObject}>
      {/* {user?.userID == 1 ? <AuthenticatedUser /> : (user?.userID == 2 ? <ReceptionUser /> : <UnauthenticatedUser />)} */}
     {selectView()}
    </AppContext.Provider>

  )
}

export default App;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

