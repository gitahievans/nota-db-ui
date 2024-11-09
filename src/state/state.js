import { proxy } from "valtio";

export const globalState = proxy({
  files: [],
  updateFile: (updatedPDF) => {
    const fileIndex = globalState.files.findIndex((file) => file.id === updatedPDF.id);
    if (fileIndex !== -1) {
      globalState.files[fileIndex] = updatedPDF;
    }
  },
});
