import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/utils/validators.dart';
import '../../core/widgets/common_widgets.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/support_repository.dart';

const _faqs = [
  (
    'How do I buy something?',
    'Open a product, choose a quantity and tap Add to cart or Buy now. At checkout enter your address and phone, then place the order. You pay the seller when you receive the items.',
  ),
  (
    'How do I rent a house?',
    'Open the Houses tab, choose a place and tap Call owner or WhatsApp to arrange a visit. Rent is agreed directly with the landlord.',
  ),
  (
    'How do I start selling?',
    'Go to Profile and tap Become a seller. Then use the Seller dashboard to add products or houses with photos and details.',
  ),
  (
    'Can I cancel an order?',
    'Yes, while the order is still pending. Open the order from My orders and tap Cancel order. After the seller confirms it, contact the seller.',
  ),
  (
    'I forgot my password',
    'On the sign-in screen tap Forgot password and we will email you a reset link.',
  ),
];

/// FAQ plus a form that sends a message to the NAWE team.
class SupportScreen extends ConsumerStatefulWidget {
  const SupportScreen({super.key});

  @override
  ConsumerState<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends ConsumerState<SupportScreen> {
  final _form = GlobalKey<FormState>();
  final _subject = TextEditingController();
  final _message = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    _subject.dispose();
    _message.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    if (!_form.currentState!.validate()) return;
    final user = ref.read(currentUserProvider).value;
    if (user == null) return;
    setState(() => _busy = true);
    try {
      await ref.read(supportRepositoryProvider).submit(
            user: user,
            subject: _subject.text,
            message: _message.text,
          );
      _subject.clear();
      _message.clear();
      if (mounted) {
        showMessage(context, 'Message sent. We will reply by email.');
      }
    } catch (_) {
      if (mounted) {
        showMessage(context, 'Could not send your message.', error: true);
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Help & support')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Frequently asked',
              style: text.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          for (final faq in _faqs)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                decoration: BoxDecoration(
                  color: scheme.surface,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Theme(
                  data: Theme.of(context)
                      .copyWith(dividerColor: Colors.transparent),
                  child: ExpansionTile(
                    title: Text(faq.$1,
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                    childrenPadding:
                        const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    expandedCrossAxisAlignment: CrossAxisAlignment.start,
                    children: [Text(faq.$2, style: const TextStyle(height: 1.5))],
                  ),
                ),
              ),
            ),
          const SizedBox(height: 24),
          Text('Still need help?',
              style: text.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text('Send us a message and the NAWE team will get back to you.',
              style: TextStyle(color: scheme.onSurfaceVariant)),
          const SizedBox(height: 14),
          Form(
            key: _form,
            child: Column(
              children: [
                TextFormField(
                  controller: _subject,
                  decoration: const InputDecoration(hintText: 'Subject'),
                  validator: (v) => Validators.required(v, 'Subject'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _message,
                  maxLines: 5,
                  decoration: const InputDecoration(
                      hintText: 'Tell us what happened'),
                  validator: (v) => Validators.required(v, 'Message'),
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: _busy ? null : _send,
                  child: const Text('Send message'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
