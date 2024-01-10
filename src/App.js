import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/login/signup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
