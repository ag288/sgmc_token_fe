
import { PatientList } from './Admin/HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { TokenDetailsChooseToken } from './TokenGeneration/TokenDetailsChooseTokens';
import { ReviewBooking } from './ReviewBooking';
import { ReviewList } from './ReviewBooking/ReviewList';
import { TokenDetailsForReviewChooseToken } from './ReviewBooking/TokenDetailsChooseToken';
import { useContext } from 'react';
import { AppContext } from './App';
import { PendingReviews } from './ReviewBooking/PendingReviews';
import { DuplicatePatients } from './DuplicatePatients';
import Simple from './components/Navbar';
import { DoctorView } from './DoctorView';

function AuthenticatedUser() {

  const { user } = useContext(AppContext)
  return (
    <BrowserRouter>
      <Simple />
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/home" element={<PatientList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<TokenGeneration />} />
        <Route path="/token-details" element={<TokenDetailsChooseToken />} />
        {user.userID == 2 && <> <Route path="/book-review" element={< ReviewBooking />} />
          <Route path="/pending-reviews" element={<PendingReviews />}></Route>
          <Route path="/review-list" element={< ReviewList />} />
          <Route path="/review-details" element={< TokenDetailsForReviewChooseToken />} />
          <Route path="/duplicates" element={<DuplicatePatients />} />
          <Route path="*" element={<PatientList />} /></>}
      </Routes>
    </BrowserRouter>




  )
}

export default AuthenticatedUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

