CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price INT UNSIGNED NOT NULL,
  compare_at_price INT UNSIGNED NULL,
  badge VARCHAR(80) NULL,
  emoji VARCHAR(12) NOT NULL,
  accent VARCHAR(30) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 20,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(160) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT NULL,
  total INT UNSIGNED NOT NULL,
  status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(180) NOT NULL,
  unit_price INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categories (name, slug) VALUES
('للبيت', 'home'), ('لليوم', 'everyday'), ('للمكتب', 'desk');

INSERT INTO products (category_id, name, slug, description, price, compare_at_price, badge, emoji, accent, stock) VALUES
(1, 'كوب سيراميك هادئ', 'calm-ceramic-cup', 'تفصيلة يومية بسيطة تغيّر مزاج قهوتك.', 8900, NULL, 'الأكثر طلبًا', '☕', '#dceba5', 18),
(1, 'شمعة غروب', 'sunset-candle', 'رائحة خشبية دافئة لآخر اليوم.', 6900, 8900, 'خصم 22%', '🕯️', '#f4c8aa', 22),
(2, 'حقيبة قماش يومية', 'everyday-tote', 'خفيفة، متينة، وترافقك في كل مشوار.', 12900, NULL, 'وصل حديثًا', '👜', '#bddbd1', 12),
(3, 'دفتر أفكار', 'ideas-notebook', 'صفحات ناعمة لأفكار تستحق أن تُكتب.', 4900, NULL, 'هدية لطيفة', '📓', '#e6c9e7', 30),
(2, 'صابون زيت الزيتون', 'olive-soap', 'عناية يومية نقية بمكونات مألوفة.', 3900, NULL, 'طبيعي', '🧼', '#f1e2a7', 26),
(1, 'مبخرة صغيرة', 'mini-incense', 'قطعة هادئة تضيف معنى للمكان.', 10900, NULL, 'اختيار نُقطة', '🏺', '#c8c0b1', 9);
