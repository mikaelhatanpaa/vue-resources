app.component("review-list", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template:
    /*html*/
    `
  <div class="review-container">
  <h3>Reviews:</h3>
  <ul>
  <li v-for="(review, index) in this.reviews" :key="index">
  {{review.name}} gave this {{review.rating}} stars
  <br />
  {{review.name}} would {{review.recommend === "yes" ? "recommend" : "not recommend"}} the product to a friend
  <br/>
  "{{review.review}}"
  </li>
  </ul>
  </div>
  `,
});
