import * as assert from 'assert';
import { parseGuest } from './guest';


describe('guests', function() {
    it('parseGuest', function() {
        // not a record
        assert.deepStrictEqual(parseGuest(1), undefined)
        assert.deepStrictEqual(parseGuest(""), undefined)

        // name not string
        assert.deepStrictEqual(parseGuest({name: 1}), undefined)
        assert.deepStrictEqual(parseGuest({name: false}), undefined)

        // guestOf not string
        assert.deepStrictEqual(parseGuest({name: "", guestOf: false}), undefined)
        assert.deepStrictEqual(parseGuest({name: "", guestOf: 1}), undefined)

        // family not boolean
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "false", family: ""}), undefined)
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "1", family: 1}), undefined)

        // dRes not string
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "false", family: false, dRes: 1}), undefined)
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "1", family: true, dRes: false}), undefined)

        // addedGName not string
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "false", family: false, dRes: "", addedGName: 1}), undefined)
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "1", family: true, dRes: "false", addedGName: false}), undefined)

        // addedG not string
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "false", family: false, dRes: "", addedGName: "1", addedG: 1}), undefined)
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "1", family: true, dRes: "false", addedGName: "false", addedG: 2}), undefined)

        // addedGRes not string
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "false", family: false, dRes: "", addedGName: "1", addedG: "1", addedGRes: 1}), undefined)
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "1", family: true, dRes: "false", addedGName: "false", addedG: "2", addedGRes: 2}), undefined)

        // addedGRes not string
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "false", family: false, dRes: "", addedGName: "1", addedG: "1", addedGRes: "1", message: 1}), undefined)
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "1", family: true, dRes: "false", addedGName: "false", addedG: "2", addedGRes: "2", message: false}), undefined)

        // addedGRes not string
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "false", family: false, dRes: "", addedGName: "1", addedG: "1", addedGRes: "1", message: "1"}), {name: "", guestOf: "false", family: false, dRes: "", addedGName: "1", addedG: "1", addedGRes: "1", message: "1"})
        assert.deepStrictEqual(parseGuest({name: "", guestOf: "1", family: true, dRes: "false", addedGName: "false", addedG: "2", addedGRes: "2", message: "false"}), {name: "", guestOf: "1", family: true, dRes: "false", addedGName: "false", addedG: "2", addedGRes: "2", message: "false"})
    });
});