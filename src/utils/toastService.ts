import { useToast } from "reshaped";
import { Check } from "react-feather"; // or your icons
import { ComponentType } from "react";

const useToastService = () => {
  const toast = useToast();

  const defaultOptions = {
    position: "bottom-end" as
      | "bottom-end"
      | "bottom-start"
      | "top-end"
      | "top-start",
    timeout: 3000,
    icon: Check as ComponentType,
  };

  return {
    // show,
    success: (message: string) =>
      toast.show({ text: message, color: "positive", ...defaultOptions }),
    error: (message: string) =>
      toast.show({ text: message, color: "critical", ...defaultOptions }),
    warning: (message: string) =>
      toast.show({ text: message, color: "warning", ...defaultOptions }),
    info: (message: string) =>
      toast.show({ text: message, color: "primary", ...defaultOptions }),
  };
};

export default useToastService;
