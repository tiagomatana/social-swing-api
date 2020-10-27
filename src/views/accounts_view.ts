import Account from "../models/Account";
import images_view from "@views/images_view";
import environment from "@config/environment";

export default {
  render(account: Account, host?: string) {

    return {
      id: account.id,
      name: account.name,
      surname: account.surname,
      email: account.email,
      birthdate: account.birthdate,
      genre: account.genre,
      last_login: account.last_login,
      active: account.active,
      is_administrator: account.is_administrator,
      is_blocked: account.is_blocked,
      sex_orientation: account.sex_orientation,
      relationship: account.relationship,
      about: account.about,
      photo: `${host}/uploads/${account.photo}`,
      images: account.images ? images_view.renderMany(account.images) : []
    }

  },

  renderMany(accounts: Account[] = []) {
    return accounts.map(account => this.render(account));
  }
}
