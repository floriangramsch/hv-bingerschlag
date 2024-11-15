"use client";

import useIsAdmin from "@/composables/useAdmin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useGetUser, useUpdateUserMutation } from "@/composables/useUsers";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const { data: isAdmin } = useIsAdmin();

  const { data: member } = useGetUser(id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.first_name ?? "",
        lastName: member.last_name ?? "",
        email: member.email ?? "",
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

  const updateMemberMutation = useUpdateUserMutation();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMemberMutation.mutate({ updatedData: formData, id });
  };

  return (
    <>
      {isAdmin && (
        <div className="p-2">
          <form className="flex flex-col gap-2" onSubmit={submit}>
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
            <Button className="mt-4" type="submit">
              Update
            </Button>
          </form>
          <Toast />
        </div>
      )}
    </>
  );
}
