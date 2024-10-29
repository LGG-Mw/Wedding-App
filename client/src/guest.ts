import { isRecord } from "./record";

// identifies a guest
export type Guest = {
    name: string,
    guestOf: string,
    family: boolean
    dRes: string,
    addedGName: string,
    addedG: string,
    addedGRes: string,
    message: string
};


/**
 * Parses unknown data into an Guest. Will log an error and return undefined
 * if it is not a valid Guest.
 * @param val unknown data to parse into an Guest
 * @return Auction if val is a valid Guest and undefined otherwise
 */
export const parseGuest = (val: unknown): undefined | Guest => {
    if (!isRecord(val)) {
        console.error("not a Guest", val)
        return undefined;
    }

    if (typeof val.name !== "string") {
        console.error("not a Guest: missing 'name'", val)
        return undefined;
    }

    if (typeof val.guestOf !== "string") {
        console.error("not a Guest: missing 'guestOf'", val)
        return undefined;
    }

    if (typeof val.family !== "boolean") {
        console.error("not a Guest: missing 'family'", val)
        return undefined;
    }

    if (typeof val.dRes !== "string") {
        console.error("not a Guest: missing 'dRes'", val)
        return undefined;
    }

    if (typeof val.addedGName !== "string") {
        console.error("not a Guest: missing 'addedGName'", val)
        return undefined;
    }

    if (typeof val.addedG !== "string") {
        console.error("not a Guest: missing 'addedG'", val)
        return undefined;
    }

    if (typeof val.addedGRes !== "string") {
        console.error("not a Guest: missing 'addedGRes'", val)
        return undefined;
    }

    if (typeof val.message !== "string") {
        console.error("not a Guest: missing 'message'", val)
        return undefined;
    }

    return {name: val.name, guestOf: val.guestOf, family: val.family, dRes: val.dRes, addedGName: val.addedGName, addedG: val.addedG, addedGRes: val.addedGRes, message: val.message}
}