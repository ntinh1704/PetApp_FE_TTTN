import {
  useDeleteUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useUsersQuery,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "./tanstack-query/authQueries";

export const useLogin = () => {
  return useLoginMutation();
};

export const useRegister = () => {
  return useRegisterMutation();
};

export const useUsers = () => {
  return useUsersQuery();
};

export const useDeleteUser = () => {
  return useDeleteUserMutation();
};

export const useUpdateUser = () => {
  return useUpdateUserMutation();
};

export const useForgotPassword = () => {
  return useForgotPasswordMutation();
};

export const useVerifyOtp = () => {
  return useVerifyOtpMutation();
};

export const useResetPassword = () => {
  return useResetPasswordMutation();
};
