import axios from 'axios';
import getPkgInfo from './getPkgInfo';
import { API_ENDPOINTS_NPMS_PACKAGE } from '../../config';

interface NpmMetadata {
  name: string;
  version: string;
  [key: string]: any;
}

/**
 * Fetch the latest information of the package from npm registry
 */
export default async function fetchPackageInfo(): Promise<NpmMetadata> {
  const appName = getPkgInfo().name;
  const url = `${API_ENDPOINTS_NPMS_PACKAGE}/${appName}`;

  try {
    const response = await axios.get<{ collected: { metadata: NpmMetadata } }>(url, { timeout: 5000 });
    return response.data.collected.metadata;
  } catch (error) {
    throw error;
  }
}
