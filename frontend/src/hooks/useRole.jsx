import React from "react";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
const useRole = () => {
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ["role"],

    queryFn: async () => {
      const { data } = await axiosSecure(`/user/role`);
      return data.role;
    },
  });

  return { role, isRoleLoading };
};

export default useRole;
