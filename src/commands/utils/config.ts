import settings from 'user-settings';
import getPkgInfo from './getPkgInfo';

interface UserSettings {
  get(key: string): any;
  set(key: string, value: any): void;
  unset(key: string): void;
}

interface ConfigClass {
  settings: UserSettings;
  get(key: string): any;
  set(key: string, value: any): void;
  unset(key: string): void;
}

class Config implements ConfigClass {
  settings: UserSettings;

  constructor() {
    const appName = getPkgInfo().name;
    // initialize user settings
    this.settings = settings.file(`.${appName}`);
  }

  get(key: string): any {
    return this.settings.get(key);
  }

  set(key: string, value: any): void {
    this.settings.set(key, value);
  }

  unset(key: string): void {
    this.settings.unset(key);
  }
}

const config = new Config();
export default config;
