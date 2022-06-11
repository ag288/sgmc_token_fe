import { createContext, useState } from 'react';
import AuthenticatedUser from './AuthenticatedUser';
import UnauthenticatedUser from './UnauthenticatedUser';

export const AppContext = createContext(null);

function App() {

  const [user, setUser] = useState(localStorage.getItem("currentUser"))

  const userObject = { user, setUser }

  return (
    <AppContext.Provider
      value={userObject}>
      {user ? <AuthenticatedUser /> : <UnauthenticatedUser />}
    </AppContext.Provider>

  )
}

export default App;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

