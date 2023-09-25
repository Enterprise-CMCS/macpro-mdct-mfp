import { MouseEventHandler, useContext, useEffect } from "react";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { ReportPageIntro, Table, EntityRow } from "components";
// types
import {
  EntityShape,
  EntityType,
  FormJson,
  EntityDetailsDashboardOverlayShape,
} from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
import { EntityContext } from "components/reports/EntityProvider";

export const EntityDetailsDashboardOverlay = ({
  closeEntityDetailsOverlay,
  entityType,
  dashboard,
  selectedEntity,
}: Props) => {
  // Entity Provider Setup
  const { setSelectedEntity, setEntityType } = useContext(EntityContext);

  useEffect(() => {
    setSelectedEntity(selectedEntity);
    setEntityType(entityType);
    return () => {
      setSelectedEntity(undefined);
    };
  }, [entityType, selectedEntity]);

  // Open/Close overlay action methods
  const openEntityDetailsOverlay = (entity: EntityShape) => {
    // console.log("test", entity);
  };

  const tableHeaders = () => {
    return { headRow: ["", "", ""] };
  };

  return (
    <Box>
      <Button
        sx={sx.backButton}
        variant="none"
        onClick={closeEntityDetailsOverlay as MouseEventHandler}
        aria-label="Return to all initiatives"
      >
        <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
        Return to all initiatives
      </Button>
      <ReportPageIntro text={dashboard?.verbiage?.intro} />
      <Table content={tableHeaders()}>
        {dashboard?.fields.map((entity: EntityShape) => (
          <EntityRow
            key={entity.id}
            entity={entity}
            // entityInfo={entityInfo}
            verbiage={entity.verbiage}
            locked={false}
            openDrawer={openEntityDetailsOverlay}
            openAddEditEntityModal={() => {
              return;
            }}
            openDeleteEntityModal={() => {
              return;
            }}
          />
        ))}
      </Table>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button
            variant="outline"
            onClick={closeEntityDetailsOverlay as MouseEventHandler}
          >
            Return
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  closeEntityDetailsOverlay?: Function;
  entityType?: EntityType;
  dashboard?: FormJson;
  selectedEntity?: EntityShape;
  onSubmit?: Function;
  submitting?: boolean;
  validateOnRender?: boolean;
  route?: EntityDetailsDashboardOverlayShape;
}

const sx = {
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
  },
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
  textHeading: {
    fontWeight: "bold",
    lineHeight: "1.25rem",
  },
  programInfo: {
    ul: {
      margin: "0.5rem auto 0 auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        fontSize: "xl",
        lineHeight: "1.75rem",
        "&:first-child": {
          fontWeight: "bold",
        },
      },
    },
  },
};
