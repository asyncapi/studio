import { useServices } from '../services';
import { useFilesState, usePanelsState } from '../state';

export function useCurrentFile() {
  const { panelsSvc } = useServices();
  const activeTab = usePanelsState(() => panelsSvc.getActiveTab('primary'));
  return useFilesState(state => state.files[String(activeTab?.fileId)]);
}
