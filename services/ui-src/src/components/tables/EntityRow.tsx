// components
import { Box, Button, Image, Td, Tr, Text } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
import { getEntityStatus } from "./getEntityStatus";
// types
import { AnyObject, EntityShape } from "types";
// utils
import { renderHtml, useStore } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import { useMemo } from "react";

export const EntityRow = ({
  entity,
  entityInfo,
  verbiage,
  locked,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openDrawer,
}: Props) => {
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  // check for "other" target population entities
  const { isRequired } = entity;

  const entityComplete = useMemo(() => {
    return report ? getEntityStatus(report, entity) : false;
  }, [report]);

  let programInfo = [];
  if (entityInfo) {
    programInfo = (entityInfo as string[]).flatMap((info) => {
      //if the data is in an array, like a radio button values, get each as text
      if (typeof entity[info] === "object") {
        return (entity[info] as any[]).map((arr) => arr.value);
      }
      return entity[info];
    });
  }

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        <EntityStatusIcon entity={entity as EntityShape} />
      </Td>
      <Td sx={sx.entityName}>
        <ul>
          {programInfo.map((field, index) => (
            <li key={index}>{renderHtml(field)}</li>
          ))}
        </ul>
        {!entityComplete && (
          <Text sx={sx.errorText}>
            Select "{verbiage.enterEntityDetailsButtonText}” to complete this
            report.
          </Text>
        )}
      </Td>
      <Td>
        <Box sx={sx.actionContainer}>
          {!isRequired && (
            <Button
              sx={sx.editNameButton}
              variant="none"
              onClick={() => openAddEditEntityModal(entity)}
            >
              {verbiage.editEntityButtonText}
            </Button>
          )}
          <Button
            sx={!isRequired ? sx.editOtherEntityButton : sx.editEntityButton}
            onClick={() => openDrawer(entity)}
            variant="outline"
          >
            {verbiage.enterEntityDetailsButtonText}
          </Button>
          {!isRequired && (
            <Button
              sx={sx.deleteButton}
              data-testid="delete-entity"
              onClick={() => openDeleteEntityModal(entity)}
              disabled={locked || !userIsEndUser}
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
    ul: {
      margin: "0.5rem auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
        whiteSpace: "break-spaces",
        "&:first-of-type": {
          fontWeight: "bold",
          fontSize: "md",
        },
      },
    },
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
