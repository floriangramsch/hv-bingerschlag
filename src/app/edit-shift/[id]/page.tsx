"use client";

import { TShift } from "@/app/helpers/types";
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

  const { data: shift } = useQuery<TShift>({
    queryKey: ["shift", id],
    queryFn: async () => {
      const response = await fetch(`/api/shifts/${id}`);
      const shifts = await response.json();
      return shifts[0];
    },
    enabled: !!id, // Only run the query if id is available
  });

  const [formData, setFormData] = useState({
    specialName: "",
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        specialName: shift.special_name,
      });
    }
  }, [shift]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateShiftMutation = useMutation({
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
    console.log(formData);
    // updateShiftMutation.mutate(formData);
  };

  return (
    <>
      {formData.specialName}
      {isAdmin && (
        <div>
          <form className="flex flex-col" onSubmit={submit}>
            <Input
              label="Special Name"
              name="specialName"
              value={formData.specialName}
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
