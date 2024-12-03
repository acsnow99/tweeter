export interface PasswordDao {
    // returns alias if valid
    createUserPassword: (alias: string, password: string) => Promise<string | null>;
    checkUserPassword: (alias: string, password: string) => Promise<boolean>;
}
