import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { getUser, login } from '../../utils/jwt';
import useIsMountedRef from '../../utils/useIsMountedRef';
// components
import FormProvider from './FormProvider&Fields';
import { RHFTextField, RHFCheckbox } from './FormProvider&Fields';
import Iconify from '../misc/Iconify';
import { PATH_DASHBOARD } from '../../pages/routes/paths';


// ----------------------------------------------------------------------

type FormValuesProps = {
  username: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function LoginForm() {
  const [loginError, setLoginError] = useState({ error: null });
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    username: '',
    password: '',
    remember: true,
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const {
    // reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setLoginError({ error: null });
    try {
      await login(data.username, data.password).then(() => {
        const token = localStorage.getItem('accessToken');
        getUser(token ? token : '').then((response) => {
          if (response) {
            if (response.username === data.username) {
              navigate(PATH_DASHBOARD.general.start)
            };
          };
        });
      });
    } catch (error) {
      if (isMountedRef.current) {
        var message = null;
        if(JSON.parse(error).password) {
          message = JSON.parse(error).password;
        } else if(JSON.parse(error).username) {
          message = JSON.parse(error).username;
        } else {
          message = JSON.parse(error).detail;
        }
        setLoginError({ error: message });
      }
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {loginError?.error && <Alert severity="error">{loginError.error}</Alert>}

        <RHFTextField name="username" label="Username" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />

        {/* <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
