"use client";

import useIsAdmin from "@/composables/useAdmin";
import Button from "@/components/ui/Button";
import Confirm from "@/components/ui/Confirm";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { bread } from "@/components/ui/Toast";
import {
  useGetShift,
  useRemoveShift,
  useUpdateShift,
} from "@/composables/useShifts";
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
  const [showConfirmDeleteShift, setShowConfirmDeleteShift] =
    useState<boolean>(false);

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
        worker1_id: shift.worker1_id !== "" ? shift.worker1_id : null,
        worker2_id: shift.worker2_id !== "" ? shift.worker2_id : null,
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
  const removeShiftMutation = useRemoveShift();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) bread("No Id!");
    else updateShiftMutation.mutate({ ...formData, id: id });
  };

  const removeShift = () => {
    if (!id) bread("No Id!");
    else
      removeShiftMutation.mutate(id, {
        onSuccess: () => (window.location.href = `/shiftPlan`),
      });
  };

  return (
    <>
      {isAdmin && (
        <>
          <form className="flex flex-col gap-2" onSubmit={submit}>
            <Input
              label="Date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
            />
            <Input
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
            />
            <Input
              label="Special Name"
              name="specialName"
              value={formData.specialName}
              onChange={handleChange}
            />
            <Select
              value={formData.worker1_id ?? undefined}
              name="worker1_id"
              options={
                users?.map((user) => ({
                  value: user.value,
                  label: user.label,
                })) ?? []
              }
              change={handleChange}
            >
              Select Worker 1
            </Select>
            <Select
              value={formData.worker2_id ?? undefined}
              name="worker2_id"
              options={
                users?.map((user) => ({
                  value: user.value,
                  label: user.label,
                })) ?? []
              }
              change={handleChange}
            >
              Select Worker 2
            </Select>
            <Button className="m-1" type="submit">
              Update
            </Button>

            <Button
              className="bg-red-600"
              func={() => setShowConfirmDeleteShift(true)}
            >
              Remove
            </Button>
            <Confirm
              isOpen={showConfirmDeleteShift}
              yes={removeShift}
              no={() => setShowConfirmDeleteShift(false)}
            >
              Delete Shift?
            </Confirm>
          </form>
        </>
      )}
    </>
  );
}
