var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Mongo DB package
var mongoose = require('mongoose')
var configs = require("./config/globals")

// Authentication package
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

// CORS package; fixes fetch error in SwaggerUI
var cors = require('cors');

// API documentation package
var SwaggerUI = require('swagger-ui-express');

// API documentation from comments
var swaggerJSDoc = require('swagger-jsdoc');
var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurants API",
      version: "1.0.0",
      contact: {
        name: "Dan Volchok",
        email: "volchokdan@gmail.com",
        url: "http://danvolchok.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic"
        }
      }
    },
    paths: {
      '/restaurants': {
        get: {
          tags: ['Restaurant database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Returns a list of restaurants',
          parameters: [
            {
              name: 'address',
              in: 'query',
              required: false,
              description: 'Restaurant address',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'phoneNumber',
              in: 'query',
              required: false,
              description: 'Restaurant phone number',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'emailAddress',
              in: 'query',
              required: false,
              description: 'Restaurant email address',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'rating',
              in: 'query',
              required: false,
              description: 'Restaurant rating',
              schema: {
                type: 'number'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Unfiltered list of restaurants',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Restaurant name'
                        },
                        address: {
                          type: 'string',
                          description: 'Restaurant address'
                        },
                        phoneNumber: {
                          type: 'string',
                          description: 'Restaurant phone number'
                        },
                        emailAddress: {
                          type: 'string',
                          description: 'Restaurant email address'
                        },
                        rating: {
                          type: 'number',
                          description: 'Restaurant rating'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Restaurant database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Create a new restaurant',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Restaurant name'
                    },
                    address: {
                      type: 'string',
                      description: 'Restaurant address'
                    },
                    phoneNumber: {
                      type: 'string',
                      description: 'Restaurant phone number'
                    },
                    emailAddress: {
                      type: 'string',
                      description: 'Restaurant email address'
                    },
                    rating: {
                      type: 'number',
                      description: 'Restaurant rating'
                    },
                  },
                  required: ['name', 'address', 'phoneNumber', 'emailAddress', 'rating']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Restaurant created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input'
            },
            '500': {
              description: 'Server error'
            }
          }
        }
      },
      '/restaurants/{_id}': {
        get: {
          tags: ['Restaurant database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Returns a single restaurant by its MongoDB ObjectId',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              description: 'MongoDB ObjectId of the restaurant to retrieve',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Restaurant retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                        description: 'MongoDB ObjectId of the restaurant'
                      },
                      name: {
                        type: 'string',
                        description: 'Restaurant name'
                      },
                      address: {
                        type: 'string',
                        description: 'Restaurant address'
                      },
                      phoneNumber: {
                        type: 'string',
                        description: 'Restaurant phone number'
                      },
                      emailAddress: {
                        type: 'string',
                        description: 'Restaurant email address'
                      },
                      rating: {
                        type: 'number',
                        description: 'Restaurant rating'
                      },
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Restaurant not found'
            },
          }
        },
        put: {
          tags: ['Restaurant database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Update an existing restaurant',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              description: 'MongoDB ObjectId of the restaurant to update',
              schema: {
                type: 'string',
                example: '656d0bc54b31e659828530e0'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Restaurant name'
                    },
                    address: {
                      type: 'string',
                      description: 'Restaurant address'
                    },
                    phoneNumber: {
                      type: 'string',
                      description: 'Restaurant phone number'
                    },
                    emailAddress: {
                      type: 'string',
                      description: 'Restaurant email address'
                    },
                    rating: {
                      type: 'number',
                      description: 'Restaurant rating'
                    },
                  },
                  required: ['name', 'address', 'phoneNumber', 'emailAddress', 'rating']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Restaurant updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string'
                      },
                      address: {
                        type: 'string'
                      },
                      phoneNumber: {
                        type: 'string'
                      },
                      emailAddress: {
                        type: 'string'
                      },
                      rating: {
                        type: 'number'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input'
            },
            '404': {
              description: 'Restaurant not found'
            },
            '500': {
              description: 'Server error'
            }
          }
        },
        delete: {
          tags: ['Restaurant database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Delete a restaurant',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              description: 'MongoDB ObjectId of the restaurant to delete',
              schema: {
                type: 'string',
                example: '656d0bc54b31e659828530e0'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Restaurant deleted successfully'
            },
            '404': {
              description: 'Restaurant not found'
            },
            '500': {
              description: 'Server error'
            }
          }
        }
      }
    }
  },
  apis: ["./routes/api/*.js"],
};

var swaggerSpec = swaggerJSDoc(options)




var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var restaurantsRouter = require('./routes/api/restaurants');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec))

// initialize passport and strategy
app.use(passport.initialize());

passport.use(
  new BasicStrategy((username, password, done) => {
    // provide code to find user and validate password
    // hardcode credentials admin:default
    // valid login YWRtaW46ZGVmYXVsdA==
    if (username == "admin" && password == "default") {
      console.log(`User ${username} authenticated successfully!`);
      return done(null, username);
    } else {
      console.log(`User ${username} authentication failed!`);
      return done(null, false);
    }
  })
);

app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.use(
  "/api/restaurants",
  passport.authenticate("basic", { session: false }),
  restaurantsRouter
);

// Connect to DB after router/controller configuration
mongoose
  .connect(configs.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((message) => {
    console.log("App connected successfully!");
  })
  .catch((error) => {
    console.log("Error while connecting: " + error);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
