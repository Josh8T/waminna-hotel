-- ========================================================
-- WAMINNA HOTEL SEED DATA (waminna-staging)
-- ========================================================

-- SEED ADDONS
INSERT INTO public.addons (id, name, description, price, per_night, category, icon) VALUES
('airport-shuttle', 'Luxury Airport Transfer', 'Private chauffered pickup & dropoff from/to International Airport', 45.00, false, 'transport', 'Car'),
('daily-breakfast', 'Gourmet Buffet Breakfast', 'Daily international breakfast buffet for all guests in your room', 25.00, true, 'dining', 'Coffee'),
('spa-package', '60-Min Wellness Spa Voucher', 'Relaxing full-body aromatherapy massage at Waminna Spa', 60.00, false, 'wellness', 'Sparkles'),
('late-checkout', 'Guaranteed Late Check-out', 'Extend stay until 4:00 PM on check-out day', 30.00, false, 'convenience', 'Clock')
ON CONFLICT (id) DO NOTHING;

-- SEED ROOMS
INSERT INTO public.rooms (id, name, room_number, type, capacity, bed_type, price_per_night, description, amenities, photos, status, size, view) VALUES
(1, 'Garden Standard', '101', 'standard', 2, 'queen', 89.00, 
 'A cozy retreat overlooking our lush garden. The Garden Standard room offers everything you need for a comfortable stay, with warm natural light, soft linens, and a peaceful ambiance that makes you feel right at home.',
 ARRAY['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Hair Dryer', 'Desk', 'Garden View'],
 ARRAY['/waminna-hotel/images/rooms/standard/standard.png', '/waminna-hotel/images/rooms/standard/standard_2.png'],
 'available', '24 m²', 'Garden'),

(2, 'City Standard', '102', 'standard', 2, 'queen', 95.00, 
 'Enjoy urban charm with city views in our City Standard room. Modern furnishings meet warm tones to create a space that is both functional and inviting, perfect for solo travelers or couples exploring the city.',
 ARRAY['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Hair Dryer', 'City View'],
 ARRAY['/waminna-hotel/images/rooms/standard_2bed/standard_2bed.png', '/waminna-hotel/images/rooms/standard/standard_2.png'],
 'available', '26 m²', 'City'),

(3, 'Garden Deluxe', '201', 'deluxe', 2, 'king', 129.00, 
 'Step up to the Garden Deluxe for an elevated experience. Featuring a plush king bed, premium linens, and a private balcony with garden views, this room blends comfort with a touch of luxury for a truly memorable stay.',
 ARRAY['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Coffee Machine', 'Balcony', 'Garden View'],
 ARRAY['/waminna-hotel/images/rooms/deluxe/deluxe.png', '/waminna-hotel/images/rooms/deluxe/deluxe_2.png'],
 'available', '32 m²', 'Garden'),

(4, 'Pool Deluxe', '202', 'deluxe', 3, 'king', 139.00, 
 'Overlooking our serene pool, the Pool Deluxe room offers a tranquil escape. With extra space, a king bed, and thoughtful amenities including a coffee machine and balcony, it is ideal for those seeking relaxation with a view.',
 ARRAY['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Coffee Machine', 'Balcony', 'Pool View'],
 ARRAY['/waminna-hotel/images/rooms/deluxe/deluxe_2.png', '/waminna-hotel/images/rooms/deluxe/deluxe.png'],
 'available', '35 m²', 'Pool'),

(5, 'Garden Suite', '301', 'suite', 4, 'king', 199.00, 
 'The Garden Suite is our signature accommodation, featuring a separate living area, king bedroom, and panoramic garden views. Perfect for families or extended stays, with all the comforts of home and the luxury of a boutique hotel.',
 ARRAY['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Room Service', 'Coffee Machine', 'Balcony', 'Garden View', 'Bathtub', 'Iron & Board'],
 ARRAY['/waminna-hotel/images/rooms/suite/suite.jpg', '/waminna-hotel/images/rooms/suite2/image.png'],
 'available', '52 m²', 'Garden'),

(6, 'Penthouse Suite', '302', 'suite', 4, 'king', 249.00, 
 'Our crown jewel. The Penthouse Suite offers unmatched luxury with a spacious living area, premium king bedroom, and breathtaking panoramic views. Every detail has been carefully curated for the most discerning guests.',
 ARRAY['Air Conditioning', 'Flat-screen TV', 'Free Wi-Fi', 'Mini Bar', 'Room Safe', 'Hair Dryer', 'Room Service', 'Coffee Machine', 'Balcony', 'City View', 'Rain Shower', 'Iron & Board', 'Desk'],
 ARRAY['/waminna-hotel/images/rooms/suite2/suite2_2.png', '/waminna-hotel/images/rooms/suite2/image.png'],
 'available', '68 m²', 'Panoramic')
ON CONFLICT (id) DO NOTHING;
