import React from 'react'
import{Route,Routes} from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import Captainsignup from './pages/Captainsignup'
import Home from './pages/Home'
import { UserDataContext } from './context/UserContext'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainLogout from './pages/CaptainLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import { SocketProvider } from './context/SocketContext'
import 'remixicon/fonts/remixicon.css'
const App = () => {
  return (
    <SocketProvider>
      <div>
       <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/login' element={<UserLogin/>} />
        <Route path='/riding' element={<Riding/>} />
        <Route path='/captain-riding' element={<CaptainRiding/>} />
        <Route path='/signup' element={<UserSignup/>} />
        <Route path='/captainlogin' element={<Captainlogin/>} />
        <Route path='/captainsignup' element={<Captainsignup/>} />
        <Route path='/home' element={
           <UserProtectWrapper>
               <Home/>
            </UserProtectWrapper>
        } />  
        <Route path='/user/logout' element={<UserProtectWrapper>
          <UserLogout/>
        </UserProtectWrapper>} />   
        <Route path='/captain-home' element={
           <CaptainProtectWrapper>
               <CaptainHome/>
            </CaptainProtectWrapper>
        } />   
        <Route path='/captain/logout' element={<CaptainProtectWrapper>
          <CaptainLogout/>
        </CaptainProtectWrapper>} />
       </Routes>
      </div>
    </SocketProvider>
  )
}

export default App