app.component("review-form", {
  template:
    //   Learn v-model=""
    /*html*/
    `<form class="review-form" @submit.prevent="onSubmit">
    <h3>Leave a review</h3>
    <label for="name">Name:</label>
    <input id="name" v-model="name">

    <label for="review">Review:</label>
    <textarea id="review" v-model="review"></textarea>

    <label for="rating">Rating:</label>
    // see v-model.number - typecasrs value as number
    <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
    </select>

    <label for="recommend">Would you recommend this to a friend?</label>
    <select id="recommend" v-model="recommend">
      <option>yes</option>
      <option>no</option>
    </select>

    <input class="button" type="submit" value="Submit">
    </form>
    `,
  data() {
    return {
      name: "",
      review: "",
      rating: null,
      recommend: "",
    };
  },
  methods: {
    onSubmit() {
      if (
        this.name === "" ||
        this.review === "" ||
        this.rating === null ||
        this.recommend === ""
      ) {
        alert("Review is in-complete");
      }

      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating,
        recommend: this.recommend,
      };
      this.$emit("review-submitted", productReview);

      this.name = "";
      this.review = "";
      this.rating = null;
    },
  },
});
