import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


// TODO: remove the dummy route

// identifies a guest
export type Guest = {
  name: string,
  guestOf: string,
  family: boolean,
  dRes: string,
  addedGName: string,
  addedG: string,
  addedGRes: string,
  message: string
};

// Map from name to guests .
const guests: Map<string, Guest> = new Map();


/**
 * Returns a list of all the guests
 * @param _req the request
 * @param res the response
 */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(guests.values());
  res.send({guests: vals});
};

/**
 * add a guest to the guest list
 * @param _req the request
 * @param res the response
 */
export const addGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guestOf = req.body.guestOf;
  if (typeof guestOf !== 'string') {
    res.status(400).send("missing 'guestOf' parameter");
    return;
  }

  const family = req.body.family;
  if (typeof family !== 'boolean') {
    res.status(400).send("missing 'family' parameter");
    return;
  }

  const dRes = req.body.dRes;
  if (typeof dRes !== 'string') {
    res.status(400).send("missing 'dRes' parameter");
    return;
  }

  const addedG = req.body.addedG;
  if (typeof addedG !== 'string') {
    res.status(400).send("missing 'addedG' parameter");
    return;
  }

  const addedGName = req.body.addedGName;
  if (typeof addedGName !== 'string') {
    res.status(400).send("missing 'addedGName' parameter");
    return;
  }

  const addedGRes = req.body.addedGRes;
  if (typeof addedGRes !== 'string') {
    res.status(400).send("missing 'addedGRes' parameter");
    return;
  }

  const message = req.body.message;
  if (typeof message !== 'string') {
    res.status(400).send("missing 'message' parameter");
    return;
  }

  const guest: Guest = {
    name: name,
    guestOf: guestOf,
    family: family,
    dRes: dRes,
    addedGName: addedGName,
    addedG: addedG,
    addedGRes: addedGRes,
    message: message
  }

  guests.set(guest.name, guest);
  res.send({guest: guest});
};

/**
 * save a guest to the guest list
 * @param _req the request
 * @param res the response
 */
export const saveGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const dRes = req.body.dRes;
  if (typeof dRes !== 'string') {
    res.status(400).send("missing 'dRes' parameter");
    return;
  }

  const addedG = req.body.addedG;
  if (typeof addedG !== 'string') {
    res.status(400).send("missing 'addedG' parameter");
    return;
  }

  const addedGName = req.body.addedGName;
  if (typeof addedGName !== 'string') {
    res.status(400).send("missing 'addedGName' parameter");
    return;
  }

  const addedGRes = req.body.addedGRes;
  if (typeof addedGRes !== 'string') {
    res.status(400).send("missing 'addedGRes' parameter");
    return;
  }

  const message = req.body.message;
  if (typeof message !== 'string') {
    res.status(400).send("missing 'message' parameter");
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no auction with name '${name}'`);
    return;
  }

  const guestNew: Guest = {
    name: name,
    guestOf: guest.guestOf,
    family: guest.family,
    dRes: dRes,
    addedGName: addedGName,
    addedG: addedG,
    addedGRes: addedGRes,
    message: message
  }

  guests.set(name, guestNew);
  res.send({guest: guestNew});
}


/**
 * Retrieves the current state of a given guest.
 * @param req the request
 * @param req the response
 */
export const getGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const guest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  res.send({guest: guest});
}

/** Testing function to remove all the added auctions. */
export const resetForTesting = (): void => {
  guests.clear();
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }

};