export interface ITarballs {
  name: string;
  version: string;
  path: string;
}

export const enumerateNpmDependencies = (dependencies: any): ITarballs[] => {
  const tarballs: ITarballs[] = [];
  for (const dependencyName in dependencies) {
    if (dependencies.hasOwnProperty(dependencyName)) {
      const dependency = dependencies[dependencyName];
      let path;
      // special handling of @types, @material-ui etc, packages
      if (!dependencyName.includes('@')) {
        path = `${dependencyName}-${dependency.version}.tgz`;
      } else {
        const temp = dependencyName.split('/');
        path = `${temp[1]}-${dependency.version}.tgz`;
      }
      if (dependency.resolved) {
        tarballs.push({
          path,
          name: dependencyName,
          version: dependency.version,
        });
      }
      if (dependency.dependencies) {
        tarballs.push(...enumerateNpmDependencies(dependency.dependencies));
      }
    }
  }
  return tarballs;
};
