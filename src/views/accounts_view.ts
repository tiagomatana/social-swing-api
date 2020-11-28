import Account from "../models/Account";
import images_view from "@views/images_view";

export default {
  render(account: Account, host?: string) {

    return {
      id: account.id || null,
      name: account.name || null,
      surname: account.surname || null,
      email: account.email || null,
      birthdate: account.birthdate || null,
      genre: account.genre || null,
      last_login: account.last_login || null,
      is_administrator: account.is_administrator || null,
      sex_orientation: account.sex_orientation || null,
      relationship: account.relationship || null,
      about: account.about || null,
      photo: account.photo ? `${host}/uploads/${account.photo}` : '',
      images: account.images ? images_view.renderMany(account.images) : []
    }

  },

  renderMany(accounts: Account[] = []) {
    return accounts.map(account => this.render(account));
  }
}
