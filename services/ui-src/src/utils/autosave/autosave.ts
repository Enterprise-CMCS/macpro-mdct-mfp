import { AutosaveField, EntityShape, ReportShape } from "types";
import { putReport } from "utils/api/requestMethods/report";
import { useStore } from "utils/state/useStore";

type FieldValue = any;

export interface FieldInfo {
  name: string;
  type: string;
  value?: any;
  defaultValue?: any;
  hydrationValue?: FieldValue;
  overrideCheck?: boolean;
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

export const isFieldChanged = (field: FieldInfo) => {
  const { value, hydrationValue } = field;
  return value !== hydrationValue;
};

/*
 * Field autosaves and explicit saves (such as the "Save & return" button)
 * each PUT the full entity array, and the last write wins. Running two
 * writes concurrently lets one silently erase the other's changes.
 *
 * To prevent that, every write is serialized through this queue. Each write
 * is passed as a thunk and is not invoked until it reaches the front of the
 * queue, so it always builds its payload from the result of the write before
 * it. Explicit saves simply wait for the queue to drain.
 */
let writeQueue: Promise<unknown> = Promise.resolve();
let pendingWrites = 0;

const updateSavingIndicator = (isAutosaving: boolean) => {
  useStore.getState?.()?.setAutosaveState(isAutosaving);
};

/*
 * Serializes a write behind any in-flight writes. Because `work` is a thunk
 * invoked only when it reaches the front of the queue, it can read the newest
 * store state when building its payload. Returns the write's own result so the
 * caller can await it; queue progression is unaffected by its rejection.
 */
export const enqueueWrite = <T>(work: () => Promise<T>): Promise<T> => {
  pendingWrites++;
  updateSavingIndicator(true);
  const run = writeQueue.then(work, work);
  writeQueue = run
    .catch(() => {})
    .finally(() => {
      pendingWrites--;
      updateSavingIndicator(pendingWrites > 0);
    });
  return run;
};

// Waits for the queue to fully drain, including writes enqueued mid-wait.
export const waitForAutosaves = async (): Promise<void> => {
  let current;
  do {
    current = writeQueue;
    await current;
  } while (current !== writeQueue);
};

// Waits for in-flight writes, then returns the store's newest report
export const waitForAutosavesAndGetReport = async (
  fallbackReport: ReportShape,
): Promise<ReportShape> => {
  await waitForAutosaves();
  return useStore.getState?.()?.report ?? fallbackReport;
};

const convertToObject = (fields: FieldInfo[]) => {
  return fields.reduce(
    (acc: any, curr) => ((acc[curr.name] = curr.value ?? undefined), acc),
    {},
  );
};

export const shinyNewSave = async (
  report: ReportShape,
  selectedEntity: EntityShape | undefined,
  fields: FieldInfo[],
) => {
  const newReport = structuredClone(report);
  const { fieldData } = newReport;

  const updateData = (items: any, fieldId: string, newValue: any) => {
    Object.entries(items).map((item) => {
      if (item[0] === fieldId) {
        items[item[0] as any] = newValue;
      } else {
        if (typeof item[1] == "object" && item[1]) {
          //TO DO: Refactor when nested pages are less wild, this can be more decoupled
          if ("id" in item[1] && item[1].id === selectedEntity?.id) {
            items[item[0]] = { ...item[1], ...convertToObject(fields) };
          } else {
            updateData(item[1], fieldId, newValue);
          }
        }
      }
    });
  };

  for (const field of fields) {
    updateData(fieldData, field.name, field.value);
  }

  const reportKeys = {
    reportType: report.reportType,
    id: report.id,
    state: report.state,
  };

  const newData = {
    metadata: {
      status: report.status,
      lastAlteredBy: report.lastAltered, //get the username
    },
    fieldData: newReport.fieldData,
  };

  (await putReport(reportKeys, newData)) as ReportShape;
  return newReport;
};
