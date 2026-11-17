import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

/// Lets the user pick up to [max] photos from the gallery and remove them.
class PhotoPickerField extends StatelessWidget {
  const PhotoPickerField({
    super.key,
    required this.files,
    required this.onChanged,
    this.max = 6,
  });

  final List<File> files;
  final ValueChanged<List<File>> onChanged;
  final int max;

  Future<void> _pick() async {
    final remaining = max - files.length;
    if (remaining <= 0) return;
    final picked = await ImagePicker().pickMultiImage(
      limit: remaining,
      maxWidth: 1600,
      imageQuality: 82,
    );
    if (picked.isEmpty) return;
    onChanged([...files, ...picked.take(remaining).map((x) => File(x.path))]);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SizedBox(
      height: 96,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          if (files.length < max)
            InkWell(
              borderRadius: BorderRadius.circular(18),
              onTap: _pick,
              child: Container(
                width: 96,
                decoration: BoxDecoration(
                  color: scheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.add_a_photo_outlined),
                    const SizedBox(height: 4),
                    Text('${files.length}/$max',
                        style: TextStyle(
                            fontSize: 12, color: scheme.onSurfaceVariant)),
                  ],
                ),
              ),
            ),
          for (var i = 0; i < files.length; i++)
            Padding(
              padding: const EdgeInsets.only(left: 10),
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(18),
                    child: Image.file(files[i],
                        width: 96, height: 96, fit: BoxFit.cover),
                  ),
                  Positioned(
                    top: 4,
                    right: 4,
                    child: GestureDetector(
                      onTap: () => onChanged([...files]..removeAt(i)),
                      child: const CircleAvatar(
                        radius: 11,
                        backgroundColor: Colors.black54,
                        child: Icon(Icons.close, size: 14, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
