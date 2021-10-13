const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');  const pool = new Pool({   user: 'vagrant',   password: '123',   host: 'localhost',   database: 'lightbnb' });
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool.query(`SELECT * FROM users WHERE users.email = $1,$2,$3;`,[email,id])
//  return pool.query(`SELECT * FROM users WHERE users.email = ${email};`)
 .then(res => {
   if (res.rows){   return res.rows[0]}
   else {return null}
 })
 .catch(err => console.error('query error', err.stack));

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
return pool.query(`SELECT * FROM users WHERE users.id = $1;`,[id])
// return pool.query(`SELECT * FROM users WHERE users.id = ${id};`)
.then(res => {
  if (res.rows){   return res.rows[0]}
  else {return null}
})
.catch(err => console.error('query error', err.stack));

}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
return pool.query(`INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING * ; `,[user.name,user.email,user.password])
.then(res => {
  if (res.reow){ return res.rows[0]}
  else { return null}
})
.catch(err => console.error('query error', err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  pool.query(`SELECT reservations.* AS all_reservations,properties.* AS all_properties, avg(rating) AS average_rating 
  FROM reservations JOIN properties ON properties.id = reservations.property_id JOIN property_reviews ON property_reviews.property_id = reservations.property_id
  WHERE reservations.guest_id = $1 GROUP BY reservations.id, properties.id ORDER BY reservations.start_date LIMIT $2;
  `,[guest_id, limit])

  .then(res => {
    if (res.reow){ return res.rows}
    else { return null}
  })
  .catch(err => console.error('query error', err.stack));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${checkParams()} cost_per_night >= $${queryParams.length}`;
  } 
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${checkParams()} cost_per_night <= $${queryParams.length}`;
  } 
  
  if (options.rating) {
    queryParams.push(`${options.rating}`);
    queryString += `${checkParams()} AVG(rating) >= $${queryParams.length}`;
  }
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
 
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  return pool.query(`
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
`,[property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.provence, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms]) 
.then(res => res.rows);


}
exports.addProperty = addProperty;




const getUpcomingReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const params = [guest_id, limit];
  return client.query(queryString, params)
    .then(res => res.rows);
}

exports.getUpcomingReservations = getUpcomingReservations;
