import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addGuest, saveGuest, getGuest, listGuests, resetForTesting } from './routes';

describe('Guest routes', function() {

  it('addGuest', function() {
    // 1. Missing name
    const req1 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: {} });
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "missing 'name' parameter");

    // 2. Missing guestOf
    const req2 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam" } });
    const res2 = httpMocks.createResponse();
    addGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "missing 'guestOf' parameter");

    // 3. Missing family
    const req3 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James" } });
    const res3 = httpMocks.createResponse();
    addGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "missing 'family' parameter");

    // 4. Missing dRes
    const req4 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true } });
    const res4 = httpMocks.createResponse();
    addGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "missing 'dRes' parameter");

    // 5. Missing addedG
    const req5 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none" } });
    const res5 = httpMocks.createResponse();
    addGuest(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "missing 'addedG' parameter");

    // 6. Missing addedGName
    const req6 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none", addedG: "1" } });
    const res6 = httpMocks.createResponse();
    addGuest(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "missing 'addedGName' parameter");

    // 7. Missing addedGRes
    const req7 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none", addedG: "1", addedGName: "Alexis" } });
    const res7 = httpMocks.createResponse();
    addGuest(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(), "missing 'addedGRes' parameter");

    // 8. Missing message
    const req8 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none", addedG: "1", addedGName: "Alexis", addedGRes: "none" } });
    const res8 = httpMocks.createResponse();
    addGuest(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(), "missing 'message' parameter");

    // 9. Correctly added
    const req9 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none", addedG: "1", addedGName: "Alexis", addedGRes: "none", message: "Looking forward to it" } });
    const res9 = httpMocks.createResponse();
    addGuest(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData().guest.name, "Sam");
    assert.deepStrictEqual(res9._getData().guest.guestOf, "James");
    assert.deepStrictEqual(res9._getData().guest.family, true);
    assert.deepStrictEqual(res9._getData().guest.dRes, "none");
    assert.deepStrictEqual(res9._getData().guest.addedG, "1");
    assert.deepStrictEqual(res9._getData().guest.addedGName, "Alexis");
    assert.deepStrictEqual(res9._getData().guest.addedGRes, "none");
    assert.deepStrictEqual(res9._getData().guest.message, "Looking forward to it");

    resetForTesting();
  });

  it('saveGuest', function() {
    // First add a guest
    const req1 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none", addedG: "1", addedGName: "Alexis", addedGRes: "none", message: "Looking forward to it" } });
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);

    // 1. Missing name
    const req2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: {} });
    const res2 = httpMocks.createResponse();
    saveGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "missing 'name' parameter");

    // 2. Missing dRes
    const req3 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: { name: "Sam" } });
    const res3 = httpMocks.createResponse();
    saveGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "missing 'dRes' parameter");

    // 3. Missing addedG
    const req4 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: { name: "Sam", dRes: "vegan" } });
    const res4 = httpMocks.createResponse();
    saveGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "missing 'addedG' parameter");

    // 4. Missing addedGName
    const req5 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: { name: "Sam", dRes: "vegan", addedG: "1" } });
    const res5 = httpMocks.createResponse();
    saveGuest(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "missing 'addedGName' parameter");

    // 5. Missing addedGRes
    const req6 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: { name: "Sam", dRes: "vegan", addedG: "1", addedGName: "Alexis" } });
    const res6 = httpMocks.createResponse();
    saveGuest(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "missing 'addedGRes' parameter");

    // 6. Missing message
    const req7 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: { name: "Sam", dRes: "vegan", addedG: "1", addedGName: "Alexis", addedGRes: "none" } });
    const res7 = httpMocks.createResponse();
    saveGuest(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(), "missing 'message' parameter");

    // 7. Guest not found
    const req8 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: { name: "John", dRes: "vegan", addedG: "1", addedGName: "Alexis", addedGRes: "none", message: "Can't wait" } });
    const res8 = httpMocks.createResponse();
    saveGuest(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(), "no auction with name 'John'");

    // 8. Correctly saved
    const req9 = httpMocks.createRequest({ method: 'POST', url: '/api/saveGuest', body: { name: "Sam", dRes: "vegan", addedG: "1", addedGName: "Alexis", addedGRes: "none", message: "Can't wait" } });
    const res9 = httpMocks.createResponse();
    saveGuest(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData().guest.name, "Sam");
    assert.deepStrictEqual(res9._getData().guest.dRes, "vegan");
    assert.deepStrictEqual(res9._getData().guest.addedG, "1");
    assert.deepStrictEqual(res9._getData().guest.addedGName, "Alexis");
    assert.deepStrictEqual(res9._getData().guest.addedGRes, "none");
    assert.deepStrictEqual(res9._getData().guest.message, "Can't wait");
    resetForTesting();
  });

  it('getGuest', function() {
    // First add a guest
    const req1 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none", addedG: "1", addedGName: "Alexis", addedGRes: "none", message: "Looking forward to it" } });
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);

    // 1. Missing name
    const req2 = httpMocks.createRequest({ method: 'GET', url: '/api/getGuest', query: {} });
    const res2 = httpMocks.createResponse();
    getGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "missing 'name' parameter");

    // 2. Invalid name
    const req3 = httpMocks.createRequest({ method: 'GET', url: '/api/getGuest', query: { name: "John" } });
    const res3 = httpMocks.createResponse();
    getGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "no guest with name 'John'");

    // 3. Guest found
    const req4 = httpMocks.createRequest({ method: 'GET', url: '/api/getGuest', query: { name: "Sam" } });
    const res4 = httpMocks.createResponse();
    getGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().guest.name, "Sam");
    assert.deepStrictEqual(res4._getData().guest.guestOf, "James");
    assert.deepStrictEqual(res4._getData().guest.family, true);
    assert.deepStrictEqual(res4._getData().guest.dRes, "none");
    assert.deepStrictEqual(res4._getData().guest.addedG, "1");
    assert.deepStrictEqual(res4._getData().guest.addedGName, "Alexis");
    assert.deepStrictEqual(res4._getData().guest.addedGRes, "none");
    assert.deepStrictEqual(res4._getData().guest.message, "Looking forward to it");
    resetForTesting();
  });

  it('listGuests', function() {
    const req1 = httpMocks.createRequest({ method: 'GET', url: '/api/listGuests', query: {} });
    const res1 = httpMocks.createResponse();
    listGuests(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), { guests: [] });

    const req2 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "Sam", guestOf: "James", family: true, dRes: "none", addedG: "1", addedGName: "Alexis", addedGRes: "none", message: "Looking forward to it" } });
    const res2 = httpMocks.createResponse();
    addGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);

    const req3 = httpMocks.createRequest({ method: 'POST', url: '/api/addGuest', body: { name: "John", guestOf: "Molly", family: false, dRes: "none", addedG: "0", addedGName: "", addedGRes: "", message: "Excited" } });
    const res3 = httpMocks.createResponse();
    addGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);

    const req4 = httpMocks.createRequest({ method: 'GET', url: '/api/listGuests', query: {} });
    const res4 = httpMocks.createResponse();
    listGuests(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().guests.length, 2);
    assert.deepStrictEqual(res4._getData().guests[0].name, "Sam");
    assert.deepStrictEqual(res4._getData().guests[1].name, "John");
    resetForTesting();
  });

});
