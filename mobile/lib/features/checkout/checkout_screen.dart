import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/catalog.dart';
import '../../core/utils/formatters.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/net_image.dart';
import '../../core/widgets/state_views.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/cart_repository.dart';
import '../../data/repositories/order_repository.dart';

/// Delivery details, payment choice and order summary.
class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _form = GlobalKey<FormState>();
  final _address = TextEditingController();
  final _phone = TextEditingController();
  String _payment = Catalog.paymentMethods.keys.first;
  bool _busy = false;
  bool _prefilled = false;

  @override
  void dispose() {
    _address.dispose();
    _phone.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    if (!_form.currentState!.validate()) return;
    final user = ref.read(currentUserProvider).value;
    final items = ref.read(cartProvider).value ?? const [];
    if (user == null || items.isEmpty) return;

    setState(() => _busy = true);
    try {
      final id = await ref.read(orderRepositoryProvider).place(
            buyer: user,
            items: items,
            address: _address.text.trim(),
            phone: _phone.text.trim(),
            paymentMethod: _payment,
          );
      // Remember the delivery details for next time.
      await ref.read(authRepositoryProvider).updateProfile(
            user.uid,
            phone: _phone.text,
            address: _address.text,
          );
      if (mounted) {
        showMessage(context, 'Order placed. The seller has been notified.');
        context.go('/order/$id');
      }
    } on StateError catch (e) {
      if (mounted) showMessage(context, e.message, error: true);
    } catch (_) {
      if (mounted) {
        showMessage(context, 'Could not place your order. Please try again.',
            error: true);
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final items = ref.watch(cartProvider);
    final total = ref.watch(cartTotalProvider);
    final user = ref.watch(currentUserProvider).value;
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;

    if (!_prefilled && user != null) {
      _prefilled = true;
      _address.text = user.address;
      _phone.text = user.phone;
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: items.when(
        loading: () => const LoadingView(),
        error: (e, _) => const ErrorView(),
        data: (list) {
          if (list.isEmpty) {
            return EmptyView(
              icon: Icons.shopping_bag_outlined,
              title: 'Nothing to check out',
              actionLabel: 'Back to shop',
              onAction: () => context.go('/home'),
            );
          }
          return Form(
            key: _form,
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text('Delivery details',
                    style: text.titleMedium
                        ?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _address,
                  textCapitalization: TextCapitalization.sentences,
                  decoration: const InputDecoration(
                    hintText: 'Delivery address (district, sector, street)',
                    prefixIcon: Icon(Icons.place_outlined),
                  ),
                  validator: (v) => Validators.required(v, 'Address'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    hintText: 'Phone number',
                    prefixIcon: Icon(Icons.phone_outlined),
                  ),
                  validator: Validators.phone,
                ),
                const SizedBox(height: 24),
                Text('Payment',
                    style: text.titleMedium
                        ?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                RadioGroup<String>(
                  groupValue: _payment,
                  onChanged: (v) => setState(() => _payment = v ?? _payment),
                  child: Column(
                    children: [
                      for (final e in Catalog.paymentMethods.entries)
                        RadioListTile<String>(
                          contentPadding: EdgeInsets.zero,
                          value: e.key,
                          title: Text(e.value),
                        ),
                    ],
                  ),
                ),
                Text(
                  'You pay the seller when you receive your items. '
                  'Online card payment is not available yet.',
                  style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
                ),
                const SizedBox(height: 24),
                Text('Order summary',
                    style: text.titleMedium
                        ?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                for (final item in list)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 52,
                          height: 52,
                          child: NetImage(item.image, radius: 12),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text('${item.quantity} × ${item.title}',
                              maxLines: 2, overflow: TextOverflow.ellipsis),
                        ),
                        Text(formatRwf(item.lineTotal),
                            style:
                                const TextStyle(fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                const Divider(height: 28),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total',
                        style: TextStyle(fontWeight: FontWeight.w700)),
                    Text(formatRwf(total),
                        style: text.titleLarge
                            ?.copyWith(fontWeight: FontWeight.w800)),
                  ],
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: _busy ? null : _placeOrder,
                  child: _busy
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(strokeWidth: 2.5))
                      : const Text('Place order'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
