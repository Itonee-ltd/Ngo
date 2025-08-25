import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/modules/authServices";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function useLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password must be at least 1 character"),
  });

  const { login } = authService;

  const { mutate: loginMutate, status: loginStatus } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      navigate("/");
      localStorage.setItem("token", data?.data?.data?.token);
      localStorage.setItem(
        "profile",
        JSON.stringify(data?.data?.data?.admin)
      );
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin = handleSubmit((data) => {
    loginMutate(data);
  });

  return {
    register,
    errors,
    handleLogin,
    isLoading: loginStatus === "pending",
    isPasswordVisible,
    setIsPasswordVisible,
  };
}