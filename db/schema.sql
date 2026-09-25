CREATE TABLE IF NOT EXISTS foods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  restaurant TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
  image_url TEXT NOT NULL
);

INSERT INTO foods (name, restaurant, price, category, rating, image_url)
VALUES
  ('Truffle Smash Burger', 'Urban Buns', 249, 'Burgers', 4.8, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900'),
  ('Hyderabadi Chicken Biryani', 'Spice Route', 299, 'Biryani', 4.9, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900'),
  ('Margherita Pizza', 'Napoli House', 279, 'Pizza', 4.7, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900'),
  ('Creamy Alfredo Pasta', 'Pasta Lab', 269, 'Pasta', 4.6, 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900'),
  ('Crispy Chicken Wings', 'Wing District', 219, 'Chicken', 4.8, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=900'),
  ('Mango Cheesecake', 'Sweet Theory', 189, 'Desserts', 4.9, 'https://images.unsplash.com/photo-1548365328-8b849e6f90e7?w=900')
ON CONFLICT DO NOTHING;