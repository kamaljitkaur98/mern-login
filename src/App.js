import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/login/signup'
import ForgotPassword from './pages/forgotpassword/forgotpassword';
import ResetPassword from './pages/forgotpassword/resetpage'
import CreateAccount from './pages/login/createaccount';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/api/redirect-reset-password" element={<ResetPassword />}></Route>
      <Route path="/create-account" element={<CreateAccount />}></Route>
    </Routes>
  );
}

export default App;
