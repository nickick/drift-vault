export const selectedBorderClasses = (selected: boolean) => {
  return {
    "group-hover:border-gray-100 transition-colors": true,
    "border-gray-300": selected,
    "border-gray-500": !selected,
  };
};
