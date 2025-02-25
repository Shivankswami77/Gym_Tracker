import { useMutation } from "react-query";
import HttpService, { URLs } from "@src/helpers/api-urls";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ErrorResponse } from "react-router-dom";

const http = new HttpService();

const useGetAllUsers = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async () => {
      const response: AxiosResponse<any> = await http.get(URLs.GetAllUsers);
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        toast("Something Went Wrong!");
      },
    }
  );
};
const useDeleteUser = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (userId) => {
      const response: AxiosResponse<any> = await http.delete(
        URLs.DeleteUser(userId)
      );
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        toast("Something Went Wrong!");
      },
    }
  );
};

export { useGetAllUsers, useDeleteUser };
