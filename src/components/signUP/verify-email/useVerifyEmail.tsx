import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/modules/authServices';
import { useToast } from '../../hooks/use-toaste';

export default function useVerifyEmail() {
  const { token } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { verifyEmail } = authService;

  const { mutate: verifyEmailMutation, status: verifyEmailStatus } =
    useMutation({
      mutationFn: verifyEmail,
      onSuccess: data => {
        toast({
          title: 'Verification Successful',
          description: data?.data?.message,
        });
        navigate('/auth/login');
      },
      onError(error: any) {
        toast({
          title: 'Verification Failed',
          description: error?.response?.data?.message,
          variant: 'destructive',
        });
      },
    });

  useEffect(() => {
    if (token) {
      const data = { token };
      verifyEmailMutation(data);
    }
  }, [token, verifyEmailMutation]);

  return { verifyEmailStatus };
}
