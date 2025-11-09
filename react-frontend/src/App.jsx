import { lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Transaction = lazy(() => import('./pages/Transaction'))
const NotFound = lazy(() => import('./pages/NotFound'))
import { BackgroundBeams } from './components/BackgroundBeams'
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@apollo/client/react'
import { GET_AUTHENTICATED_USER } from './graphQL/queries/user.query'
import { useEffect } from 'react'

const App = () => {
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER)

    const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (loading) {
    return <section>
      <BackgroundBeams />
      <p className='md:text-4xl text-2xl lg:text-4xl font-bold w-screen h-screen flex items-center justify-center text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400  text-transparent bg-clip-text'>
        Loading ...
      </p>
    </section>
  }
  // if (error) return <p>Error: {error.message}</p>
  const authUser = data?.authUser;
  return (
    <>
      <div className="">
        <BackgroundBeams />

        {authUser && <Header />}
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
          <Route path='/transaction/:id' element={authUser ? <Transaction /> : <Navigate to='/login' />} />

          <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
          <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to='/' />} />

          <Route path='*' element={<NotFound />} />
        </Routes>

        <ToastContainer />

      </div>
    </>
  )
}


export default App