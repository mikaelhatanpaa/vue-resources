const app = Vue.createApp({
  data() {
    return {
      cart: 0,
      product: "Socks",
      // Challenge
      onSale: true,
      brand: "Vue Mastery",
      //   Will now depend on the index so removing the image
      //   image: "./assets/images/socks_blue.jpg",
      selectedVariant: 0,
      //   Also, this will now depend on the individual product
      //   inStock: false,
      details: ["50% cotton", "30% wool", "20% polyester"],
      variants: [
        { id: 2234, color: "green", image: "./assets/images/socks_green.jpg" },
        { id: 2235, color: "blue", image: "./assets/images/socks_blue.jpg" },
      ],
    };
  },
  //   Computed properties
  methods: {
    addToCart() {
      this.cart += 1;
    },
    updateImage(variantImage) {
      this.image = variantImage;
    },
    updateVariant(index) {
      this.selectedVariant = index;
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].image;
    },
    inStock() {
      return this.variants[this.selectedVariant].inStock;
    },
    // Challenge
    isOnSale() {
      return this.onSale
        ? this.brand + " " + this.product + " " + "is on sale"
        : "";
    },
  },
});
