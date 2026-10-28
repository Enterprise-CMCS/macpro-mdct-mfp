import { useNavigate } from "react-router";
import { Button } from "@chakra-ui/react";

export const EditButton = ({ buttonAriaLabel, path, editable }: Props) => {
  const navigate = useNavigate();
  const displayText = editable ? "Edit" : "View";
  return (
    <Button
      variant="outline"
      aria-label={buttonAriaLabel}
      onClick={() => navigate(path)}
    >
      {displayText}
    </Button>
  );
};

interface Props {
  buttonAriaLabel: string;
  path: string;
  editable: boolean;
  showIcon?: boolean;
}
