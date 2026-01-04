import compareVersions from 'compare-versions';
import fetchPackageInfo from './fetchPackageInfo';
import { logger } from '.';

export default async function notifyLatestVersion(): Promise<void> {
  try {
    // Import package.json dynamically
    const pkg = await import('../../../package.json');
    const versionCurrent = pkg.version;
    const info = await fetchPackageInfo();
    const { name, version } = info;
    const compare = compareVersions(versionCurrent, version);
    const isOudated = (compare === -1);

    if (isOudated) {
      logger.warn(`New version of ${name} available.
Local version is v${versionCurrent}
Latest version is v${version}
To update, please run:

  npm install -g ${name}

`);
    }
  } catch (error) {
    // Do nothing, it's ok to fail if app can't check for latest version
  }
}
