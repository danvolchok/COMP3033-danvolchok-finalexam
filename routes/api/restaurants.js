// Express package
const express = require("express");
// router object
const router = express.Router();
// import model
const Restaurant = require("../../models/restaurant");

// pagination
const pageSize = 10;

// POST
router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    res.status(400).json({ validationError: "Name is a required field." });
  } else if (!req.body.address) {
    res.status(400).json({ validationError: "Address is a required field." });
  } else if (!req.body.phoneNumber) {
    res.status(400).json({ validationError: "Phone number is a required field." });
  } else if (!req.body.emailAddress) {
    res.status(400).json({ validationError: "Email address is a required field." });
  } else if (!req.body.rating) {
    res.status(400).json({ validationError: "Rating is a required field." });
  } else {
    let restaurant = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      emailAddress: req.body.emailAddress,
      rating: req.body.rating
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  }
});

// GET


router.get("/", async (req, res, next) => {
    // pagination
  let page = req.query.page || 1; // if page is null, default to 1

  //calculate records to skip
  let skipSize = pageSize * (page - 1);

  // empty object to represent query
  // retrieve query string for filtering

  // restaurants?address=X
  let query = {};
  if (req.query.address) {
    query.address = req.query.address;
  }

  // restaurants?phoneNumber=X
  if (req.query.phoneNumber) {
    query.phoneNumber = req.query.phoneNumber;
  }

  // restaurants?emailAddress=X
  if (req.query.emailAddress) {
    query.emailAddress = req.query.emailAddress;
  }

  // restaurants?rating=X
  if (req.query.rating) {
    query.rating = req.query.rating;
  }

  let restaurants = await Restaurant.find(query)
    .sort([["rating", "descending"]])
    .skip(skipSize)
    .limit(pageSize);
  res.status(200).json(restaurants);
})

// GET by id
router.get('/:_id', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findById(req.params._id);
      if (!restaurant) {
        return res.status(404).send({ message: 'Restaurant not found' });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

// PUT

router.put("/:_id", async (req, res, next) => {
    if (!req.body.name) {
        res.status(400).json({ validationError: "Name is a required field." });
      } else if (!req.body.address) {
        res.status(400).json({ validationError: "Address is a required field." });
      } else if (!req.body.phoneNumber) {
        res.status(400).json({ validationError: "Phone number is a required field." });
      } else if (!req.body.emailAddress) {
        res.status(400).json({ validationError: "Email address is a required field." });
      } else if (!req.body.rating) {
        res.status(400).json({ validationError: "Rating is a required field." });
    } else {
      let restaurant = await Restaurant.findByIdAndUpdate(
        req.params._id,
        {
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            emailAddress: req.body.emailAddress,
            rating: req.body.rating
        },
        { new: true } // mongoose returns the updated version of this
      );
      res.status(200).json(restaurant);
    }
  });

  // DELETE

  router.delete("/:_id", async (req, res, next) => {
    await Restaurant.findByIdAndDelete(req.params._id);
    res.status(200).json({ success: "true" });
  });
  
  // Export
  module.exports = router;