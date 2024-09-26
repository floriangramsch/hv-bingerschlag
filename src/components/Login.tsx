import { TSelectUser, TUser } from "@/app/helpers/types";
import { useQuery } from "@tanstack/react-query";

export default function Login({
  setName,
}: {
  setName: (name: TSelectUser | undefined) => void;
}) {
  const {
    data: userOptions,
    isLoading,
    error,
  } = useQuery<TSelectUser[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await fetch("/api/members/getMembers");
      const users: TUser[] = await response.json();
      return users.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
      }));
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <>
      <div className="flex text-center justify-center p-4 mt-1 mb-4 rounded text-xl font-bold bg-primary">
        Click your name to proceed
      </div>
      <div className="mt-16 flex flex-col  bg-bg text-text border-2 border-primary p-5">
        <div className="grid grid-cols-3 gap-3">
          {userOptions &&
            userOptions.map((user) => {
              return (
                <div
                  className="w-20 h-20 bg-secondory border border-bg-lighter flex justify-center items-center"
                  key={user.value}
                  onClick={() => setName(user)}
                >
                  {user.first_name}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
