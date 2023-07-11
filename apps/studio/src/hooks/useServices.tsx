import { useEditor, useFormat, useParser, useNavigation } from "./";

export const useServices = () => {
  const parserSvc = useParser();
  const editorSvc = useEditor();
  const formatSvc = useFormat();
  const navigationSvc = useNavigation();

  const services = {
    parserSvc,
    editorSvc,
    formatSvc,
    navigationSvc,
  };

  return services;
}