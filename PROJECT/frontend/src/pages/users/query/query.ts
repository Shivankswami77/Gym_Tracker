import { useMutation } from "react-query";
import HttpService, { URLs } from "@src/helpers/api-urls";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ErrorResponse } from "react-router-dom";

const http = new HttpService();

const useGetAllUsers = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (pagination) => {
      const response: AxiosResponse<any> = await http.get(
        URLs.GetAllUsers(pagination.page, pagination.limit)
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
const useGetUserWorkoutPlan = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (pagination) => {
      const response: AxiosResponse<any> = await http.get(pagination.url);
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        console.log(error);
        toast("Something Went Wrong!");
      },
    }
  );
};
const useAddCustomWorkout = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (paylod) => {
      const response: AxiosResponse<any> = await http.post(
        URLs.AddCustomWorkout(),
        paylod.newWorkout
      );
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        console.log(error);
        toast("Something Went Wrong!");
      },
    }
  );
};
const useDeleteCustomWorkout = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (paylod) => {
      const response: AxiosResponse<any> = await http.delete(
        URLs.DeleteCustomWorkout(paylod.id)
      );
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        console.log(error);
        toast("Something Went Wrong!");
      },
    }
  );
};

const useAssignWorkoutPlanToUser = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (payload) => {
      console.log(payload, "payloadpayload");
      const { userId, ...rest } = payload;
      const response: AxiosResponse<any> = await http.post(
        URLs.AssignWorkoutPlanToUser(userId),
        rest
      );
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        console.log(error);
        toast("Something Went Wrong!");
      },
    }
  );
};

export const useGetUserWorkoutPlanById = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (payload) => {
      const response: AxiosResponse<any> = await http.get(
        URLs.UserWorkoutPlanById(payload.userId)
      );
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        console.log(error);
        toast("Something Went Wrong!");
      },
    }
  );
};
const useUpdateUserStatsWorkoutPlanById = () => {
  return useMutation<any, AxiosError<ErrorResponse>, any>(
    async (payload) => {
      const response: AxiosResponse<any> = await http.post(
        URLs.UpdateUserStatsWorkoutPlanById,
        payload
      );
      return response;
    },
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        console.log(error);
        toast("Something Went Wrong!");
      },
    }
  );
};

export {
  useGetAllUsers,
  useDeleteUser,
  useGetUserWorkoutPlan,
  useAddCustomWorkout,
  useDeleteCustomWorkout,
  useAssignWorkoutPlanToUser,
  useUpdateUserStatsWorkoutPlanById,
};
