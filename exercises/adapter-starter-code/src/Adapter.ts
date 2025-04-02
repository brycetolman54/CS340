import { ContactManager } from "./contact/ContactManager";
import { Justification } from "./entity/Justification";
import { TableData } from "./table/TableData";

export class Adapter implements TableData {
    private contactManager: ContactManager;

    public constructor(contactManager: ContactManager) {
        this.contactManager = contactManager;
    }

    public getColumnCount(): number {
        return 4;
    }

    public getRowCount(): number {
        return this.contactManager.getContactCount();
    }

    public getColumnSpacing(): number {
        return 2;
    }

    public getRowSpacing(): number {
        return 0;
    }

    public getHeaderUnderline(): string {
        return "x";
    }

    public getColumnHeader(col: number): string {
        switch (col) {
            case 0:
                return "First Name";
            case 1:
                return "Last Name";
            case 2:
                return "Phone";
            case 3:
                return "Email";
            default:
                return "";
        }
    }

    public getColumnWidth(col: number): number {
        switch (col) {
            case 0:
                return 10;
            case 1:
                return 10;
            case 2:
                return 14;
            case 3:
                return 25;
            default:
                return 0;
        }
    }

    public getColumnJustification(col: number): Justification {
        switch (col) {
            case 0:
                return Justification.Left;
            case 1:
                return Justification.Left;
            case 2:
                return Justification.Center;
            case 3:
                return Justification.Right;
            default:
                return 0;
        }
    }

    public getCellValue(row: number, col: number): string {
        let contact = this.contactManager.getContact(row);
        switch (col) {
            case 0:
                return contact.firstName;
            case 1:
                return contact.lastName;
            case 2:
                return contact.phone;
            case 3:
                return contact.email;
            default:
                return "";
        }
    }
}
