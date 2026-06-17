const activePipelineByUser = new Set<string>();
const activeMediaByUser = new Set<string>();

export const generationLocks = {
  acquirePipeline(userId: string) {
    if (activePipelineByUser.has(userId)) {
      throw new Error("A website pipeline is already running. Wait for it to finish.");
    }
    activePipelineByUser.add(userId);
  },
  releasePipeline(userId: string) {
    activePipelineByUser.delete(userId);
  },
  acquireMedia(userId: string) {
    if (activeMediaByUser.has(userId)) {
      throw new Error("An image or video generation is already in progress.");
    }
    activeMediaByUser.add(userId);
  },
  releaseMedia(userId: string) {
    activeMediaByUser.delete(userId);
  },
};
