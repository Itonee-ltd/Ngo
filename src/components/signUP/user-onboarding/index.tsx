import { Dot } from 'lucide-react';
import { Button } from '../../core/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../core/form';
import { Check } from 'lucide-react';
import { Input } from '../../core/input';
import { EyeOffIcon, EyeOpenIcon } from '../../core/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { Progress } from '../../core/progress';
import useCreateAccount from './useUserOnboarding';

const CreateAccount = () => {
  const {
    form,
    showPassword,
    setShowPassword,
    isLoading,
    handleSubmit,
    strength,
    strengthInText,
    indicatorColor,
    password,
    passwordLength,
    passwordUpperCase,
    passwordDigit,
    passwordSymbol,
  } = useCreateAccount();
  //const [searchParams] = useSearchParams();


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Form container with card-like styling */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-[18px] mt-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-[18px]">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="What is your first name?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="What is your last name?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose a Password</FormLabel>
                <FormControl>
                  <div className="flex items-center relative">
                    <Input
                      placeholder="Enter password"
                      {...field}
                      type={!showPassword ? 'password' : 'text'}
                      className="pr-9"
                    />
                    <button
                      type="button"
                      className="absolute right-2.5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <EyeOpenIcon className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <EyeOffIcon className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-1.5">
            <Progress
              value={strength}
              className="h-2.5"
              indicatorColor={indicatorColor}
            />

            <div className="flex flex-col text-sm text-neutral-500 leading-6">
              <div className="flex items-center justify-between">
                <p>Your password must contain:</p>
                {password && <p>{strengthInText}</p>}
              </div>
              <ul className="list-inside">
                <li className="flex items-center gap-2 list-inside list-disc">
                  {passwordSymbol ? (
                    <Check className="text-green-500 w-4 h-4" />
                  ) : (
                    <Dot className="text-neutral-500 w-4 h-4" />
                  )}{' '}
                  <span>a symbol</span>
                </li>
                <li className="flex items-center gap-2 list-inside list-disc">
                  {passwordUpperCase ? (
                    <Check className="text-green-500 w-4 h-4" />
                  ) : (
                    <Dot className="text-neutral-500 w-4 h-4" />
                  )}
                  <span>an uppercase letter</span>
                </li>
                <li className="flex items-center gap-2 list-inside list-disc">
                  {passwordDigit ? (
                    <Check className="text-green-500 w-4 h-4" />
                  ) : (
                    <Dot className="text-neutral-500 w-4 h-4" />
                  )}
                  <span>a number</span>
                </li>
                <li className="flex items-center gap-2 list-inside list-disc">
                  {passwordLength ? (
                    <Check className="text-green-500 w-4 h-4" />
                  ) : (
                    <Dot className="text-neutral-500 w-4 h-4" />
                  )}
                  <span> 8 characters minimum</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <Button className='bg-[#df2020]' type="submit">
              {isLoading ? 'Loading...' : 'Continue'}
            </Button>
            <div className="flex flex-col items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <p className="text-neutral-600">Already have an Account?</p>
                <Link
                  to={"/login"}
                  className="text-primary underline font-medium"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
    </div>
  );
};

export default CreateAccount;
