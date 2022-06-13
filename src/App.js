import { createContext, useState } from 'react';
import AuthenticatedUser from './AuthenticatedUser';
import ReceptionUser from './ReceptionUser';
import UnauthenticatedUser from './UnauthenticatedUser';

export const AppContext = createContext(null);

function App() {

  const [user, setUser] = useState(localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null)

  const userObject = { user, setUser }

  return (
    <AppContext.Provider
      value={userObject}>
        <UnauthenticatedUser/>
     </AppContext.Provider>

  )
}

export default App;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

