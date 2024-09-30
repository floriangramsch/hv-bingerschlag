import { useQuery } from "@tanstack/react-query";

const useIsAdmin = () => {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (typeof window !== "undefined") {
        const storedIsAdmin = localStorage.getItem("isAdmin");
        return storedIsAdmin === "true";
      }
      return false;
    },
  });
};

export default useIsAdmin;
