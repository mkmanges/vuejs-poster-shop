const PRICE = 9.99;
const DISPLAY = 10;

new Vue({
  el: '#app',

  data: {
    total: 0,
    cart: [],
    items: [],
    results: [],
    newSearch: 'cats',
    lastSearch: '',
    loading: false,
    price: PRICE,
  },

  methods: {
    appendItems() {
      const items = this.items;
      const results = this.results;

      if (items.length < results.length) {
        const next = results.slice(items.length, items.length + DISPLAY);
        this.items = items.concat(next);
      }
    },
    onSubmit() {
      if (this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http
          .get(`/search/${this.newSearch}`)
          .then(response => {
            this.results = response.data;
            this.items = response.data.slice(0, DISPLAY);
            this.lastSearch = this.newSearch;
            this.newSearch = '';
            this.loading = false;
          });
      }
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

  computed: {
    noMoreItems() {
      return this.items.length === this.results.length && this.results.length > 0;
    },
  },

  filters: {
    currency(price) {
      return `$${price.toFixed(2)}`;
    }
  },

  mounted() {
    this.onSubmit();

    const elem = document.getElementById('product-list-bottom');
    const watcher = scrollMonitor.create(elem);
    watcher.enterViewport(() => {
      this.appendItems();
    });
  }
});


