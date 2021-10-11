export const getUniqueErrorMessage = (field: string) => {
  return `already exists a user with this ${field}`;
};

export const getNotEmptyErrorMessage = (field: string) => {
  return `${field} can not be empty`;
};

export const getNotFoundErrorMessage = (entity: string) => {
  return `${entity} not found`;
};

export const getOnlyAdminErrorMessage = (verb: string, field: string) => {
  return `only admin can ${verb} ${field}`;
};

export const getForbiddenErrorMessage = (verb: string, entity: string) => {
  return `can not ${verb} this ${entity}`;
};

export const getNullValueErrorMessage = () => {
  return `null values are not allowed`;
};
