
import { PatientList } from './Reception/HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { TokenDetailsChooseToken } from './TokenGeneration/TokenDetailsChooseToken1';
import { ReviewBooking } from './ReviewBooking';
import { ReviewList } from './ReviewBooking/ReviewList';
import { TokenDetailsForReviewChooseToken } from './ReviewBooking/TokenDetailsChooseToken1';
import { useContext } from 'react';
import { AppContext } from './App';
import { PendingReviews } from './ReviewBooking/PendingReviews';
import { DuplicatePatients } from './DuplicatePatients';
import { AdminPatientList } from './Admin';
import Simple from './components/Navbar';
import { Doctor } from './Doctor';
import { FutureAppointments } from './Doctor/FutureAppointments';
import { PastAppointments } from './PastAppointments';
import { PastAppointments as PastAppointmentsOfDoctor } from './Doctor/PastAppointments';

function AuthenticatedUser() {

  const { user } = useContext(AppContext)
  return (
    <BrowserRouter>
      <Simple />
      <Routes>

        {(user.userID == 1 || user.userID == 2) && <><Route path="/" element={<PatientList />} />
          <Route path="/home" element={<PatientList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/book" element={<TokenGeneration />} />
          <Route path="/token-details" element={<TokenDetailsChooseToken />} />
          <Route path="/history" element={<PastAppointments />} />
        </>}
        {user.userID == 2 && <> <Route path="/book-review" element={< ReviewBooking />} />
          <Route path="/pending-reviews" element={<PendingReviews />}></Route>
          <Route path="/review-list" element={< ReviewList />} />
          <Route path="/review-details" element={< TokenDetailsForReviewChooseToken />} />
          <Route path="/duplicates" element={<DuplicatePatients />} />
          <Route path="*" element={<PatientList />} />
          <Route path="/history" element={<PastAppointments />} /></>}

        {user.userID == 6 && <> <Route path="/" element={< AdminPatientList />} />
          <Route path="/home" element={< AdminPatientList />} />
          <Route path="/history" element={<PastAppointments />} />
          <Route path="/review-list" element={< ReviewList />} />
        </>}

        {user.doctorID && <><Route path="/" element={<Doctor />} />
          <Route path="/home" element={<Doctor />} />
          <Route path="/future" element={<FutureAppointments />} />
          <Route path="/history" element={<PastAppointmentsOfDoctor />} />
        </>}
      </Routes>
    </BrowserRouter>




  )
}

export default AuthenticatedUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

