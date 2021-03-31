INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO users (name, email, password)
VALUES('Eva Stanley','eva.s@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer','l.meyer@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks','DPrks@hotmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sue Luna ','sue@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1,'Speed Lamp','description','imgfile','imgfile2', 120,9,2,3,'Canada', 'Main', 'Vancouver', 'Alberta', 't43fff', true),
(2,'Blank corner','description','imgfile','imgfile2', 110,2,2,5,'Canada', 'Coding Street', 'Toronto', 'Ontario', '325ddf', true),
(3,'Habit mix','description','imgfile','imgfile2', 300,1,2,6,'Canada', 'Poutine Ave', 'Montreal', 'Quebec', '12345T', true);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 2, 'review message'),
(2, 3, 2, 5, 'review message'),
(3, 1, 3, 4, 'review message');