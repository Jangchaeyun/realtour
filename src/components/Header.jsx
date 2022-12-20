import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Logo from '../assest/realtour.png'

export default function Header() {
  const [pageState, setPageState] = useState("로그인")
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) =>{
      if(user) {
        setPageState("프로필")
      } else {
        setPageState("로그인");
      }
    })
  }, [auth])
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true
    }
  }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img
                    src={Logo} 
                    alt="logo"
                    className="h-11 cursor-pointer"
                    onClick={() => navigate("/")}
                />
            </div>
            <div>
              <ul className='flex space-x-10'>
                <li 
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "text-black border-b-red-500"}`}
                  onClick={() => navigate("/")}  
                >
                  홈
                </li>
                <li 
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/offers") && "text-black border-b-red-500"}`}
                  onClick={() => navigate("/offers")}
                >
                  예약
                </li>
                <li 
                  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                    (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black border-b-red-500"
                  }`}
                  onClick={() => navigate("/profile")}
                >
                  {pageState}
                </li>
              </ul>
            </div>
        </header>
    </div>
  )
}