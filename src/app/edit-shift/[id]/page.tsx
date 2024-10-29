"use client";

import { TSelectUser, TShift, TUser } from "@/app/helpers/types";
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

  const {
    data: users,
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
        registered: user.registered,
        is_active: user.is_active,
      }));
    },
  });

  const { data: shift } = useQuery({
    queryKey: ["shift", id],
    queryFn: async () => {
      const response = await fetch(`/api/shifts/${id}`);
      const shifts = await response.json();
      const shift = shifts[0];
      return shift;
    },
    enabled: !!id, // Only run the query if id is available
  });

  const [formData, setFormData] = useState({
    date: "",
    endDate: "",
    worker1_id: "",
    worker2_id: "",
    specialName: "",
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        specialName: shift.special_name,
        date:
          shift.date.split("T")[0] + " " + shift.date.split("T")[1].slice(0, 8), // Format für MySQL
        endDate:
          shift.end_date.split("T")[0] +
          " " +
          shift.end_date.split("T")[1].slice(0, 8), // Format für MySQL
        worker1_id: shift.worker1_id,
        worker2_id: shift.worker2_id,
      });
    }
  }, [shift]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateShiftMutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
      const response = await fetch(`/api/shifts/updateShift`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedData,
          id: id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update shift");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["shifts"] });
      toast("Shift successfully updated!");
    },
    onError: (error) => {
      console.error("Error updating shift:", error);
    },
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    updateShiftMutation.mutate(formData);
  };

  return (
    <>
      {isAdmin && (
        <div>
          <form className="flex flex-col" onSubmit={submit}>
            <Input
              label="Date"
              name="date"
              type="datetime-local" // Optional, falls du eine Datums-Picker-Funktionalität willst
              value={formData.date}
              onChange={handleChange}
            />
            <Input
              label="End Date"
              name="endDate"
              type="datetime-local" // Optional
              value={formData.endDate}
              onChange={handleChange}
            />
            <Input
              label="Special Name"
              name="specialName"
              value={formData.specialName}
              onChange={handleChange}
            />
            <select
              name="worker1_id"
              value={formData.worker1_id}
              onChange={handleChange}
              className="text-black"
            >
              <option value="">Select Worker 1</option>
              {users?.map((user) => (
                <option key={user.value} value={user.value}>
                  {user.label}
                </option>
              ))}
            </select>
            <select
              name="worker2_id"
              value={formData.worker2_id}
              onChange={handleChange}
              className="text-black"
            >
              <option value="">Select Worker 2</option>
              {users?.map((user) => (
                <option key={user.value} value={user.value}>
                  {user.label}
                </option>
              ))}
            </select>
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
