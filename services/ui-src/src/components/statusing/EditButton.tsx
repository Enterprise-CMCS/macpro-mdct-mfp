import { useNavigate } from "react-router-dom";
import editIcon from "assets/icons/icon_edit.png";
import iconSearch from "assets/icons/icon_search_blue.png";
import { Button, Image } from "@chakra-ui/react";

export const EditButton = ({
  buttonAriaLabel,
  path,
  editable,
  showIcon = false,
}: Props) => {
  const navigate = useNavigate();
  const icon = editable ? editIcon : iconSearch;
  const altText = editable ? "Edit Program" : "View Program";
  const displayText = editable ? "Edit" : "View";
  return (
    <Button
      sx={sx.enterButton}
      variant="outline"
      aria-label={buttonAriaLabel}
      onClick={() => navigate(path, { state: { validateOnRender: true } })}
    >
      {showIcon && <Image src={icon} alt={altText} />}
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

const sx = {
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
    border: "1px solid",
    borderColor: "palette.gray_lighter",
    color: "palette.primary",
    ".mobile &": {
      width: "6rem",
      borderColor: "palette.primary",
      marginTop: "spacer1",
    },
    img: {
      width: "1rem",
      marginRight: "spacer1",
    },
  },
};
