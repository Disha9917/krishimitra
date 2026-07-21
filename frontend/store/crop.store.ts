import { CropAdvisoryResult } from "../types/crop";

let currentAdvisory: CropAdvisoryResult | null = null;

export const cropStore = {
  getAdvisory: () => currentAdvisory,
  setAdvisory: (advisory: CropAdvisoryResult) => {
    currentAdvisory = advisory;
  },
};