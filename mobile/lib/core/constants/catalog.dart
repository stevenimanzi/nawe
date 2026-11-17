/// Fixed vocabularies used by listing forms and filters.
abstract final class Catalog {
  static const productCategories = [
    'Electronics',
    'Phones',
    'Furniture',
    'Home & Kitchen',
    'Fashion',
    'Vehicles',
    'Books',
    'Sports',
    'Other',
  ];

  static const conditions = ['New', 'Like new', 'Good', 'Fair'];

  static const houseTypes = ['Room', 'Studio', 'Apartment', 'House'];

  static const districts = [
    'Gasabo',
    'Kicukiro',
    'Nyarugenge',
    'Musanze',
    'Huye',
    'Rubavu',
    'Rwamagana',
    'Other',
  ];

  static const amenities = [
    'Water',
    'Electricity',
    'Wi-Fi',
    'Parking',
    'Security',
    'Furnished',
    'Balcony',
    'Garden',
    'Kitchen',
    'Hot shower',
  ];

  static const paymentMethods = {
    'cash': 'Cash on delivery',
    'momo': 'Mobile Money on delivery',
  };
}
