var Vue = require('vue');
var _ = require('lodash');

module.exports = Vue.extend({
  props: {
    layout: {
      default: "grid"
    },
    selectable: {
      default: true
    }
  },
  data () {
    return {
      content: {},
      selected: [],
      filter_text: '',
      list: true
    };
  },
  computed: {
    car_list_flat () {
      return _(this.content).values().flatten().value();
    },
    filter_text_pattern () {
      return new RegExp(this.filter_text, 'gi');
    },
    filtered_cars () {
      return _.reduce(this.content, (total, cars, brand) => {
        if (_.isEmpty(this.filter_text)) {
          total[brand] = cars;
          return total;
        }

        var matching_cars = _.filter(cars, car => {

          return this.filter_text_pattern.test(car.brand) ||
            this.filter_text_pattern.test(car.name) ||
            this.filter_text_pattern.test(car.description);
        });

        if (!_.isEmpty(matching_cars)) total[brand] = matching_cars;

        return total;
      }, {});
    }
  },
  methods: {
    update_selected (id) {
      if (this.selected.indexOf(id) >= 0) {
        this.selected.splice(this.selected.indexOf(id), 1);
      } else {
        this.selected.push(id);
      }

      this.$dispatch('selected-cars-update', this.selected);
    },
    search (event) {
      this.filter_text = event.target.value;
    }
  },
  template: require('../templates/components/car_list.html'),
  components: {
    car: require('./car.js')
  },
  ready () {
    this.$http.get('/api/content/cars').then(res => this.content = res.data);
  }
});

