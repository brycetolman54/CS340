
// 1. Explain how this program violates the High-Quality Abstraction principle.
//		This code has not abstracted all the way. It has left things such as the total years of service and months in the last position as primitive return types. There is more abstraction that could be done

// 2. Explain how you would refactor the code to improve its design.
//		In order to fix this code, I would probably create new classes to represent the months in last position and total years of service. These classes could hold on to start and end dates and have a function to generate the number we are interested in, but would allow us to abstract further. 
//		Furhtermore, I think it could be good to name those classes without the get prefix, to make the code more readable

class Employee {
	public employmentStartDate: Date;
	public employmentEndDate: Date;
}

class RetirementCalculator {
	private employee: Employee;

	public constructor(emp: Employee) {
		this.employee = emp;
	}

	public calculateRetirement(payPeriodStart: Date, payPeriodEnd: Date): number { … }

	private getTotalYearsOfService(startDate: Date, endDate: Date): number { … }

	private getMonthsInLastPosition(startDate: Date, endDate: Date): number { … }
	
    ...
}
