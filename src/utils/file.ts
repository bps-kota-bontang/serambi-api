export const generateFileName = (extension: string): string => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  return `file_${timestamp}.${extension}`;
};

export const getFileExtension = (file: File): string => {
  return file.name.split(".").pop() || "";
};
