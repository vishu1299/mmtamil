import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, CreateUserPayload } from "./api";
import { registrationKeys } from "./query";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.all });
      if (data?.token) {
        localStorage.setItem("access-token", JSON.stringify(data));
      }
    },
  });
};
