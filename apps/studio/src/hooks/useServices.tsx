import { useParser } from "./useParser"

export const useServices = () => {
  const { parse } = useParser();

  const services = {
    parserSvc: {
      parse,
    },
  };

  return services;
}