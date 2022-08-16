import { createContext, useEffect, useState } from 'react';
import api from './api';
import AuthenticatedUser from './AuthenticatedUser';
import Simple from './components/Navbar';
import PhysioUser from './PhysioUser';
import ReceptionUser from './ReceptionUser';
import UnauthenticatedUser from './UnauthenticatedUser';

export const AppContext = createContext(null);

function App() {
  const [doctors,setDoctors] = useState([])
  const [index, setIndex] = useState(localStorage.getItem("tabIndex") ? JSON.parse(localStorage.getItem("tabIndex")) : 0)
  const [user, setUser] = useState(localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null)
  const [doctor, setDoctor] = useState(localStorage.getItem("doctor") ? JSON.parse(localStorage.getItem("doctor")) : 1)
 
  const userObject = { user, doctor, doctors, index, setUser, setDoctor, setIndex }

  useEffect(() => {

   api.token.fetchDoctors().then((res)=>{
    const response = JSON.parse(res.data).result
  //  console.log(response)
setDoctors(response)
  })

  }, []);

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

