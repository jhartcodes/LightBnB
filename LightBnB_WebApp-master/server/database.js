const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
    `, [`${email}`])
    .then(res => {
      console.log(res.rows[0])
      if (res.rows.length === 0) return (null);
      return(res.rows[0]);
    })
    .catch((err) => {
      console.log('there was an error ', err)
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1
    `, [`${id}`])
    .then(res => {
      
      if (res.rows.length === 0) return (null);
      return (res.rows[0]);
    })
  
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
 const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => {

      return(res.rows[0])

    })

};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT 10;`, [guest_id])
    .then(res => Promise.resolve(res.rows))
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function(options, limit = 10) {
  // array to hold query paramaters
  const queryParams = [];
  // SQL Query 
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // city parameter
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  //owner_id parameter
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (!options.city) {
      queryString += `WHERE `;
    }
    if (options.city) {
      queryString += `AND `;
    }
    queryString += ` owner_id = $${queryParams.length}
    `;
  }

   // min price
   if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night*100);
    if (!(options.city || options.owner_id)) {
      queryString += `WHERE`;
    }
    if (options.city || options.owner_id) {
      queryString += `AND`;
    }
    queryString += ` cost_per_night >= $${queryParams.length}`;
  };

  // max price
  if (options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night*100);
    if (!(options.city || options.owner_id || options.minimum_price_per_night)) {
      queryString += `WHERE`;
    }
    if (options.city || options.owner_id) {
      queryString += `AND`;
    }
    queryString += ` cost_per_night <= $${queryParams.length}`;
  };

  // add query 
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  //Log to double check if its right
  console.log(queryString, queryParams);

  // run the query.
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyDetails = [property.owner_id, `${property.title}`, `${property.description}`, `${property.thumbnail_photo_url}`, `${property.cover_photo_url}`, `${property.cost_per_night}`, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, `${property.country}`, `${property.street}`, `${property.city}`, `${property.province}`, `${property.post_code}`];

  return pool.query(`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *;`,propertyDetails)
    .then((res) => {
      return(res.rows)
    });
}
exports.addProperty = addProperty;


