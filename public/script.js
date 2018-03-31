var PRICE = 9.99;
var LOAD_NUM = 10;
new Vue({
  /*Where you want view to be anchored in your DOM */
  el: "#app",
  data: {
    total: 0,
    newSearch: "stars",
    lastSearch: "",
    items: [],
    results: [],
    cart: [],
    loading: false,
    price: PRICE
  },
  methods: {
    appendItems: function () {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    addItem: function (index) {
      this.total += PRICE;
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++){
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++;
          found = true;
          break;
        }
      }
      if (!found){
        this.cart.push({
            id: item.id,
            title: item.title,
            price: PRICE,
            qty:1
          });
      }
    },
    inc: function (item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function (item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty === 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    },
    onSearchSubmit: function() {
      if (this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http
        .get('/search/'.concat(this.newSearch))
        .then(function (res) {
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.items = res.data.slice(0, LOAD_NUM);
          this.loading = false;
        });
    }
   }
  },/* end methods */
  computed: {
    /* will watch those variables and recall this function whenever there's change */
    noMoreItems : function () {
      return this.items.length === this.results.length && this.results.length > 0;
    },
  },

  filters: {
    currencyFilter: function (price) {
      return '$'.concat(price.toFixed(2));
    }
  },

  mounted: function () {
    this.onSearchSubmit();

    /* for scrolling */
    var vueInstance = this; /* needed for 3rd party not integrated with Vue */
    var elem = document.getElementById("product-list-bottom");
    var watcher = scrollMonitor.create(elem);

    watcher.enterViewport(function() {
        console.log( 'I have entered the viewport' );
        vueInstance.appendItems();
    });
    watcher.exitViewport(function() {
        console.log( 'I have left the viewport' );
    });
  }
});
