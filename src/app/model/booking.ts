export class Booking {
    public personName : string;
	public roomNumber : string;
	public checkInDate : Date;
	public checkOutDate : Date;
	public totalAmount : number;
	public phoneNumber : string;
	public email : string;
	public isPaid : boolean;
    public paymentId : string;
	public bookingStatus : string;

    constructor() {
        this.personName = '';
        this.roomNumber = '';
        this.checkInDate = new Date();
        this.checkOutDate = new Date();
        this.totalAmount = 0;
        this.phoneNumber = '';
        this.email = '';
        this.isPaid = false;
        this.bookingStatus = '';
        this.paymentId = '';
    }
}