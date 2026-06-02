"use client";

import { useState, useTransition } from "react";

type LikeButtonProps = {
  advertisementId: string;
  initialLikes: number;
};

export function LikeButton({ advertisementId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-full border border-[#d7c3ae] bg-white px-5 py-3 font-semibold text-[#0f3d55] transition hover:border-[#cb6b3d] hover:text-[#cb6b3d] disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          const response = await fetch(`/api/advertisements/${advertisementId}/like`, {
            method: "POST",
          });

          const json = (await response.json().catch(() => null)) as
            | { data?: { likesCount?: number } }
            | null;

          if (response.ok && json?.data?.likesCount !== undefined) {
            setLikes(json.data.likesCount);
          }
        });
      }}
    >
      {pending ? "Saving..." : `Like this ad (${likes})`}
    </button>
  );
}
