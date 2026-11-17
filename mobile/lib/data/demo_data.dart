import 'models/app_user.dart';
import 'models/house.dart';
import 'models/product.dart';

/// Sample listings a new seller can load to try the app.
///
/// Photos come from loremflickr keyword searches, so they match the topic but
/// are not the exact item. Sellers can delete these listings at any time.
abstract final class DemoData {
  static String _img(String keyword, int lock) =>
      'https://loremflickr.com/900/700/$keyword?lock=$lock';

  static List<Product> products(AppUser seller) => [
        _p(seller, 'Samsung Galaxy A14, 128 GB', 'Phones', 'Like new', 165000, 3,
            'Kicukiro', 'smartphone',
            'Barely used for 4 months. Comes with the original charger, box and a protective case. Battery health is excellent and the screen has no scratches.',
            {'Brand': 'Samsung', 'Storage': '128 GB', 'RAM': '4 GB', 'Colour': 'Black', 'Warranty': 'None'}),
        _p(seller, 'Three-seater sofa, grey fabric', 'Furniture', 'Good', 120000, 1,
            'Gasabo', 'sofa',
            'Comfortable sofa in good condition. Removable washable covers. Selling because we are moving. Pick-up or delivery within Kigali can be arranged.',
            {'Material': 'Fabric', 'Seats': '3', 'Colour': 'Grey', 'Width': '210 cm'}),
        _p(seller, 'HP 15 laptop, Core i5, 8 GB RAM', 'Electronics', 'Good', 380000, 2,
            'Nyarugenge', 'laptop',
            'Reliable laptop for work or school. Fast SSD, fresh Windows install, charger included. Light signs of use on the lid only.',
            {'Brand': 'HP', 'Processor': 'Intel Core i5', 'RAM': '8 GB', 'Storage': '256 GB SSD', 'Screen': '15.6 inch'}),
        _p(seller, 'Gas cooker with 4 burners', 'Home & Kitchen', 'Good', 85000, 2,
            'Kicukiro', 'cooker',
            'Four-burner gas cooker with oven. All burners and the oven work perfectly. Hose and regulator included.',
            {'Burners': '4', 'Oven': 'Yes', 'Fuel': 'Gas', 'Colour': 'Silver'}),
        _p(seller, "Men's leather jacket, size L", 'Fashion', 'Like new', 45000, 1,
            'Gasabo', 'jacket',
            'Genuine leather jacket worn twice. Warm lining, two inside pockets, YKK zip. Too big for me so it needs a new owner.',
            {'Size': 'L', 'Material': 'Leather', 'Colour': 'Black', 'Gender': 'Men'}),
        _p(seller, 'Mountain bike, 26 inch', 'Sports', 'Good', 95000, 1,
            'Huye', 'bicycle',
            'Sturdy 21-speed mountain bike. New tyres and brake pads fitted last month. Perfect for daily commuting.',
            {'Wheel size': '26 inch', 'Gears': '21', 'Frame': 'Steel', 'Colour': 'Blue'}),
      ];

  static Product _p(
    AppUser s,
    String title,
    String category,
    String condition,
    int price,
    int stock,
    String location,
    String keyword,
    String description,
    Map<String, String> specs,
  ) {
    final lock = title.hashCode.abs() % 900;
    return Product(
      id: '',
      sellerId: s.uid,
      sellerName: s.name,
      title: title,
      description: description,
      price: price,
      category: category,
      condition: condition,
      images: [_img(keyword, lock), _img(keyword, lock + 1), _img(keyword, lock + 2)],
      specs: specs,
      stock: stock,
      location: location,
    );
  }

  static List<House> houses(AppUser owner) => [
        _h(owner, 'Modern studio near Kimironko market', 'Studio', 150000, 1, 1,
            28, 'Gasabo', 'Kimironko', 'studio,apartment',
            'Bright self-contained studio with tiled floors, a private bathroom and a small kitchen area. Five minutes from the market and the main taxi stage.',
            ['Water', 'Electricity', 'Security', 'Hot shower']),
        _h(owner, 'Two-bedroom house with garden', 'House', 420000, 2, 2, 95,
            'Kicukiro', 'Gikondo', 'house,garden',
            'Spacious family house in a quiet compound. Large living room, fitted kitchen, parking for two cars and a small garden.',
            ['Water', 'Electricity', 'Parking', 'Garden', 'Kitchen', 'Security']),
        _h(owner, 'Single room, shared compound', 'Room', 45000, 1, 1, 14,
            'Nyarugenge', 'Nyamirambo', 'bedroom,room',
            'Affordable room for one person in a friendly compound. Shared toilet and shower. Close to public transport.',
            ['Water', 'Electricity']),
        _h(owner, 'Furnished 3-bedroom apartment', 'Apartment', 650000, 3, 2,
            120, 'Gasabo', 'Kacyiru', 'apartment,livingroom',
            'Fully furnished apartment on the second floor with a balcony, fast Wi-Fi, 24-hour security and covered parking.',
            ['Furnished', 'Wi-Fi', 'Balcony', 'Parking', 'Security', 'Water', 'Electricity']),
      ];

  static House _h(
    AppUser o,
    String title,
    String type,
    int rent,
    int beds,
    int baths,
    int area,
    String district,
    String address,
    String keyword,
    String description,
    List<String> amenities,
  ) {
    final lock = title.hashCode.abs() % 900;
    return House(
      id: '',
      ownerId: o.uid,
      ownerName: o.name,
      ownerPhone: o.phone,
      title: title,
      description: description,
      pricePerMonth: rent,
      type: type,
      bedrooms: beds,
      bathrooms: baths,
      areaSqm: area,
      district: district,
      address: address,
      amenities: amenities,
      images: [_img(keyword, lock), _img(keyword, lock + 1), _img(keyword, lock + 2)],
    );
  }
}
