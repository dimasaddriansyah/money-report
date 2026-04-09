export function useAccountActions(refetch: () => void) {
  async function createAccount(name: string) {
    console.log("create", name);
    refetch();
  }

  async function updateAccount(id: string, name: string) {
    console.log("update", id, name);
    refetch();
  }

  async function deleteAccount(id: string) {
    console.log("delete", id);
    refetch();
  }

  return {
    createAccount,
    updateAccount,
    deleteAccount,
  };
}