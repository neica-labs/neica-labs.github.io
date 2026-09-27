// Small dependency-injected coordinator: tests never touch real accounts.
export async function runDeletion({uid, currentUID, reauthenticate, eraseData, revoke, finalize}) {
  const sameAccount = () => {
    if (!uid || currentUID() !== uid) throw new Error('account-changed');
  };
  sameAccount();
  await reauthenticate();
  sameAccount();
  const result = await eraseData();
  sameAccount();
  if (result?.completed !== true) throw new Error('deletion-incomplete');
  await revoke();
  sameAccount();
  const receipt = await finalize();
  if (receipt?.ok !== true) throw new Error('completion-unconfirmed');
  return true; // A missing Auth user or network error is NOT a deletion receipt.
}
