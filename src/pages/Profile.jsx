import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const {name, email} = formData;
  function onLogout() {
    auth.signOut();
    navigate("/");
  }
  function onChange(e) {
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in the firestore

        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        })
      }
      toast.success('프로필 변경했습니다')
    } catch (error) {
      toast.error("프로필을 변경할 수 없습니다")
    }
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">나의 프로필</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name Input */}
            <input
              type="text" 
              id="name" 
              value={name} 
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`} 
            />

            {/* Email Input */}
            <input type="email" id="email" value={email} disabled className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out" />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center">
                이름을 변경하고 싶습니까?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState)
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "변경 적용" : "변경"}
                </span>
              </p>
              <p
                onClick={onLogout} 
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                로그아웃
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}