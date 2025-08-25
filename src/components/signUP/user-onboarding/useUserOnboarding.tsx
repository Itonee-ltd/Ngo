/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '../../../helpers/zod-schema';
import { authService } from '../../services/modules/authServices';
import { useToast } from '../../hooks/use-toaste';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  email: emailSchema('Email is required'),
  password: passwordSchema('Password is required'),
  first_name: z.string().min(1, { message: 'First Name is required' }),
  last_name: z.string().min(1, { message: 'Last Name is required' }),
});

export default function useCreateAccount() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },
  });
  const { toast } = useToast();
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthInText, setStrengthInText] = useState('');
  const [indicatorColor, setIndicatorColor] = useState('#E53E3E');
  const password = form.watch('password');
  const passwordLength = password.length >= 8;
  const passwordUpperCase = /[A-Z]/.test(password);
  const passwordDigit = /\d/.test(password);
  const passwordSymbol = /[@$!%*?&#]/.test(password);

  const { createAccount } = authService;

  const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score += 30;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[@$!%*?&#]/.test(password)) score += 10;

    return Math.min(score, 100); // Cap strength at 100%
  };

  const { mutate: createAccountMutate, status: createBusinessStatus } =
    useMutation({
      mutationFn: createAccount,
      onSuccess: data => {
        toast({
          title: 'Registration Successful',
          description: data?.data?.message,
        });
        navigate('/success');
      },
      onError(error: any) {
        toast({
          title: 'Registration Failed',
          description: error?.response?.data?.message,
          variant: 'destructive',
        });
      },
    });

  useEffect(() => {
    const strengthValue = getPasswordStrength(password);
    setStrength(strengthValue);

    if (strengthValue < 40) {
      setIndicatorColor('#E53E3E');
      setStrengthInText('Weak');
    } // Red (Weak)
    else if (strengthValue < 80) {
      setIndicatorColor('#E8B931');
      setStrengthInText('Moderate');
    } // Yellow (Medium)
    else {
      setIndicatorColor('#38A169');
      setStrengthInText('Strong');
    } // Green (Strong)
  }, [password]);

  const handleSubmit = form.handleSubmit((data: z.infer<typeof formSchema>) => {
    const payload = {
      email: data.email,
      last_name: data.last_name,
      first_name: data.first_name,
      password: data.password,
    };
    createAccountMutate(payload);
  });

  return {
    form,
    showPassword,
    setShowPassword,
    isLoading: createBusinessStatus === 'pending',
    handleSubmit,
    strength,
    strengthInText,
    indicatorColor,
    password,
    passwordLength,
    passwordUpperCase,
    passwordDigit,
    passwordSymbol,
  };
}
