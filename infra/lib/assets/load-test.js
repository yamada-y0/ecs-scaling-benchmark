// load-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    scenarios: {
        constant_rate_test: {
            executor: "constant-arrival-rate",
            rate: 1,
            timeUnit: "1s",
            duration: "10s",
            preAllocatedVUs: 1,
        },
    },
};

export default function () {
    const res = http.post(
        `${__ENV.BASE_URL}/hash`,
        JSON.stringify({
            input: "password",
            iterations: 1000000,
        }),
        { headers: { "Content-Type": "application/json" } },
    );

    check(res, {
        "status was 200": (r) => r.status === 200,
    });

    sleep(1);
}
