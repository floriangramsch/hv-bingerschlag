import { TSelectUser, TUser } from "@/app/helpers/types";
import { bread } from "@/components/ui/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetUsers() {
  return useQuery<TSelectUser[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await fetch("/api/members/getMembers");
      const users: TUser[] = await response.json();
      return users.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        registered: user.registered,
        is_active: user.is_active,
      }));
    },
  });
}

export function useGetUser(id: string | string[] | undefined) {
  return useQuery<TUser>({
    queryKey: ["member", id],
    queryFn: async () => {
      // const response = await fetch(`/api/members/getMember/${id}`);
      const response = await fetch(`/api/members/getMembers`);
      const users: TUser[] = await response.json();
      return users.filter((user) => user.id === Number(id))[0];
    },
    enabled: !!id,
  });
}

export function useRetireUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, retire }: { id: number; retire: boolean }) => {
      const response = await fetch("/api/members/retireUser", {
        method: "PUT",
        body: JSON.stringify({ id, retire }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["members"] });
    },
    onError: (error: Error) => {
      bread(error.message);
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedData,
      id,
    }: {
      updatedData: { firstName: string; lastName: string; email: string };
      id: string | string[] | undefined;
    }) => {
      const response = await fetch(`/api/members/updateMember`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedData, id: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to update member");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["members"] });
      bread("User successfully updated!");
    },
    onError: (error) => {
      bread("Error updating user!");
      console.error("Error updating user:", error);
    },
  });
}
