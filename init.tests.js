import http from "node:http";
import test from "ava";
import got from "got";
import app from "../server.js";

// test("Test passes", (t) => {
// 	t.pass();
// });

// test("Test fails", (t) => {
// 	t.fail();
// });

// test("Test throws", (t) => {
//     t.throws(() => {
// 	    throw new Error("Test failed");
//     });
// });

// const addNumbers = (a,b) => a + b;

// test('Add numbers', t => {
//     t.is(addNumbers(1,2), 3);
//     t.is(addNumbers(3,5), 8);
//     t.is(addNumbers(-1,2), 1);
//     t.is(addNumbers(0,0), 0);
//     t.is(addNumbers(0,2), 2);
//     t.is(addNumbers("1", "2"), "12");
//     t.is(addNumbers("1", 2), "12");
//     t.is(addNumbers(undefined, 2), NaN);
//     t.is(addNumbers(), NaN);
// });

// test('Async', async t => {
//     const res = Promise.resolve('test');
//     t.is(await res, 'test');
// });

test.before(async (t) => {
	t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const { port } = server.address();
	t.context.got = got.extend({ responseType: "json", prefixUrl: `http://localhost:${port}` });

	// Δημιουργία test χρήστη (αν δεν υπάρχει) και λήψη token
	const testUser = {
		username: "testuser",
		password: "testpass123",
		email: "testuser@example.com"
	};

	// Δημιουργία χρήστη
	await t.context.got.post("user-system/createUser", { json: testUser });

	// Authentication για λήψη token
	const authRes = await t.context.got.post("user-system/authenticate", { json: { username: testUser.username, password: testUser.password } });
	t.context.token = authRes.body.token;
});

test.after.always((t) => {
	t.context.server.close();
});

test("GET /api returns correct response and status code", async (t) => {
	const { body, statusCode } = await t.context.got.get("data", {
		headers: {
			Authorization: `Bearer ${t.context.token}`
		}
	});
	t.is(statusCode, 200);
	t.is(body.success, true);
	// Προσθέστε εδώ επιπλέον ελέγχους για το body αν χρειάζεται
});

test("GET /info returns correct response and status code", async (t) => {
	const { body, statusCode } = await t.context.got.get("info");
	t.is(statusCode, 200);
	// Προσθέστε εδώ επιπλέον ελέγχους για το body αν χρειάζεται
});
