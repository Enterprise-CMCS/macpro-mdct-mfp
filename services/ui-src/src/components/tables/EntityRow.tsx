import { useMemo, useId } from "react";
// components
import { Box, Button, Image, Td, Tr, Text, HStack } from "@chakra-ui/react";
import { EntityStatusIcon, Table } from "components";
// types
import {
  AnyObject,
  EntityDetailsOverlayShape,
  EntityDetailsOverlayTypes,
  EntityShape,
  EntityStatuses,
  ModalDrawerEntityTypes,
  OverlayModalPageShape,
  OverlayModalTypes,
  ReportType,
} from "types";
// utils
import { useStore, useBreakpoint } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import {
  getEntityStatus,
  getInitiativeStatus,
  getInitiativeDashboardStatus,
} from "./getEntityStatus";

export const EntityRow = ({
  entity,
  entityInfo,
  entityType,
  formEntity,
  verbiage,
  showEntityCloseoutDetails,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openOverlayOrDrawer,
}: Props) => {
  const rowId = useId();
  const editNameButtonId = useId();
  const editButtonId = useId();
  const deleteButtonId = useId();
  const { report, editable } = useStore();
  const { isMobile } = useBreakpoint();

  // check for "other" target population entities
  const { isRequired, isCopied, isInitiativeClosed, closedBy } = entity;
  const stepType = formEntity?.stepType;
  const isWP = report?.reportType === ReportType.WP;
  const isNewAndOptional = !isCopied && !isRequired;
  const viewOnly = !editable || (isInitiativeClosed && isWP);

  const setStatusByType = (entityType: string) => {
    switch (entityType) {
      case OverlayModalTypes.INITIATIVE:
        if (stepType === EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION) {
          const isCloseOutEnabled = getInitiativeStatus(
            report!,
            entity,
            false,
            [stepType]
          );
          return isCloseOutEnabled && isCopied
            ? EntityStatuses.NO_STATUS
            : EntityStatuses.DISABLED;
        } else if (stepType) {
          /**
           * the entityType for initiative is being shared for
           * both the parent and the child status to differentiate,
           * check if formEntity is filled
           */
          return getInitiativeDashboardStatus(formEntity, entity);
        }

        return getInitiativeStatus(report!, entity, false, [
          EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION,
        ]);
      default:
        return getEntityStatus(report!, entity, entityType);
    }
  };

  const entityStatus = useMemo(() => {
    if (
      entityType === OverlayModalTypes.INITIATIVE &&
      formEntity &&
      isInitiativeClosed &&
      isWP
    ) {
      return EntityStatuses.CLOSE;
    }

    return setStatusByType(entityType!);
  }, [report, entity]);

  let programInfo = [];
  if (entityInfo) {
    programInfo = (entityInfo as string[]).flatMap((info) => {
      //if the data is in an array, like a radio button values, get each as text
      if (typeof entity?.[info] === "object") {
        return (entity[info] as AnyObject[]).map((arr) => {
          if (
            entity?.initiative_wp_otherTopic &&
            arr.value === "Other, specify"
          ) {
            return entity.initiative_wp_otherTopic;
          }
          return arr.value;
        });
      }
      return entity[info];
    });
  }

  const appendToEntityName = () => {
    switch (entityType) {
      case ModalDrawerEntityTypes.TARGET_POPULATIONS:
        return !isRequired ? "Other: " : "";
      case OverlayModalTypes.INITIATIVE:
        return isInitiativeClosed && !formEntity ? "[Closed] " : "";
      default:
        return "";
    }
  };

  return (
    <Tr>
      <Td>
        <EntityStatusIcon entityStatus={entityStatus} />
      </Td>
      <Td sx={sx.entityName}>
        <Box
          display={"flex"}
          flexDirection={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          minHeight={"3.5rem"}
        >
          <Box display={"inline-block"} marginY={"auto"}>
            <ul>
              {programInfo.map((field, index) => (
                <li key={index} id={index === 0 ? rowId : undefined}>
                  {index === 0 && appendToEntityName()}
                  {field}
                </li>
              ))}
            </ul>
            {entityStatus === EntityStatuses.INCOMPLETE && (
              <Text sx={sx.errorText}>
                {verbiage.editEntityHint ??
                  `Select "${verbiage.enterEntityDetailsButtonText}" to report data.`}
              </Text>
            )}
            {isInitiativeClosed && showEntityCloseoutDetails && (
              <Table
                content={{
                  headRow: ["Actual end date", "Closed by"],
                  bodyRows: [
                    [
                      entity.closeOutInformation_actualEndDate ??
                        "No response (Optional)",
                      closedBy,
                    ],
                  ],
                }}
                variant="none"
              ></Table>
            )}
          </Box>
        </Box>
      </Td>
      <Td>
        <HStack gap="1rem">
          {isNewAndOptional && openAddEditEntityModal && (
            <Button
              sx={sx.editNameButton}
              id={editNameButtonId}
              variant="none"
              onClick={() => openAddEditEntityModal(entity)}
              aria-labelledby={`${editNameButtonId} ${rowId}`}
            >
              {viewOnly
                ? verbiage.readOnlyEntityButtonText
                : verbiage.editEntityButtonText}
            </Button>
          )}
          <Button
            sx={
              isNewAndOptional ? sx.editOtherEntityButton : sx.editEntityButton
            }
            id={editButtonId}
            onClick={() => openOverlayOrDrawer(entity)}
            variant="outline"
            disabled={entityStatus === EntityStatuses.DISABLED}
            aria-labelledby={`${editButtonId} ${rowId}`}
            className="editAction"
          >
            {viewOnly
              ? verbiage.readOnlyEntityDetailsButtonText
              : verbiage.enterEntityDetailsButtonText}
          </Button>
          {isNewAndOptional && openDeleteEntityModal && (
            <Button
              sx={sx.deleteButton}
              id={deleteButtonId}
              data-testid="delete-entity"
              onClick={() => openDeleteEntityModal(entity)}
              aria-labelledby={`${deleteButtonId} ${rowId}`}
            >
              <Image src={deleteIcon} alt="Delete" boxSize="3x3" />
            </Button>
          )}
        </HStack>
      </Td>
    </Tr>
  );
};

interface Props {
  entity: EntityShape;
  entityType?: string;
  formEntity?: EntityDetailsOverlayShape | OverlayModalPageShape;
  verbiage: AnyObject;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openOverlayOrDrawer: Function;
  [key: string]: any;
}

const sx = {
  errorText: {
    color: "error_dark",
    fontSize: "body_xs",
    marginBottom: "spacer1",
  },
  entityName: {
    maxWidth: "18.75rem",
    ul: {
      margin: "0.3rem auto",
      padding: 0,
      listStyleType: "none",
      lineHeight: "body_md",
      ".mobile &": {
        margin: "auto",
      },
      li: {
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        "&:first-of-type": {
          fontWeight: "heading_md",
          fontSize: "body_md",
          marginBottom: "0rem",
        },
      },
    },
    ".mobile &": {
      paddingY: "spacer3",
    },
  },
  editNameButton: {
    fontWeight: "body_md",
    textDecoration: "underline",
    color: "primary",
    padding: "0",
  },
  editEntityButton: {
    padding: 0,
    fontWeight: "heading_md",
    width: "5rem",
  },
  editOtherEntityButton: {
    padding: 0,
    fontWeight: "heading_md",
    minWidth: "5rem",
  },
  deleteButton: {
    height: "1.5rem",
    minHeight: "1.5rem",
    width: "1.5rem",
    minWidth: "1.5rem",
    padding: 0,
    background: "white",
    "&:hover, &:hover:disabled, :disabled": {
      background: "white",
    },
  },
};
