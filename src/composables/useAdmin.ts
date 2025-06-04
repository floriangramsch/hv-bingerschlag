import { bread } from "@/components/ui/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const res = await fetch("/api/auth/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { success } = await res.json();
      return success || false;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      const response = await fetch("/api/auth/admin", {
        method: "POST",
        body: JSON.stringify(password),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.result) {
        localStorage.setItem("token", data.token);
      } else {
        localStorage.removeItem("token");
      }
      if (data.message === "Wrong password") {
        throw new Error("Wrong password");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
    onError: (e) => bread(e.message),
  });
}
