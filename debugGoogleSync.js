
export const debugGoogleSync = (step, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[Google Sync Debug] [${timestamp}] Step: ${step}`);
  if (data !== null) {
    console.dir(data, { depth: null });
  }
};
