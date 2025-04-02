import { Table } from "./table/Table";
import { ContactManager } from "./contact/ContactManager";
import { TableData } from "./table/TableData";
import { Adapter } from "./Adapter";
import { Contact } from "./entity/Contact";

function Main() {
    const contactManager: ContactManager = new ContactManager();

    contactManager.setContact(
        0,
        new Contact("bryce", "tolman", "720-732-7805", "brycealann@gmail.com")
    );
    contactManager.setContact(
        1,
        new Contact("rylie", "speirs", "208-315-4790", "rylieshareen@gmail.com")
    );
    contactManager.setContact(
        2,
        new Contact("kristina", "tolman", "303-570-8568", "kkt@live.com")
    );
    contactManager.setContact(
        3,
        new Contact("robert", "tolman", "303-435-5779", "robtolman@live.com")
    );

    const contactsTable: TableData = new Adapter(contactManager);
    const table = new Table(contactsTable, (value: any) =>
        process.stdout.write(value)
    );

    table.display();
}

Main();
