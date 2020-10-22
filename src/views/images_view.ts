import Image from "@models/Images";

export default {
  render(image: Image) {
    let api_address = process.env.API_URL as string;
    return {
      id: image.id,
      url: `${api_address}/uploads/${image.path}`
    }

  },

  renderMany(images: Image[]) {
    return images.map(image => this.render(image));
  }
}
