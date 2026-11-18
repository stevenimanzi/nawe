import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/catalog.dart';
import '../../core/utils/photo_encoder.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/photo_picker_field.dart';
import '../../data/models/house.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/house_repository.dart';

/// Form for a landlord to publish a room, studio, apartment or house.
class AddHouseScreen extends ConsumerStatefulWidget {
  const AddHouseScreen({super.key});

  @override
  ConsumerState<AddHouseScreen> createState() => _AddHouseScreenState();
}

class _AddHouseScreenState extends ConsumerState<AddHouseScreen> {
  final _form = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _price = TextEditingController();
  final _bedrooms = TextEditingController(text: '1');
  final _bathrooms = TextEditingController(text: '1');
  final _area = TextEditingController();
  final _address = TextEditingController();
  final _description = TextEditingController();
  String _type = Catalog.houseTypes[1];
  String _district = Catalog.districts.first;
  final _amenities = <String>{};
  List<File> _photos = [];
  bool _busy = false;

  @override
  void dispose() {
    for (final c in [
      _title, _price, _bedrooms, _bathrooms, _area, _address, _description,
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
      await ref.read(houseRepositoryProvider).create(House(
            id: '',
            ownerId: user.uid,
            ownerName: user.name,
            ownerPhone: user.phone,
            title: _title.text.trim(),
            description: _description.text.trim(),
            pricePerMonth: int.parse(_price.text.replaceAll(',', '').trim()),
            type: _type,
            bedrooms: int.parse(_bedrooms.text.trim()),
            bathrooms: int.parse(_bathrooms.text.trim()),
            areaSqm: int.parse(_area.text.trim()),
            district: _district,
            address: _address.text.trim(),
            amenities: _amenities.toList(),
            images: const [],
            thumb: photos.thumb,
            photoCount: photos.full.length,
          ), photos: photos.full);
      if (mounted) {
        showMessage(context, 'Your house is live.');
        context.pop();
      }
    } catch (_) {
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
      appBar: AppBar(title: const Text('Add house')),
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
              decoration: const InputDecoration(
                  hintText: 'Title, e.g. Modern studio in Kimironko'),
              validator: (v) => Validators.required(v, 'Title'),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _type,
              decoration: const InputDecoration(hintText: 'Type'),
              items: [
                for (final t in Catalog.houseTypes)
                  DropdownMenuItem(value: t, child: Text(t)),
              ],
              onChanged: (v) => setState(() => _type = v ?? _type),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _district,
              decoration: const InputDecoration(hintText: 'District'),
              items: [
                for (final d in Catalog.districts)
                  DropdownMenuItem(value: d, child: Text(d)),
              ],
              onChanged: (v) => setState(() => _district = v ?? _district),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _address,
              decoration: const InputDecoration(
                hintText: 'Sector / street',
                prefixIcon: Icon(Icons.place_outlined),
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _price,
              keyboardType: TextInputType.number,
              decoration:
                  const InputDecoration(hintText: 'Rent per month (RWF)'),
              validator: (v) => Validators.positiveInt(v, 'Rent'),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _bedrooms,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(hintText: 'Bedrooms'),
                    validator: (v) => Validators.positiveInt(v, 'Bedrooms'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextFormField(
                    controller: _bathrooms,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(hintText: 'Baths'),
                    validator: (v) => Validators.positiveInt(v, 'Baths'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextFormField(
                    controller: _area,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(hintText: 'Size m²'),
                    validator: (v) => Validators.positiveInt(v, 'Size'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _description,
              maxLines: 5,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(
                hintText: 'Describe the place, neighbourhood and rules',
              ),
              validator: (v) => Validators.required(v, 'Description'),
            ),
            const SizedBox(height: 20),
            Text('Amenities',
                style: text.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final a in Catalog.amenities)
                  FilterChip(
                    label: Text(a),
                    selected: _amenities.contains(a),
                    showCheckmark: true,
                    onSelected: (on) => setState(
                        () => on ? _amenities.add(a) : _amenities.remove(a)),
                  ),
              ],
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _busy ? null : _publish,
              child: _busy
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(strokeWidth: 2.5))
                  : const Text('Publish house'),
            ),
          ],
        ),
      ),
    );
  }
}
