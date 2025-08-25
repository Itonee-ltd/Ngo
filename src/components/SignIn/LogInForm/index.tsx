// import { image } from "@/assets/image/image";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useLogin from "./useLogin";

const LoginForm = () => {
  const {
    register,
    errors,
    handleLogin,
    isLoading,
    isPasswordVisible,
    setIsPasswordVisible,
  } = useLogin();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-center border-b">
        <button onClick={() => navigate("/")}>
          {/* <img src={image.signinlogo} className="w-36 m-4" alt="logo" /> */}
        </button>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex justify-center w-full lg:w-[600px] p-6 flex-col gap-6 lg:mt-32 bg-white rounded-lg border-solid border border-[#e9ecef]">
          <div className="flex items-center lg:w-[540px] flex-col gap-2">
            <span className="text-2xl font-semibold text-center lg:whitespace-nowrap">
              Login
            </span>
            <span className="text-md font-normal text-[#6c6a6a] text-center">
              Enter your credentials to log in
            </span>
          </div>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 py-2 px-2 rounded-xl"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors?.email?.message && (
                  <span className="text-right text-red-500 ">
                    {String(errors.email.message)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="password">Password</label>
                <div>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="w-full border border-gray-300 py-2 px-2 rounded-xl"
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                    <span
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-3 top-2 cursor-pointer text-gray-500"
                    >
                      {isPasswordVisible ? (
                        <HiEyeOff size={20} />
                      ) : (
                        <HiEye size={20} />
                      )}
                    </span>
                  </div>
                  {errors?.password?.message && (
                    <span className="flex mb-4 justify-end text-red-500 ">
                      {String(errors.password.message)}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#E74040] text-center w-full py-2 text-white rounded-xl"
              >
                {isLoading ? "Loading..." : "Log In"}
              </button>

              <p className="text-center">
                Forgot Your Password?{" "}
                <span
                  className="text-primary underline cursor-pointer"
                  onClick={() => navigate("/forgotPassword")}
                >
                  Click here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;