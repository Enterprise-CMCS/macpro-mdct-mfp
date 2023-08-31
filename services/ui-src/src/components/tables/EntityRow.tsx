// components
import { Box, Button, Image, Td, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
// types
import { AnyObject, EntityShape } from "types";
// utils
import { useUserStore } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";

export const EntityRow = ({
  entity,
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openDrawer,
}: Props) => {
  const { name, isOtherEntity } = entity;
  const { userIsEndUser } = useUserStore().user ?? {};

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        <EntityStatusIcon entity={entity as EntityShape} />
      </Td>
      <Td sx={sx.entityName}>{name}</Td>
      <Td>
        <Box sx={sx.actionContainer}>
          {isOtherEntity && (
            <Button
              sx={sx.editNameButton}
              variant="none"
              onClick={() => openAddEditEntityModal(entity)}
            >
              {verbiage.editEntityButtonText}
            </Button>
          )}
          <Button
            sx={isOtherEntity ? sx.editOtherEntityButton : sx.editEntityButton}
            onClick={() => openDrawer(entity)}
            variant="outline"
          >
            {verbiage.enterEntityDetailsButtonText}
          </Button>
          {isOtherEntity && (
            <Button
              sx={sx.deleteButton}
              data-testid="delete-entity"
              onClick={() => openDeleteEntityModal(entity)}
              disabled={!userIsEndUser}
            >
              <Image src={deleteIcon} alt="delete icon" boxSize="3xl" />
            </Button>
          )}
        </Box>
      </Td>
    </Tr>
  );
};

interface Props {
  entity: EntityShape;
  verbiage: AnyObject;
  openAddEditEntityModal: Function;
  openDeleteEntityModal: Function;
  openDrawer: Function;
  [key: string]: any;
}

const sx = {
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    td: {
      borderColor: "palette.gray_light",
      paddingRight: 0,
    },
  },
  statusIcon: {
    maxWidth: "fit-content",
  },
  errorText: {
    color: "palette.error_dark",
    fontSize: "0.75rem",
    marginBottom: "0.75rem",
  },
  entityName: {
    maxWidth: "18.75rem",
    fontSize: "md",
    fontWeight: "bold",
  },
  actionContainer: {
    alignItems: "center",
    display: "flex",
  },
  editNameButton: {
    paddingRight: "2.5rem",
    fontWeight: "normal",
    textDecoration: "underline",
    color: "palette.primary",
  },
  editEntityButton: {
    padding: 0,
    fontWeight: "bold",
    width: "6.5rem",
    marginLeft: "8.25rem",
  },
  editOtherEntityButton: {
    padding: 0,
    fontWeight: "bold",
    width: "6.5rem",
  },
  deleteButton: {
    height: "1.875rem",
    width: "1.875rem",
    minWidth: "1.875rem",
    padding: 0,
    marginLeft: "1rem",
    background: "white",
    "&:hover, &:hover:disabled": {
      background: "white",
    },
  },
};
