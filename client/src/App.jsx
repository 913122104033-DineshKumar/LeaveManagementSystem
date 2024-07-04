import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import PageNotFound from "./pages/PageNotFound";
import Mentor from "./pages/Mentor";
import HomePage from "./pages/HomePage/HomePage";
import Navbar from "./components/NavBar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import StaffSignUp from "./components/StaffSignUp"
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import LeaveRequestForm from "./components/LeaveRequestForm";
import DashBoard from "./pages/DashBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* Pages that are Generally Availabe to Everyone */}
        <Route path='/' element={<HomePage />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/staffsignup' element={<StaffSignUp/>} />
        <Route path='*' element={<PageNotFound />} />
        {/* Pages that are only availabe to the users Signed in  */}
        <Route element={<PrivateRoute />} >
          <Route path='/studentdashboard' element={<DashBoard />} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/leaverequest' element={<LeaveRequestForm />} />
        </Route>
        
        <Route path='/superadmin' element={<SuperAdmin />} />
        <Route path='/mentor' element={<Mentor/>} />
      </Routes>

      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />} >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />} >
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes> */}
   
    </BrowserRouter>
  );
}
