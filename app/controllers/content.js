var _ = require('lodash');
var promise = require('bluebird');

var app = require('../../app.js');
var db = require('../models');

var ContentController = module.exports;

ContentController.update_all = () => {

};

ContentController.update = (content_scraper, model, find_criterea) => {
  return content_scraper().then((content) => {
    // console.log(content);
    return content;
  }).reduce((updated, content) => {
    content = model.fromKunos(content);
    return model.findOrCreate(content)
      .where(find_criterea(content))
      .then((data) => {
        // we found a match, but the data doesn't 100% match the new content
        // could be a data coersion issue, ('24' != 24)
        // or the data may just be old
        if (!_.isMatch(data, content)) {
          return model.update(find_criterea, content).then(() => {
            updated.push(content);
            return updated;
          });
        }

        // multiple matches in the db, delete them and add the new one
        if (_.isArray(data)) {

          return model.destroy(data).then(() => {
            return model.create(content).then(() => {
              updated.push(content);
              return updated;
            });
          });
        }


        // must be new data, or unchanged existing data
        return updated;
      })
  }, []).all();
}
