import { createBrowserRouter } from "react-router-dom";
import Home from "../../Pages/home";
import AboutUs from "../../Pages/AboutUs/about";
import ContactUs from "../../Pages/ContactUs";
import LoginForm from "../SignIn/LogInForm";
import ForgotPasswordForm from "../SignIn/ForgotPassword";
import CreateAccount from "../signUP/user-onboarding";


const router = createBrowserRouter([
              {path:"/login", element:(<LoginForm />)},
              {path:"/sign-up", element:(<CreateAccount />)},
              {path:"/forgotPassword", element:(<ForgotPasswordForm />)},
              // {path:"/reset-password", element:(<ResetPassword />)},
              // {path:"/verify-email", element:(<VerifyEmail />)},
              // {
              //   path: "/verify-email", element: (<VerifyEmail />)
              // },
              //   {
              //   path: "/dashboard",
              //   element: (
              //     <ProtectedRoute requireVerified={true}>
              //       <Dashboard />
              //     </ProtectedRoute>
              //   )
              //   },
  {
    path: "/",
    element: (
      <Home />
    ),
  },
  {
    path: "/contactus",
    element: (
         <ContactUs />
    ),
  },
      

     {
    path: "/aboutus",
    element: (
        <AboutUs
         />
    ),
  },
]);

export { router };
