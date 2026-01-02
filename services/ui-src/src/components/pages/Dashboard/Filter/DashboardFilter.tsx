import React, { useState } from "react";
import { useSearchParams } from "react-router";
// components
import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import { Label } from "@cmsgov/design-system";
// utils
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

  const handleClear = () => {
    setYearDropdownValue("All");
    setQuarterDropdownValue("All");
    setSearchParams({});
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
      <GridItem sx={sx.filterActions}>
        <Button onClick={handleFilter} variant="outline">
          Filter
        </Button>

        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
      </GridItem>
    </Grid>
  );
};

const sx = {
  filterContainer: {
    margin: "0 0 2rem 0",
    alignItems: "flex-end",
    gap: "spacer4",

    ".mobile &": {
      gridTemplateColumns: "1fr",
      div: {
        gridColumn: "span 2",
      },
    },
    ".tablet &": {
      gridTemplateColumns: "1fr 1fr",
    },
    gridTemplateColumns: "12em 12rem 1fr",

    ".ds-c-label": {
      marginBlock: 0,
    },
  },

  filterActions: {
    ".mobile &, .tablet &": {
      gridColumn: "span 2",
      textAlign: "center",
    },

    "button:first-of-type": {
      marginRight: "spacer4",
    },
  },
};
