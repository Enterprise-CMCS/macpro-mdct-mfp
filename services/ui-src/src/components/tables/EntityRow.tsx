import { useMemo, useId } from "react";
// components
import { Box, Button, Image, Td, Tr, Text } from "@chakra-ui/react";
import { EntityStatusIcon, Table } from "components";
// types
import {
  AnyObject,
  EntityShape,
  EntityStatuses,
  ModalDrawerEntityTypes,
  OverlayModalTypes,
  EntityDetailsOverlayTypes,
  EntityDetailsOverlayShape,
  OverlayModalPageShape,
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
  const isSAR = report?.reportType === ReportType.SAR;

  const setStatusByType = (entityType: string) => {
    switch (entityType) {
      case OverlayModalTypes.INITIATIVE:
        //the entityType for initiative is being shared for both the parent and the child status to differentiate, check if formEntity is filled
        if (
          formEntity &&
          stepType !== EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION
        ) {
          return getInitiativeDashboardStatus(formEntity, entity);
        } else if (
          stepType === EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION
        ) {
          if (isInitiativeClosed) {
            return EntityStatuses.CLOSE;
          } else {
            const isCloseOutEnabled = getInitiativeStatus(
              report!,
              entity,
              false,
              [stepType]
            );
            return isCloseOutEnabled && isCopied
              ? EntityStatuses.NO_STATUS
              : EntityStatuses.DISABLED;
          }
        } else {
          return getInitiativeStatus(report!, entity, false, [
            EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION,
          ]);
        }
      default: {
        return report && getEntityStatus(report, entity, entityType);
      }
    }
  };

  let entityStatus = useMemo(() => {
    if (
      OverlayModalTypes.INITIATIVE &&
      formEntity &&
      isInitiativeClosed &&
      report?.reportType === ReportType.WP
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
        return !isRequired && `Other: `;
      case OverlayModalTypes.INITIATIVE:
        return isInitiativeClosed && !formEntity && "[Closed] ";
      default:
        return "";
    }
  };

  return (
    <Tr sx={sx.content}>
      <Td
        pt={isMobile ? "1.5rem" : "0.5rem"}
        verticalAlign={isMobile ? "baseline" : "middle"}
      >
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
                    [entity.closeOutInformation_actualEndDate, closedBy],
                  ],
                }}
                variant="none"
                sxOverride={sx.table}
              ></Table>
            )}
          </Box>
          <Box
            sx={sx.actionContainer}
            pt={isMobile ? "1rem" : "0"}
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            display={"inline-block"}
          >
            {!isRequired && !isCopied && openAddEditEntityModal && (
              <Button
                sx={sx.editNameButton}
                id={editNameButtonId}
                variant="none"
                onClick={() => openAddEditEntityModal(entity)}
                aria-labelledby={`${editNameButtonId} ${rowId}`}
                pl={isMobile ? "0" : "1rem"}
                pr={isMobile ? "1.5rem" : "2.5rem"}
              >
                {!editable || (!isSAR && isInitiativeClosed)
                  ? verbiage.readOnlyEntityButtonText
                  : verbiage.editEntityButtonText}
              </Button>
            )}
            <Button
              sx={
                !isRequired && !isCopied
                  ? sx.editOtherEntityButton
                  : sx.editEntityButton
              }
              id={editButtonId}
              onClick={() => openOverlayOrDrawer(entity)}
              variant="outline"
              disabled={entityStatus === EntityStatuses.DISABLED}
              aria-labelledby={`${editButtonId} ${rowId}`}
            >
              {!editable || (!isSAR && isInitiativeClosed)
                ? verbiage.readOnlyEntityDetailsButtonText
                : verbiage.enterEntityDetailsButtonText}
            </Button>
            {!isRequired && !isCopied && openDeleteEntityModal && (
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
          </Box>
        </Box>
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
  content: {
    td: {
      borderColor: "gray_light",
      paddingRight: 0,
    },
  },
  errorText: {
    color: "error_dark",
    fontSize: "0.75rem",
    marginBottom: "spacer1",
  },
  entityName: {
    maxWidth: "18.75rem",
    ul: {
      margin: "0.3rem auto",
      padding: 0,
      listStyleType: "none",
      lineHeight: "1.3rem",
      ".mobile &": {
        margin: "auto",
      },
      li: {
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        "&:first-of-type": {
          fontWeight: "bold",
          fontSize: "md",
          marginBottom: "0rem",
        },
      },
    },
    ".mobile &": {
      paddingY: "spacer3",
    },
  },
  actionContainer: {
    paddingLeft: "spacer3",
    alignItems: "center",
    display: "flex",
    ".mobile &": {
      paddingLeft: 0,
    },
  },
  editNameButton: {
    fontWeight: "normal",
    textDecoration: "underline",
    color: "primary",
  },
  editEntityButton: {
    padding: 0,
    fontWeight: "bold",
    width: "5rem",
    marginRight: "2.875rem",
  },
  editOtherEntityButton: {
    padding: 0,
    fontWeight: "bold",
    minWidth: "5rem",
  },
  deleteButton: {
    height: "1.5rem",
    minHeight: "1.5rem",
    width: "1.5rem",
    minWidth: "1.5rem",
    padding: 0,
    marginLeft: "spacer2",
    marginRight: "0.4rem",
    marginBottom: "spacer_half",
    background: "white",
    "&:hover, &:hover:disabled, :disabled": {
      background: "white",
    },
  },
  table: {
    td: {
      paddingTop: "0rem",
      paddingLeft: "0rem",
    },
    th: {
      paddingLeft: "0rem",
      border: "none",
      fontWeight: "bold",
      color: "gray",
      width: "2rem",
    },
  },
};
