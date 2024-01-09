import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/signup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
