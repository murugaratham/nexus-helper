declare global {
  interface Console {
    old: Function;
  }
}
/**
 * Hackish way to spy on node-tgz-downloader for progress updates
 * @param incrementProgress
 * @param setTotal
 * @param downloaded
 */
export const tgzLogSpy = (incrementProgress: Function, setTotal: Function, downloaded: number) => {
  let args: string;
  // only try assigning it once
  if (!console.old) {
    console.old = console.log;
  }
  // tslint:disable-next-line:only-arrow-functions
  console.log = function() {
    try {
      args = JSON.stringify(arguments[0]);
      if (args.indexOf('downloading tarballs') !== -1) {
        setTotal(arguments[1].count);
      }
      if (args.indexOf('downloaded') !== -1) {
        // tslint:disable-next-line:no-parameter-reassignment
        incrementProgress(downloaded++);
      }
      console.old.apply(undefined, arguments);
    } catch {
      /* swallow this */
    }
  };
};
