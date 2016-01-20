var AppView = require('./views/app');

jQuery("#content").html((new AppView()).$el);