import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUserApi,
  getUsersApi,
  loginApi,
  registerApi,
  updateUserApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../../../services/authLogin";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersApi,
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: verifyOtpApi,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
  });
};
