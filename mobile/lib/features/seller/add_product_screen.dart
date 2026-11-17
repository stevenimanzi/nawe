import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/catalog.dart';
import '../../core/utils/photo_encoder.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/photo_picker_field.dart';
import '../../data/models/product.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/product_repository.dart';

/// Form for a seller to publish a new product.
class AddProductScreen extends ConsumerStatefulWidget {
  const AddProductScreen({super.key});

  @override
  ConsumerState<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends ConsumerState<AddProductScreen> {
  final _form = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _price = TextEditingController();
  final _stock = TextEditingController(text: '1');
  final _location = TextEditingController();
  final _description = TextEditingController();
  final _specKeys = <TextEditingController>[TextEditingController()];
  final _specValues = <TextEditingController>[TextEditingController()];
  String _category = Catalog.productCategories.first;
  String _condition = Catalog.conditions[2];
  List<File> _photos = [];
  bool _busy = false;

  @override
  void dispose() {
    for (final c in [
      _title, _price, _stock, _location, _description,
      ..._specKeys, ..._specValues,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _publish() async {
    if (!_form.currentState!.validate()) return;
    if (_photos.isEmpty) {
      showMessage(context, 'Add at least one photo.', error: true);
      return;
    }
    final user = ref.read(currentUserProvider).value;
    if (user == null) return;

    setState(() => _busy = true);
    try {
      final photos = await PhotoEncoder.encode(_photos);
      final specs = <String, String>{};
      for (var i = 0; i < _specKeys.length; i++) {
        final k = _specKeys[i].text.trim();
        final v = _specValues[i].text.trim();
        if (k.isNotEmpty && v.isNotEmpty) specs[k] = v;
      }
      await ref.read(productRepositoryProvider).create(Product(
            id: '',
            sellerId: user.uid,
            sellerName: user.name,
            title: _title.text.trim(),
            description: _description.text.trim(),
            price: int.parse(_price.text.replaceAll(',', '').trim()),
            category: _category,
            condition: _condition,
            images: const [],
            thumb: photos.thumb,
            photoCount: photos.full.length,
            specs: specs,
            stock: int.parse(_stock.text.trim()),
            location: _location.text.trim(),
          ), photos: photos.full);
      if (mounted) {
        showMessage(context, 'Your product is live.');
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        showMessage(
          context,
          'Could not publish. Check your connection and try again.',
          error: true,
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Add product')),
      body: Form(
        key: _form,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Photos',
                style: text.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 10),
            PhotoPickerField(
              files: _photos,
              onChanged: (f) => setState(() => _photos = f),
            ),
            const SizedBox(height: 22),
            TextFormField(
              controller: _title,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(hintText: 'Title'),
              validator: (v) => Validators.required(v, 'Title'),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _category,
              decoration: const InputDecoration(hintText: 'Category'),
              items: [
                for (final c in Catalog.productCategories)
                  DropdownMenuItem(value: c, child: Text(c)),
              ],
              onChanged: (v) => setState(() => _category = v ?? _category),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _condition,
              decoration: const InputDecoration(hintText: 'Condition'),
              items: [
                for (final c in Catalog.conditions)
                  DropdownMenuItem(value: c, child: Text(c)),
              ],
              onChanged: (v) => setState(() => _condition = v ?? _condition),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: TextFormField(
                    controller: _price,
                    keyboardType: TextInputType.number,
                    decoration:
                        const InputDecoration(hintText: 'Price (RWF)'),
                    validator: (v) => Validators.positiveInt(v, 'Price'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: TextFormField(
                    controller: _stock,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(hintText: 'Stock'),
                    validator: (v) => Validators.positiveInt(v, 'Stock'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _location,
              decoration: const InputDecoration(
                hintText: 'Location (e.g. Kicukiro, Gikondo)',
                prefixIcon: Icon(Icons.place_outlined),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _description,
              maxLines: 5,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(
                hintText: 'Describe the item: size, age, what is included...',
              ),
              validator: (v) => Validators.required(v, 'Description'),
            ),
            const SizedBox(height: 22),
            Row(
              children: [
                Expanded(
                  child: Text('Details table (optional)',
                      style: text.titleSmall
                          ?.copyWith(fontWeight: FontWeight.w800)),
                ),
                TextButton.icon(
                  onPressed: () => setState(() {
                    _specKeys.add(TextEditingController());
                    _specValues.add(TextEditingController());
                  }),
                  icon: const Icon(Icons.add),
                  label: const Text('Add row'),
                ),
              ],
            ),
            for (var i = 0; i < _specKeys.length; i++)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _specKeys[i],
                        decoration:
                            const InputDecoration(hintText: 'e.g. Brand'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: _specValues[i],
                        decoration:
                            const InputDecoration(hintText: 'e.g. Samsung'),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: _busy ? null : _publish,
              child: _busy
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(strokeWidth: 2.5))
                  : const Text('Publish product'),
            ),
          ],
        ),
      ),
    );
  }
}
