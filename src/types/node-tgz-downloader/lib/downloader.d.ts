declare module 'node-tgz-downloader/lib/downloader' {
  export function downloadFromPackageLock(packageLock: any, directory: any): Promise<void>;
  export function downloadFromSet(tarballsSet: any): any;
}
