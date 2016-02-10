var Vue = require('vue');
var _ = require('lodash');

module.exports = Vue.extend({
  props: {
    layout: {
      default: 'grid'
    },
    selectable: {
      default: false
    },
    selected: {
      default: []
    }
  },
  data () {
    return {
      content: {},
      filter_text: ''
    };
  },
  computed: {
    list () {
      return this.layout === 'list';
    },
    logos () {
      return _.reduce(this.content, (total, cars, brand) => {
        total[brand] = cars[0].logo.url;
        return total;
      }, {});
    },
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
    update_selected (car) {
      if (this.selected.indexOf(car) >= 0) {
        this.selected.splice(this.selected.indexOf(car), 1);
      } else {
        this.selected.push(car);
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

