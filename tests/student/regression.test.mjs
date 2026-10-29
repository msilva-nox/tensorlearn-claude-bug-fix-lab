import test from 'node:test';
import assert from 'node:assert/strict';
import { getClaim } from '../../src/claims.mjs';

const claims = [
  { id: 'claim-A', ownerId: 'user-4', status: 'open' },
  { id: 'claim-B', ownerId: 'user-42', status: 'open' },
];

test('incident: user-4 must not receive claim-B owned by user-42', () => {
  assert.equal(getClaim(claims, 'user-4', 'claim-B'), null);
});

test('the exact owner still receives their claim, with whitespace trimmed', () => {
  assert.equal(getClaim(claims, ' user-42 ', ' claim-B '), claims[1]);
  assert.equal(getClaim(claims, 'user-4', 'claim-A'), claims[0]);
});

test('empty or malformed ids never match', () => {
  assert.equal(getClaim(claims, '', 'claim-B'), null);
  assert.equal(getClaim(claims, '   ', 'claim-B'), null);
  assert.equal(getClaim(claims, null, 'claim-B'), null);
  assert.equal(getClaim([{ id: 7, ownerId: 'user-4' }], 'user-4', 7), null);
  assert.equal(getClaim(claims, 'user-42', 'CLAIM-B'), null);
});

test('non-array records and missing claims return null without mutation', () => {
  assert.equal(getClaim(null, 'user-4', 'claim-A'), null);
  assert.equal(getClaim(claims, 'user-4', 'claim-Z'), null);
  assert.deepEqual(claims, [
    { id: 'claim-A', ownerId: 'user-4', status: 'open' },
    { id: 'claim-B', ownerId: 'user-42', status: 'open' },
  ]);
});
