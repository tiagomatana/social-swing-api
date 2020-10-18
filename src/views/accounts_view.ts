import Account from "../models/Account";

export default {
  render(account: Account) {
    return {
      id: account.id,
      name: account.name,
      surname: account.surname,
      email: account.email,
      birthdate: account.birthdate,
      is_administrator: account.is_administrator,
      is_blocked: account.is_blocked,
      active: account.active,
      genre: account.genre,
    }

  },

  renderMany(accounts: Account[]) {
    return accounts.map(account => this.render(account));
  }
}
