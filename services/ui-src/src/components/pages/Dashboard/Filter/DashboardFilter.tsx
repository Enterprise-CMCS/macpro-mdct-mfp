import React, { useState } from "react";
import { useSearchParams } from "react-router";

import { Button, Grid, GridItem } from "@chakra-ui/react";
import { Dropdown } from "@cmsgov/design-system";
import {
  filterQuarterOptions,
  filterYearOptions,
} from "./dashboardFilterLogic";

export const DashboardFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [yearDropdownValue, setYearDropdownValue] = useState(
    searchParams.get("year") || "All"
  );
  const [quarterDropdownValue, setQuarterDropdownValue] = useState(
    searchParams.get("quarter") || "All"
  );

  const handleYearChange = (evt: { target: { value: string } }) => {
    setYearDropdownValue(evt.target.value);
  };

  const handleQuarterChange = (evt: { target: { value: string } }) => {
    setQuarterDropdownValue(evt.target.value);
  };

  const handleFilter = () => {
    setSearchParams({
      year: yearDropdownValue,
      quarter: quarterDropdownValue,
    });
  };

  return (
    <Grid sx={sx.filterContainer}>
      <GridItem>
        {/* @ts-expect-error - Dropdown type incompatibility with React version */}
        <Dropdown
          name="yearFilter"
          label="Filter by Year"
          value={yearDropdownValue}
          onChange={handleYearChange}
          data-testid="year-filter-dropdown"
          options={filterYearOptions}
        />
      </GridItem>
      <GridItem>
        {/* @ts-expect-error - Dropdown type incompatibility with React version */}
        <Dropdown
          name="quarterFilter"
          label="Filter by Quarter"
          value={quarterDropdownValue}
          onChange={handleQuarterChange}
          data-testid="quarter-filter-dropdown"
          options={filterQuarterOptions}
        />
      </GridItem>
      <GridItem>
        <Button
          data-testid="dash-filter-button"
          onClick={handleFilter}
          variant="outline"
        >
          Filter
        </Button>
      </GridItem>
    </Grid>
  );
};

const sx = {
  filterContainer: {
    margin: "0 0 1.5rem 0",
    alignItems: "flex-end",
    gap: "spacer3",

    gridTemplateColumns: "9.5rem 9.5rem auto",
    ".mobile &": {
      gridTemplateColumns: "auto",
    },

    ".ds-c-dropdown__label": {
      marginBlock: 0,
    },
  },
};
