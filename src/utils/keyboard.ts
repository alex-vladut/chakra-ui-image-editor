export const isCtrlZ = (e: KeyboardEvent) => {
  return e.ctrlKey && !e.shiftKey && e.code === "KeyZ";
};
export const isCtrlShiftZ = (e: KeyboardEvent) => {
  return e.ctrlKey && e.shiftKey && e.code === "KeyZ";
};

export const isArrow = (e: KeyboardEvent) => {
  return ["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"].includes(e.code);
};
