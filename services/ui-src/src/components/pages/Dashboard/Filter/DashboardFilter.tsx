import React, { useState } from "react";
import { useSearchParams } from "react-router";

import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import { Label } from "@cmsgov/design-system";
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
        <Box>
          <Label htmlFor="yearFilter" id="yearFilter-label">
            Filter by Year
          </Label>
          <select
            name="yearFilter"
            id="yearFilter"
            value={yearDropdownValue}
            onChange={handleYearChange}
            data-testid="year-filter-dropdown"
            aria-invalid="false"
            className="ds-c-field"
          >
            {filterYearOptions.map((option) => (
              <option
                key={`year-filter-dropdown-${option.value}`}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </Box>
      </GridItem>
      <GridItem>
        <Box>
          <Label htmlFor="quarterFilter" id="quarterFilter-label">
            Filter by Quarter
          </Label>
          <select
            name="quarterFilter"
            id="quarterFilter"
            value={quarterDropdownValue}
            onChange={handleQuarterChange}
            data-testid="quarter-filter-dropdown"
            aria-invalid="false"
            className="ds-c-field"
          >
            {filterQuarterOptions.map((option) => (
              <option
                key={`quarter-filter-dropdown-${option.value}`}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </Box>
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
