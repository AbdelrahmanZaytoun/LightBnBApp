SELECT id, name, email FROM users WHERE email = 'tristanjacobs@gmail.com';

SELECT avg(end_date - start_date) AS   average_duration FROM reservations;


-- SELECT properties.id AS id, properties.title AS title, properties.cost_per_night AS cost_per_night, avg(property_reviews.rating) AS average_rating, FROM properties JOIN property_reviews ON properties.id = property_id ORDER BY cost_per_night ASC WHERE properties.city = 'Vancouver';
SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;


SELECT properties.city, count(reservations) as total_reservations
FROM reservations
JOIN properties ON property_id = properties.id
GROUP BY properties.city
ORDER BY total_reservations DESC;