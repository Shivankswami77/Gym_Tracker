import { useMutation } from "react-query";
import HttpService, { URLs } from "@src/helpers/api-urls";
// import useGetLoggedInUserDetailsStore from "@src/store/user-permissions-store";
// import { UserProfileDetails } from "../types/types";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ErrorResponse } from "react-router-dom";

const http = new HttpService();

const useLogin = () => {
  return useMutation(
    async (loginPayload: { email: string; password: string }) => {
      return http.post(URLs.UserLogin, loginPayload, undefined, {
        "Public-Request": "true",
      });
    },
    {
      onError: (error: any) => {
        toast("Login failed");
      },
    }
  );
};
const useGetLoggedInUserProfile = () => {
  // const { setLoggedInUserProfile, setLoggedInUserDetails } =
  //   useGetLoggedInUserDetailsStore();

  return useMutation<any, AxiosError<ErrorResponse>>(
    async () => {
      const response: AxiosResponse<any> = await http.get(
        URLs.LoggedUserProfile
      );
      return response.data;
    },
    {
      onSuccess: (data: any) => {
        // setLoggedInUserProfile(data?.permissions);
        // setLoggedInUserDetails(data?.userInfo);
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        toast("Login failed");
      },
    }
  );
};

export { useLogin, useGetLoggedInUserProfile };
