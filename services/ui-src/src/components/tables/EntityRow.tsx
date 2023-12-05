import { useMemo } from "react";
// components
import { Box, Button, Image, Td, Tr, Text } from "@chakra-ui/react";
import { EntityStatusIcon, EntityStatuses } from "components";
// types
import {
  AnyObject,
  EntityShape,
  ModalDrawerEntityTypes,
  ReportShape,
  OverlayModalTypes,
  ReportStatus,
  EntityDetailsOverlayTypes,
} from "types";
// utils
import { useStore } from "utils";
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
  locked,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openOverlayOrDrawer,
}: Props) => {
  const { userIsEndUser } = useStore().user ?? {};
  const { report } = useStore();

  // check for "other" target population entities
  const { isRequired, isCopied } = entity;
  const stepType = (formEntity as AnyObject)?.stepType;
  const closed = entity?.isInitiativeClosed;

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
          if (closed) {
            return EntityStatuses.CLOSE;
          } else {
            const isCloseOutEnabled = getInitiativeStatus(report!, entity, [
              stepType,
            ]);
            return isCloseOutEnabled && isCopied
              ? EntityStatuses.NO_STATUS
              : EntityStatuses.DISABLED;
          }
        } else {
          return getInitiativeStatus(report!, entity, [
            EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION,
          ]);
        }
      default: {
        return report ? !!getEntityStatus(report, entity, entityType) : false;
      }
    }
  };

  let entityStatus = useMemo(() => {
    if (OverlayModalTypes.INITIATIVE && formEntity && closed) {
      return stepType === EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION
        ? EntityStatuses.CLOSE
        : EntityStatuses.NO_STATUS;
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
        return closed && !formEntity && "[Closed] ";
      default:
        return "";
    }
  };

  return (
    <Tr sx={sx.content}>
      <Td>
        <EntityStatusIcon entityStatus={entityStatus} />
      </Td>
      <Td sx={sx.entityName}>
        <ul>
          {programInfo.map((field, index) => (
            <li key={index}>
              {index === 0 && appendToEntityName()}
              {field}
            </li>
          ))}
        </ul>
        {!entityStatus && (
          <Text sx={sx.errorText}>
            {verbiage.editEntityHint ??
              `Select ${verbiage.enterEntityDetailsButtonText} to report data`}
          </Text>
        )}
      </Td>
      <Td>
        <Box sx={sx.actionContainer}>
          {!isRequired && !isCopied && (
            <Button
              sx={sx.editNameButton}
              variant="none"
              onClick={() => openAddEditEntityModal(entity)}
            >
              {report?.status === ReportStatus.SUBMITTED ||
              report?.status === ReportStatus.APPROVED ||
              closed
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
            onClick={() => openOverlayOrDrawer(entity)}
            variant="outline"
            disabled={entityStatus === EntityStatuses.DISABLED}
          >
            {report?.status === ReportStatus.SUBMITTED ||
            report?.status === ReportStatus.APPROVED ||
            closed
              ? verbiage.readOnlyEntityDetailsButtonText
              : verbiage.enterEntityDetailsButtonText}
          </Button>
          {!isRequired && !isCopied && (
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
  entityType?: string;
  formEntity?: ReportShape;
  verbiage: AnyObject;
  openAddEditEntityModal: Function;
  openDeleteEntityModal: Function;
  openOverlayOrDrawer: Function;
  [key: string]: any;
}

const sx = {
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    td: {
      borderColor: "palette.gray_lighter",
      paddingRight: 0,
    },
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
          marginBottom: "0.25rem",
        },
      },
    },
  },
  actionContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "end",
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
    width: "5rem",
    marginRight: "2.875rem",
  },
  editOtherEntityButton: {
    padding: 0,
    fontWeight: "bold",
    minWidth: "5rem",
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
