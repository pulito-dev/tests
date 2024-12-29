import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  thresholds: {
      http_req_failed: ['rate<0.01'], // http errors should be less than 1%
      http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
  scenarios: {
      my_scenario1: {
        executor: 'constant-arrival-rate',
        duration: '10m', // total duration
        preAllocatedVUs: 1000, // to allocate runtime resources
  
        rate: 1000, // number of constant iterations given `timeUnit`
        timeUnit: '1s',
      },
    },
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function() {
  const res = http.get('http://localhost/listings/');
  check(res, {
    "is status == 200": (r) => r.status == 200
  })
  sleep(1);
}
