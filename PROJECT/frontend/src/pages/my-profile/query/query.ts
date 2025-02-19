import { useMutation } from "react-query";
import HttpService, { URLs } from "@src/helpers/api-urls";
// import useGetLoggedInUserDetailsStore from "@src/store/user-permissions-store";
// import { UserProfileDetails } from "../types/types";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ErrorResponse } from "react-router-dom";

const http = new HttpService();

const useGetUserDetailsById = () => {
  return useMutation<any, AxiosError<ErrorResponse>, string>( // Define `string` as the variable type
    async (userId) => {
      const response: AxiosResponse<any> = await http.get(
        URLs.GetUserDetails(userId)
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

const useUpdateUserProfile = () => {
  return useMutation(
    async (addEditIncoTermsPayload: any) => {
      const { userId, ...rest } = addEditIncoTermsPayload;
      return http.put(URLs.UpdateUserDetails(userId), rest, {
        "Public-Request": "true",
      });
    },
    {
      onError: (error: any) => {
        toast("Something Went Wrong!");
      },
    }
  );
};

export { useGetUserDetailsById, useUpdateUserProfile };
