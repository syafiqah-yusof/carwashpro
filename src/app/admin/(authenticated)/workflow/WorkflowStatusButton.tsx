"use client";

import { useState } from "react";
import { updateJobStatus } from "./actions";

type WorkflowStatusButtonProps = {
  jobId: string;
  targetStatus: string;
  label: string;
  iconClass: string;
  className: string;
};

export default function WorkflowStatusButton({ jobId, targetStatus, label, iconClass, className }: WorkflowStatusButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    setIsUpdating(true);
    const res = await updateJobStatus(jobId, targetStatus);
    if (res.error) {
      alert(res.error);
      setIsUpdating(false);
    }
    // If success, Next.js server actions revalidate automatically so the UI will refresh!
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isUpdating}
      className={`${className} disabled:opacity-50`}
    >
      {isUpdating ? 'Updating...' : (
        <>
          {label} <i className={iconClass}></i>
        </>
      )}
    </button>
  );
}
