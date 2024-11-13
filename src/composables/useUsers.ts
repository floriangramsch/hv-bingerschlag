import { TSelectUser, TUser } from "@/app/helpers/types";
import { useQuery } from "@tanstack/react-query";

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
