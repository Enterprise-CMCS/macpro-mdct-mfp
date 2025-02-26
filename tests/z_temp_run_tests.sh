#!/bin/bash

tests=(
    "authenticate as admin"
    "authenticate as user"
    "Admin is accessible on all device types for admin user"
    "Help is accessible on all device types for state user"
    "Help is accessible on all device types for admin user"
    "Should see the correct home page as a state user"
    "Home is accessible on all device types for state user"
    "Should see the correct home page as an admin user"
    "Home is accessible on all device types for admin user"
    "Is assessible when not logged in"
    "Admin user can navigate to /admin"
    "Profile is accessible on all device types for admin user"
    "State user cannot navigate to /admin"
    "Profile is accessible on all device types for state user"
    "State user can create a SAR"
    "Admin user can approve a Work Plan submission"
    "State user can create a Work Plan"
    "State user can fill and submit a Work Plan"
    "Admin user can deny a work plan"
    "State user can resubmit a work plan"
)

if [[ "$1" == "list" ]]; then
    for i in "${!tests[@]}"; do
        printf "%d) %s\n" "$((i + 1))" "${tests[i]}"
    done
    exit 0
fi

if [[ -n "$1" ]]; then

    if ! [[ "$1" =~ ^[0-9]+$ ]]; then
        echo "Error: Please enter a valid test number."
        exit 1
    fi

    index=$(($1 - 1))

    if [[ $index -ge 0 && $index -lt ${#tests[@]} ]]; then
        echo "Running test #$1: \"${tests[$index]}\""
        npx playwright test -g "${tests[$index]}"
    else
        echo "Error: Test number out of range. Use './run_tests.sh list' to see available tests."
        exit 1
    fi
else
    for i in "${!tests[@]}"; do
        echo "============================================================"
        echo "Running test #$((i + 1)): \"${tests[i]}\""
        npx playwright test -g "${tests[i]}"
        echo ""
    done
fi
