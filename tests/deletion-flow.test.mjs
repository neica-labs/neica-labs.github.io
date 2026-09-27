import test from 'node:test';
import assert from 'node:assert/strict';
import {runDeletion} from '../src/lib/deletion-flow.mjs';

function fixture(overrides={}) {
  const calls=[];
  return {calls, options:{uid:'test-user', currentUID:()=> 'test-user',
    reauthenticate:async()=>{calls.push('reauth');},
    eraseData:async()=>{calls.push('data');return {completed:true};},
    revoke:async()=>{calls.push('revoke');},
    finalize:async()=>{calls.push('auth');return {ok:true};},...overrides}};
}
test('deletion order retains data-before-auth barrier',async()=>{
  const f=fixture(); assert.equal(await runDeletion(f.options),true);
  assert.deepEqual(f.calls,['reauth','data','revoke','auth']);
});
test('different account never reaches deletion',async()=>{
  const f=fixture({currentUID:()=> 'other'});
  await assert.rejects(runDeletion(f.options),/account-changed/); assert.deepEqual(f.calls,[]);
});
test('cancelled reauthentication never deletes',async()=>{
  const f=fixture({reauthenticate:async()=>{throw Error('cancel');}});
  await assert.rejects(runDeletion(f.options),/cancel/);assert.deepEqual(f.calls,[]);
});
test('account switch after verification never deletes',async()=>{
  let uid='test-user';const f=fixture({currentUID:()=>uid,reauthenticate:async()=>{uid='other';}});
  await assert.rejects(runDeletion(f.options),/account-changed/); assert.deepEqual(f.calls,[]);
});
test('incomplete remote data deletion never deletes Auth',async()=>{
  const f=fixture({eraseData:async()=>({completed:false})});
  await assert.rejects(runDeletion(f.options),/deletion-incomplete/); assert.deepEqual(f.calls,['reauth']);
});
test('failed token revocation never finalizes',async()=>{
  const f=fixture({revoke:async()=>{throw Error('revoke');}});
  await assert.rejects(runDeletion(f.options),/revoke/); assert.deepEqual(f.calls,['reauth','data']);
});
test('lost completion response is not success',async()=>{
  const f=fixture({finalize:async()=>{throw Error('network');}});
  await assert.rejects(runDeletion(f.options),/network/);
  await assert.rejects(runDeletion(fixture({finalize:async()=>undefined}).options),/completion-unconfirmed/);
});
