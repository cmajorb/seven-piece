import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { register, getAdminToken } from '../../utils/jwt';
import useIsMountedRef from '../../utils/useIsMountedRef';
// components
import FormProvider from './FormProvider&Fields';
import { RHFTextField } from './FormProvider&Fields';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  username: string;
  password: string;
  discord: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const [registerError, setRegisterError] = useState({ error: '' });

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultValues = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    discord: '',
    confirmPassword: '',
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  useEffect(() => {
    getAdminToken();
  }, []);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setRegisterError({ error: '' });
    try {
      console.log(data.discord);
      await register(data.email, data.username, data.password, data.firstName, data.lastName, data.discord);
      reset();
      window.location.href = '/auth/login';
    } catch (error) {
      if (isMountedRef.current) {
        setRegisterError({ error: (typeof error.description == 'string' ? error.description : 'An Error occurred. Perhaps you have already created an account with that email?') ?? `Password should: ${error.policy}` });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {registerError?.error && <Alert severity="error">{registerError.error}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="username" label="Username" />
        <RHFTextField name="email" label="Email address" />
        <RHFTextField name="discord" label="Discord Name (ie. username#1111)" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Sign Up
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
