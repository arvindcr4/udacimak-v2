declare module 'user-settings' {
  interface UserSettings {
    get(key: string): any;
    set(key: string, value: any): void;
    unset(key: string): void;
  }

  interface UserSettingsModule {
    file(appName: string): UserSettings;
  }

  const userSettings: UserSettingsModule;
  export default userSettings;
}
