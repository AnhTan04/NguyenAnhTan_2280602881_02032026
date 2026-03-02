  const express = require('express');
const router = express.Router();

const products = [
  {
    id: 1,
    title: "Áo thun nam basic cotton",
    slug: "ao-thun-nam-basic-cotton",
    price: 189000,
    category: "áo thun",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: 2,
    title: "Quần jeans ống suông nam",
    slug: "quan-jeans-ong-suong-nam",
    price: 450000,
    category: "quần jeans",
    createdAt: new Date("2025-02-01"),
  },
  {
    id: 3,
    title: "Áo sơ mi trắng công sở nam",
    slug: "ao-so-mi-trang-cong-so-nam",
    price: 320000,
    category: "áo sơ mi",
    createdAt: new Date("2025-03-10"),
  },
  {
    id: 4,
    title: "Giày sneaker trắng unisex",
    slug: "giay-sneaker-trang-unisex",
    price: 780000,
    category: "giày",
    createdAt: new Date("2025-04-05"),
  },
  {
    id: 5,
    title: "Áo khoác bomber đen unisex",
    slug: "ao-khoac-bomber-den-unisex",
    price: 650000,
    category: "áo khoác",
    createdAt: new Date("2025-05-20"),
  },
];

router.get('/', (req, res) => {
  try {
    let filtered = [...products];

    const { title, minPrice, maxPrice, slug } = req.query;

    if (title) {
      const search = title.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search)
      );
    }

    if (slug) {
      filtered = filtered.filter(p => p.slug === slug.trim());
    }

    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    if (min !== null || max !== null) {
      filtered = filtered.filter(p => {
        if (min !== null && p.price < min) return false;
        if (max !== null && p.price > max) return false;
        return true;
      });
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (err) {
    console.error('Lỗi GET /products:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
});

router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ',
      });
    }

    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy sản phẩm với id = ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error('Lỗi GET /products/:id:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message,
    });
  }
});

module.exports = router;