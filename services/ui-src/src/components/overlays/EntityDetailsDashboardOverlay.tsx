import React, {
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
import { ReportPageIntro, Table, EntityRow } from "components";
// types
import { EntityShape, EntityType, FormJson } from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// verbiage
import overlayVerbiage from "../../verbiage/pages/overlays";
import { EntityContext } from "components/reports/EntityProvider";

export const EntityDetailsDashboardOverlay = ({
  closeEntityDetailsOverlay,
  entityType,
  entities,
  form,
  selectedEntity,
  disabled,
  submitting,
}: Props) => {
  // Entity Provider Setup
  const { setEntities, setSelectedEntity, setEntityType } =
    useContext(EntityContext);

  useEffect(() => {
    setSelectedEntity(selectedEntity);
    setEntityType(entityType);
    setEntities(entities);
    return () => {
      setEntities([]);
      setSelectedEntity(undefined);
    };
  }, [entityType, selectedEntity]);

  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>(true);

  const tableHeaders = () => {
    return { headRow: ["", ""] };
  };
  const openDeleteEntityModal = (entity: EntityShape) => {
    setCurrentEntity(entity);
    // deleteEntityModalOnOpenHandler();
  };
  const openEntityDetailsOverlay = (entity: EntityShape) => {
    setCurrentEntity(entity);
    setIsEntityDetailsOpen(true);
    // setSidebarHidden(true);
  };
  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setCurrentEntity(entity);
    // addEditEntityModalOnOpenHandler();
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
      <ReportPageIntro text={overlayVerbiage.WP.intro} />
      {isEntityDetailsOpen && currentEntity && <div>hi</div>}
      <Table content={tableHeaders()}>
        {form.fields.map((entity: EntityShape) => (
          <EntityRow
            key={entity.id}
            entity={entity}
            verbiage={entity.verbiage}
            locked={false}
            openDrawer={openEntityDetailsOverlay}
            openAddEditEntityModal={openAddEditEntityModal}
            openDeleteEntityModal={openDeleteEntityModal}
          />
        ))}
      </Table>
      <Box>
        <Flex sx={sx.buttonFlex}>
          {disabled ? (
            <Button
              variant="outline"
              onClick={closeEntityDetailsOverlay as MouseEventHandler}
            >
              Return
            </Button>
          ) : (
            <Button type="submit" form={form.id} sx={sx.saveButton}>
              {submitting ? <Spinner size="md" /> : "Save & return"}
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  closeEntityDetailsOverlay: Function;
  entityType: EntityType;
  entities: any;
  form: FormJson;
  onSubmit: Function;
  selectedEntity: EntityShape;
  disabled: boolean;
  submitting?: boolean;
  validateOnRender?: boolean;
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
