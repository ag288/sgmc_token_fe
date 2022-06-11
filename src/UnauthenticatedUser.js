import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './Login';

function UnauthenticatedUser() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>




    )
}

export default UnauthenticatedUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

