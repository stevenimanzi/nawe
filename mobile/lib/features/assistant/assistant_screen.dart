import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/net_image.dart';
import '../../data/models/house.dart';
import '../../data/models/product.dart';
import '../../data/repositories/house_repository.dart';
import '../../data/repositories/product_repository.dart';
import 'assistant_engine.dart';

class _Message {
  const _Message.user(this.text)
      : fromUser = true,
        reply = null;
  const _Message.bot(AssistantReply this.reply)
      : fromUser = false,
        text = '';

  final bool fromUser;
  final String text;
  final AssistantReply? reply;
}

const _suggestions = [
  'Phone under 150k',
  'Sofa or furniture',
  '2 bedroom house in Kicukiro',
  'Room under 80,000',
];

/// Chat-style helper that finds products and houses from a plain request.
class AssistantScreen extends ConsumerStatefulWidget {
  const AssistantScreen({super.key});

  @override
  ConsumerState<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends ConsumerState<AssistantScreen> {
  final _controller = TextEditingController();
  final _scroll = ScrollController();
  final _engine = const AssistantEngine();
  final _messages = <_Message>[
    const _Message.bot(AssistantReply(
      "Hi, I'm the NAWE assistant. Tell me what you need and your budget, "
      'and I will search products and houses for you.',
    )),
  ];

  @override
  void dispose() {
    _controller.dispose();
    _scroll.dispose();
    super.dispose();
  }

  void _send(String raw) {
    final message = raw.trim();
    if (message.isEmpty) return;
    final answer = _engine.reply(
      message,
      products: ref.read(productsProvider).value ?? const [],
      houses: ref.read(housesProvider).value ?? const [],
    );
    setState(() {
      _messages
        ..add(_Message.user(message))
        ..add(_Message.bot(answer));
    });
    _controller.clear();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(
          _scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(title: const Text('NAWE assistant')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (_, i) => _Bubble(_messages[i]),
            ),
          ),
          SizedBox(
            height: 46,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                for (final s in _suggestions)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      label: Text(s),
                      onPressed: () => _send(s),
                    ),
                  ),
              ],
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textInputAction: TextInputAction.send,
                      onSubmitted: _send,
                      decoration: const InputDecoration(
                        hintText: 'What are you looking for?',
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  IconButton.filled(
                    style: IconButton.styleFrom(
                      backgroundColor: scheme.onSurface,
                      foregroundColor: scheme.surface,
                      minimumSize: const Size(52, 52),
                    ),
                    onPressed: () => _send(_controller.text),
                    icon: const Icon(Icons.arrow_upward),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble(this.message);

  final _Message message;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    if (message.fromUser) {
      return Align(
        alignment: Alignment.centerRight,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12, left: 48),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: scheme.onSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(message.text, style: TextStyle(color: scheme.surface)),
        ),
      );
    }
    final reply = message.reply!;
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12, right: 24),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: scheme.surface,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(reply.text, style: const TextStyle(height: 1.45)),
            for (final p in reply.products) _ResultTile.product(p),
            for (final h in reply.houses) _ResultTile.house(h),
          ],
        ),
      ),
    );
  }
}

class _ResultTile extends StatelessWidget {
  _ResultTile.product(Product p)
      : image = p.cover,
        title = p.title,
        subtitle = '${p.condition}  ·  ${p.category}',
        price = formatRwf(p.price),
        route = '/product/${p.id}';

  _ResultTile.house(House h)
      : image = h.cover,
        title = h.title,
        subtitle = '${h.type}  ·  ${h.district}',
        price = '${formatRwf(h.pricePerMonth)} / month',
        route = '/house/${h.id}';

  final String image;
  final String title;
  final String subtitle;
  final String price;
  final String route;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => context.push(route),
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              SizedBox(
                  width: 60, height: 60, child: NetImage(image, radius: 12)),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                    Text(subtitle,
                        style: TextStyle(
                            fontSize: 12, color: scheme.onSurfaceVariant)),
                    Text(price,
                        style: TextStyle(
                            fontWeight: FontWeight.w800,
                            color: scheme.brightness == Brightness.dark
                                ? AppColors.actionHover
                                : AppColors.action)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }
}
