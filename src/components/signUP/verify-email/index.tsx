import useVerifyEmail from './useVerifyEmail';

const VerifyEmail = () => {
  const { verifyEmailStatus } = useVerifyEmail();

  return (
    <>
      {verifyEmailStatus === 'pending' && (
        <div>
          <p>Please wait while we verify your email</p>
        </div>
      )}

      {verifyEmailStatus === 'error' && <h1>Email Verification Failed</h1>}
    </>
  );
};

export default VerifyEmail;
