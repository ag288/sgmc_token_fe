import { createContext, useState } from 'react';
import AuthenticatedUser from './AuthenticatedUser';
import ReceptionUser from './ReceptionUser';
import UnauthenticatedUser from './UnauthenticatedUser';

export const AppContext = createContext(null);

function App() {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")))

  const userObject = { user, setUser }

  return (
    <AppContext.Provider
      value={userObject}>
      {user?.userID == 1 ? <AuthenticatedUser /> : (user?.userID == 2 ? <ReceptionUser /> : <UnauthenticatedUser />)}
    </AppContext.Provider>

  )
}

export default App;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

