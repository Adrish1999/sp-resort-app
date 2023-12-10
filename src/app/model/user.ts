export class User {
    public userId: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string;
    public password: string;
    public lastLoginDate!: Date;
    public lastLoginDateDisplay!: Date;
    public joinDate!: Date;
    public profileImageUrl: string;
    public active: boolean;
    public notLocked: boolean;
    public role: string;
    public authorities: [];

    constructor() {
        this.userId = 0;
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.email = '';
        this.password = '';
        this.profileImageUrl = '';
        this.active = false;
        this.notLocked = false;
        this.role = '';
        this.authorities = [];
    }
}
