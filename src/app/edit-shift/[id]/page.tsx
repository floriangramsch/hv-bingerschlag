"use client";

import useIsAdmin from "@/app/helpers/useIsAdmin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useGetShift, useUpdateShift } from "@/composables/useShifts";
import { useGetUsers } from "@/composables/useUsers";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const { data: isAdmin } = useIsAdmin();

  const { data: users } = useGetUsers();

  const { data: shift } = useGetShift(id);

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

  const updateShiftMutation = useUpdateShift();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      updateShiftMutation.mutate({ ...formData, id: id });
    }
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
          <Toast />
        </div>
      )}
    </>
  );
}
