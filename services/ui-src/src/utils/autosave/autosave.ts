import { FieldValues, UseFormReturn } from "react-hook-form";
import { AutosaveField, EntityShape, ReportShape, ReportStatus } from "types";
import { useStore } from "utils/state/useStore";

type FieldValue = any;

type FieldDataTuple = [string, FieldValue];

export interface FieldInfo {
  name: string;
  type: string;
  value?: FieldValue;
  defaultValue?: any;
  hydrationValue?: FieldValue;
  overrideCheck?: boolean;
}

interface Props {
  form: UseFormReturn<FieldValues, any>;
  fields: FieldInfo[];
  report: {
    id: string | undefined;
    reportType: string | undefined;
    updateReport: Function;
  };
  user: {
    userName: string | undefined;
    state: string | undefined;
  };
  entityContext?: EntityContextShape;
}

export interface GetAutosaveFieldsProps extends AutosaveField {
  entityContext?: EntityContextShape;
}

/**
 * Current context for editing entities.
 *
 * This is a mirror of the EntityContext from EntityProvider,
 * used to allow non-components to access the Context values.
 */
export interface EntityContextShape {
  selectedEntity?: EntityShape;
  prepareEntityPayload: Function;
}

/**
 * Get formatted autosave fields from field data.
 * If entity context is passed, update the selected entity
 * within the total array of entities, and use that
 * full data to update the report.
 *
 * @param GetAutosaveFieldsProps
 * @returns
 */
export const getAutosaveFields = ({
  name,
  type,
  value,
  defaultValue,
  hydrationValue,
  overrideCheck,
}: GetAutosaveFieldsProps): FieldInfo[] => {
  return [
    {
      name,
      type,
      value,
      defaultValue,
      hydrationValue,
      overrideCheck,
    },
  ];
};

export const autosaveFieldData = async ({
  form,
  fields,
  report,
  user,
  entityContext,
}: Props) => {
  const { id, reportType, updateReport } = report;
  const { userName, state } = user;
  // for each passed field, format for autosave payload (if changed)
  const fieldsToSave: FieldDataTuple[] = await Promise.all(
    fields
      // filter to only changed fields
      .filter((field: FieldInfo) => isFieldChanged(field))
      // determine appropriate field value to set and return as tuple
      .map(async (field: FieldInfo) => {
        const { name, value, defaultValue, hydrationValue, overrideCheck } =
          field;
        let fieldValueIsValid = false;
        /*
         * This will trigger validation if and only if the field has been rendered on the page
         * at least once and therefore has sent a value (empty or otherwise) to the db.
         */
        if (value !== hydrationValue && hydrationValue !== undefined) {
          fieldValueIsValid = await form.trigger(name);
        } else {
          fieldValueIsValid = true;
        }
        // if field value is valid or validity check overridden, use field value
        if (fieldValueIsValid || overrideCheck) return [name, value];
        // otherwise, revert field to default value
        return [name, defaultValue];
      })
  );

  // if there are fields to save, create and send payload
  if (fieldsToSave.length > 0) {
    const reportKeys = { reportType, id, state };
    let dataToWrite = {};
    if (entityContext && entityContext.selectedEntity) {
      dataToWrite = {
        metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
        fieldData: {
          [entityContext.selectedEntity.type]:
            entityContext.prepareEntityPayload(
              Object.fromEntries(fieldsToSave)
            ),
        }, // create field data object
      };
    } else {
      dataToWrite = {
        metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
        fieldData: Object.fromEntries(fieldsToSave), // create field data object
      };
    }

    await updateReport(reportKeys, dataToWrite);
  }
};

export const isFieldChanged = (field: FieldInfo) => {
  const { value, hydrationValue } = field;
  return value !== hydrationValue;
};

/*
 * Field autosaves and explicit saves (such as the "Save & return" button)
 * each PUT the full entity array, and the last write wins. A save that
 * overlaps another can silently erase its changes. To prevent that,
 * every autosave is registered here and explicit saves wait for all
 * of them to finish.
 */
const inFlightAutosaves = new Set<Promise<void>>();

const updateSavingIndicator = () => {
  useStore.getState?.()?.setAutosaveState(inFlightAutosaves.size > 0);
};

// Registers an autosave as in-flight until it settles.
export const trackAutosave = async (autosave: Promise<void>): Promise<void> => {
  inFlightAutosaves.add(autosave);
  updateSavingIndicator();
  try {
    await autosave;
  } finally {
    inFlightAutosaves.delete(autosave);
    updateSavingIndicator();
  }
};

// Waits until no autosaves are in flight (new ones may start mid-wait).
export const waitForAutosaves = async (): Promise<void> => {
  while (inFlightAutosaves.size > 0) {
    await Promise.allSettled(inFlightAutosaves);
  }
};

// Waits for in-flight autosaves, then returns the store's newest report
export const waitForAutosavesAndGetReport = async (
  fallbackReport: ReportShape
): Promise<ReportShape> => {
  await waitForAutosaves();
  return useStore.getState?.()?.report ?? fallbackReport;
};
