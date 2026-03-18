import { KeyboardEvent, useContext, useRef, useState } from "react";
import { Link as RouterLink } from "react-router";
// components
import {
  Box,
  Button,
  Image,
  Menu as MenuRoot,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { MenuOption } from "components";
// utils
import { useBreakpoint, UserContext } from "utils";
// assets
import accountCircleIcon from "assets/icons/icon_account_circle.png";
import chevronDownIcon from "assets/icons/icon_arrow_down.png";
import editIcon from "assets/icons/icon_edit_square.png";
import logoutIcon from "assets/icons/icon_arrow_right_square.png";

export const Menu = () => {
  const { logout } = useContext(UserContext);
  const { isMobile } = useBreakpoint();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenuAndFocusTrigger = () => {
    setIsMenuOpen(false);

    // Defer focus until after Chakra completes its own close/focus handling.
    setTimeout(() => {
      menuButtonRef.current?.focus();
    }, 0);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeMenuAndFocusTrigger();
  };

  const handleLogOut = () => {
    logout();
    closeMenuAndFocusTrigger();
  };

  return (
    <MenuRoot
      offset={[8, 20]}
      isOpen={isMenuOpen}
      onOpen={() => setIsMenuOpen(true)}
      onClose={closeMenuAndFocusTrigger}
    >
      <Box role="group">
        <MenuButton
          as={Button}
          ref={menuButtonRef}
          rightIcon={
            <Image src={chevronDownIcon} alt="Arrow down" sx={sx.menuIcon} />
          }
          sx={sx.menuButton}
          aria-label="my account"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          data-testid="header-menu-dropdown-button"
        >
          <MenuOption
            icon={accountCircleIcon}
            altText="Account"
            text="My Account"
            hideText={isMobile}
          />
        </MenuButton>
      </Box>
      <MenuList
        as="ul"
        role="menu"
        sx={sx.menuList}
        data-testid="header-menu-options-list"
        onKeyDown={handleMenuKeyDown}
      >
        <Box as="li" role="none">
          <MenuItem
            as={RouterLink}
            to="/profile"
            role="menuitem"
            sx={sx.menuItem}
            data-testid="header-menu-option-manage-account"
            onClick={() => setIsMenuOpen(false)}
          >
            <MenuOption
              icon={editIcon}
              altText="Manage account"
              text="Manage Account"
            />
          </MenuItem>
        </Box>
        <Box as="li" role="none">
          <MenuItem
            onClick={handleLogOut}
            role="menuitem"
            sx={sx.menuItem}
            tabIndex={0}
            data-testid="header-menu-option-log-out"
          >
            <MenuOption icon={logoutIcon} text="Log Out" altText="Logout" />
          </MenuItem>
        </Box>
      </MenuList>
    </MenuRoot>
  );
};

const sx = {
  menuButton: {
    padding: 0,
    paddingRight: "spacer1",
    marginLeft: "spacer1",
    borderRadius: 0,
    background: "none",
    color: "white",
    fontWeight: "bold",
    _hover: { color: "secondary", background: "none !important" },
    _active: { background: "none" },
    _focus: {
      boxShadow: "none",
      outline: "0px solid transparent !important",
    },
    ".mobile &": {
      marginLeft: 0,
    },
    "& .chakra-button__icon": {
      marginInlineStart: "0rem",
    },
  },
  menuList: {
    padding: "0",
    border: "none",
    background: "primary_darkest",
    boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.14)",
  },
  menuItem: {
    borderRadius: ".375rem",
    background: "primary_darkest",
    _focus: { background: "primary_darker" },
    _hover: { background: "primary_darker" },
  },
  menuIcon: {
    width: "0.75rem",
  },
};
