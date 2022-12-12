import { useServices } from '../services';
import { useDocumentsState, usePanelsState } from '../state';

export function useCurrentDocument() {
  const { panelsSvc } = useServices();
  const activeTab = usePanelsState(() => panelsSvc.getActiveTab('primary'));
  return useDocumentsState(state => state.documents[String(activeTab?.fileId)]);
}
