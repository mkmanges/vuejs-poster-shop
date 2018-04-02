const PRICE = 9.99;

new Vue({
  el: '#app',

  data: {
    total: 0,
    items: [],
    cart: [],
    newSearch: '',
    lastSearch: '',
    loading: false,
  },

  methods: {
    onSubmit() {
      this.items = [];
      this.loading = true;
      this.$http
        .get(`/search/${this.newSearch}`)
        .then(response => {
          this.items = response.data;
          this.lastSearch = this.newSearch;
          this.newSearch = '';
          this.loading = false;
        });
    },
    addItem(index) {
      this.total += 9.99;
      const item = this.items[index];
      let found = false;
      this.cart.filter((thing, index) => {
        if (thing.id === item.id) {
          this.cart[index].qty++;
          found = true;
        }
      });
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE,
        });
      }
    },
    increase(item) {
      item.qty++;
      this.total += item.price;
    },
    decrease(item) {
      item.qty--;
      this.total -= item.price;
      // remove item from cart if qty === 0
      if (item.qty <= 0) {
        this.cart.filter((thing, index) => {
          if (thing.id === item.id) {
            this.cart.splice(index, 1);
          }
        });
      }
    }
  },

  filters: {
    currency(price) {
      return `$${price.toFixed(2)}`;
    }
  }
});
