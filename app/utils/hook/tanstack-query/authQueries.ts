import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi } from "../../../services/authLogin";

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
