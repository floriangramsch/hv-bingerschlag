"use client";

import { TUser } from "@/app/helpers/types";
import useIsAdmin from "@/app/helpers/useIsAdmin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Page() {
  const { id } = useParams();

  const { data: isAdmin } = useIsAdmin();

  const queryClient = useQueryClient();

  const { data: member } = useQuery<TUser>({
    queryKey: ["member", id],
    queryFn: async () => {
      // const response = await fetch(`/api/members/getMember/${id}`);
      const response = await fetch(`/api/members/getMembers`);
      const users: TUser[] = await response.json();
      return users.filter((user) => user.id === Number(id))[0];
    },
    enabled: !!id, // Only run the query if id is available
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // Füge hier weitere Felder hinzu
  });

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.first_name,
        lastName: member.last_name,
        email: member.email,
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateMemberMutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
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
      toast("User successfully updated!");
    },
    onError: (error) => {
      console.error("Error updating member:", error);
    },
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMemberMutation.mutate(formData);
  };

  return (
    <>
      {isAdmin && (
        <div>
          <form className="flex flex-col" onSubmit={submit}>
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <Input
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <Button className="m-1" type="submit">
              Update
            </Button>
          </form>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
