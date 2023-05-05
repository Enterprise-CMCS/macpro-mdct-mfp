import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";
// types

export const create = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  return { status: StatusCodes.CREATED, body: { foo: "bar" } };
});
