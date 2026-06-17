"use client";

import CinematicScrollExperience from "./CinematicScrollExperience";
import type { CinematicExperience } from "@/lib/cinematic/types";

export function CinematicWebsiteShell({
  experience,
}: {
  experience: CinematicExperience;
}) {
  return <CinematicScrollExperience experience={experience} />;
}
