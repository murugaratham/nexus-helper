export interface INexusDropZoneState {
  dropzoneActive: boolean;
  files: File[];
  packages: string;
  downloadedPercent: number;
  total: number;
  downloaded: number;
  username: string;
  password: string;
  nexusUrl: string;
  nexusRepo: string;
  packagesWithError: string[];
}

export const initialState: INexusDropZoneState = {
  files: [],
  dropzoneActive: false,
  packages: '',
  downloadedPercent: 0,
  total: 0,
  downloaded: 0,
  username: 'username',
  password: '*******',
  nexusUrl: 'http://nexus:8081',
  nexusRepo: 'nexus repo url',
  packagesWithError: [],
};
