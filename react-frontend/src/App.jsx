import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Transaction = lazy(() => import('./pages/Transaction'))
const NotFound = lazy(() => import('./pages/NotFound')) 
import { BackgroundBeams } from './components/BackgroundBeams'
import { ToastContainer } from 'react-toastify';

const App = () => {
  const authUser = true;
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        <BackgroundBeams /> 

      {authUser && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/transaction/:id' element={<Transaction />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      
      <ToastContainer />

    </div>
      </>
  )
}


export default App