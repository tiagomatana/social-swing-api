import Account from "../models/Account";

export default {
  render(profile: Account) {
    return {
      id: profile.id,
      name: `${profile.name} ${profile.surname}`,
      birthdate: profile.birthdate,
      genre: profile.genre,
      about: profile.about,
      relationship: profile.relationship,
      sex_orientation: profile.sex_orientation,
      photo: profile.photo
    }

  },

  renderMany(profiles: Account[]) {
    return profiles.map(profile => this.render(profile));
  }
}
