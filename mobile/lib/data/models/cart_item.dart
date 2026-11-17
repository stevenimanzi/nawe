import 'product.dart';

/// A product in the user's cart with the chosen quantity.
class CartItem {
  const CartItem({required this.product, required this.quantity});

  final Product product;
  final int quantity;

  int get lineTotal => product.price * quantity;
}
