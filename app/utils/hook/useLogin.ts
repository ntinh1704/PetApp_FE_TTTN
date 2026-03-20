import {
    useLoginMutation,
    useRegisterMutation,
} from "./tanstack-query/authQueries";

export const useLogin = () => {
  return useLoginMutation();
};

export const useRegister = () => {
  return useRegisterMutation();
};
