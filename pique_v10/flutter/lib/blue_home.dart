import 'package:flutter/material.dart';
import 'interface_text.dart';

const piqueBlue = Color(0xFF0055FF);
const piqueInk = Color(0xFF0C123D);

class BlueOrderView {
  final String title, zone, status, time, photo;
  final VoidCallback onTap;
  const BlueOrderView({required this.title, required this.zone, required this.status, required this.time, required this.onTap, this.photo = ''});
}

class PiqueWordmark extends StatelessWidget {
  final double size;
  const PiqueWordmark({super.key, this.size = 34});
  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [
    CustomPaint(size: Size(size, size * 1.25), painter: _PiqueMark()),
    const SizedBox(width: 7),
    PiqueText('PIQUE', style: TextStyle(color: Colors.white, fontSize: size, fontWeight: FontWeight.w800, letterSpacing: -1)),
  ]);
}

class _PiqueMark extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 50, size.height / 65);
    final p = Path()..moveTo(3, 60)..lineTo(3, 27)..cubicTo(3, 12, 13, 2, 26, 2)..cubicTo(39, 2, 49, 12, 49, 26)..cubicTo(49, 40, 39, 50, 25, 50)..lineTo(17, 50)..lineTo(7, 63)..quadraticBezierTo(3, 66, 3, 60)..close();
    canvas.drawPath(p, Paint()..color = Colors.white);
    canvas.drawPath(Path()..moveTo(18, 27)..lineTo(25, 34)..lineTo(37, 21), Paint()..color = const Color(0xFF093CBC)..style = PaintingStyle.stroke..strokeWidth = 6);
    canvas.restore();
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class BlueHome extends StatefulWidget {
  final void Function(String category) onPublish;
  final VoidCallback onMenu, onNotifications, onExplore, onOrders, onVerification;
  final List<BlueOrderView> orders;
  const BlueHome({super.key, required this.onPublish, required this.onMenu, required this.onNotifications, required this.onExplore, required this.onOrders, required this.onVerification, required this.orders});
  @override
  State<BlueHome> createState() => _BlueHomeState();
}

class _BlueHomeState extends State<BlueHome> {
  static const rubrics = [
    ('Hogar', Icons.home_rounded, Color(0xFF0044DC), Color(0xFFE6F0FF)),
    ('Mascotas', Icons.pets, Color(0xFF00B58A), Color(0xFFE3F7F0)),
    ('Limpieza', Icons.cleaning_services, Color(0xFFFF641B), Color(0xFFFFEADF)),
    ('Mudanzas', Icons.local_shipping, Color(0xFF883AFF), Color(0xFFF0E5FF)),
    ('Jardín', Icons.eco, Color(0xFF00B58A), Color(0xFFE3F7F0)),
    ('Reparaciones', Icons.build, Color(0xFFFFAC00), Color(0xFFFFF3DD)),
    ('Pintura', Icons.format_paint, Color(0xFFFF4F79), Color(0xFFFFE8EE)),
    ('Ver todos', Icons.grid_view_rounded, Color(0xFF73788D), Color(0xFFF3F3F5)),
  ];
  @override
  Widget build(BuildContext context) => SingleChildScrollView(child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 540), child: Column(children: [
    Container(width: double.infinity, padding: const EdgeInsets.fromLTRB(24, 20, 24, 35), decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF0634B0), Color(0xFF005BF0)])), child: Column(children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [IconButton(onPressed: widget.onMenu, icon: const Icon(Icons.menu, color: Colors.white, size: 28), tooltip: 'ABRIR MENÚ'), const PiqueWordmark(size: 32), IconButton(onPressed: widget.onNotifications, tooltip: 'NOTIFICACIONES', icon: const Badge(label: PiqueText('2'), child: Icon(Icons.notifications_none, color: Colors.white, size: 28)))]),
      const SizedBox(height: 25),
      const FittedBox(fit: BoxFit.scaleDown, child: PiqueText('¿QUÉ PRECISÁS RESOLVER HOY?', style: TextStyle(color: Colors.white, fontSize: 21, fontWeight: FontWeight.w800))),
      const SizedBox(height: 23),
      Material(color: const Color(0xFFFFFFFF), borderRadius: BorderRadius.circular(16), child: InkWell(onTap: () => widget.onPublish('Otros servicios'), borderRadius: BorderRadius.circular(16), child: Padding(padding: const EdgeInsets.all(18), child: Row(children: [const CircleAvatar(radius: 25, backgroundColor: piqueBlue, child: Icon(Icons.add, color: Colors.white, size: 34)), const SizedBox(width: 16), const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText('PUBLICAR PEDIDO', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800)), SizedBox(height: 6), PiqueText('Contanos qué necesitás\ny recibí propuestas\nde profesionales verificados.', style: TextStyle(fontSize: 12, height: 1.45))])), const Icon(Icons.chevron_right, color: piqueBlue)]))))
    ])),
    Container(width: double.infinity, padding: const EdgeInsets.fromLTRB(20, 24, 20, 20), decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(22))), child: Column(children: [
      _section('EXPLORÁ POR RUBRO', widget.onExplore),
      LayoutBuilder(builder: (context, c) { final width = (c.maxWidth - 27) / 4; return Wrap(spacing: 9, runSpacing: 11, children: rubrics.map((r) => SizedBox(width: width, height: width * 1.06, child: Material(color: Colors.white, elevation: 2, shadowColor: const Color(0x180C123D), borderRadius: BorderRadius.circular(14), child: InkWell(borderRadius: BorderRadius.circular(14), onTap: r.$1 == 'Ver todos' ? widget.onExplore : () => widget.onPublish(r.$1), child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Container(width: width * .56, height: width * .56, decoration: BoxDecoration(color: r.$4, shape: BoxShape.circle), child: Icon(r.$2, color: r.$3, size: width * .36)), const SizedBox(height: 10), Padding(padding: const EdgeInsets.symmetric(horizontal: 3), child: FittedBox(child: PiqueText(r.$1.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: piqueInk))))]))))).toList()); }),
      const SizedBox(height: 23),
      const SizedBox(height: 25),
      _section('MIS PEDIDOS', widget.onOrders),
      Container(padding: const EdgeInsets.symmetric(horizontal: 10), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15), border: Border.all(color: const Color(0xFFF0F1F5)), boxShadow: const [BoxShadow(color: Color(0x100C123D), blurRadius: 12, offset: Offset(0, 3))]), child: Column(children: [for (int i = 0; i < widget.orders.length; i++) ...[if (i > 0) const Divider(height: 1), _order(widget.orders[i])]])),
      const SizedBox(height: 18),
      Material(color: const Color(0xFFEEF3FF), borderRadius: BorderRadius.circular(15), child: InkWell(onTap: widget.onVerification, child: Padding(padding: const EdgeInsets.all(16), child: Row(children: [const Icon(Icons.verified_user, color: piqueBlue, size: 39), const SizedBox(width: 12), const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText('PROFESIONALES VERIFICADOS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)), SizedBox(height: 5), PiqueText('Trabajá tranquilo, todos pasan por nuestro proceso de verificación.', style: TextStyle(fontSize: 10))])), const SizedBox(width: 8), const Icon(Icons.chevron_right, color: piqueBlue)])))),
      const SizedBox(height: 18), const PiqueText('Vista de prueba · Datos y profesionales ficticios', style: TextStyle(fontSize: 10, color: Color(0xFF85899E))),
    ])),
  ]))));
  Widget _section(String title, VoidCallback onAll) => Padding(padding: const EdgeInsets.only(bottom: 15), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [PiqueText(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)), TextButton(onPressed: onAll, child: const Row(mainAxisSize: MainAxisSize.min, children: [PiqueText('VER TODOS', style: TextStyle(fontSize: 10)), Icon(Icons.chevron_right, size: 15)]))]));
  Widget _order(BlueOrderView o) => InkWell(onTap: o.onTap, child: Padding(padding: const EdgeInsets.symmetric(vertical: 10), child: Row(children: [
    ReferenceThumbnail(photo: o.photo), const SizedBox(width: 10), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText(o.title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, height: 1.3)), const SizedBox(height: 5), PiqueText('📍 ${o.zone}, Montevideo', style: const TextStyle(fontSize: 10, color: Color(0xFF686D86))), const SizedBox(height: 3), PiqueText('📅 ${o.time}', style: const TextStyle(fontSize: 10, color: Color(0xFF686D86)))])), const SizedBox(width: 8), Column(children: [Container(padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 5), decoration: BoxDecoration(color: o.status == 'PENDIENTE' ? const Color(0xFFFFF3DF) : o.status == 'FINALIZADO' ? const Color(0xFFEFEFF3) : const Color(0xFFE3F7F1), borderRadius: BorderRadius.circular(12)), child: PiqueText(o.status == 'PENDIENTE' ? 'SIN COTIZAR' : o.status, style: TextStyle(fontSize: 8, fontWeight: FontWeight.w700, color: o.status == 'PENDIENTE' ? const Color(0xFFF19500) : o.status == 'FINALIZADO' ? const Color(0xFF646B82) : const Color(0xFF00A77C)))), ]), const Icon(Icons.chevron_right, size: 16, color: Color(0xFF686D86)),
  ])));
}

class ReferenceThumbnail extends StatelessWidget {
  final String photo;
  const ReferenceThumbnail({super.key, required this.photo});
  @override
  Widget build(BuildContext context) {
    if (photo.isEmpty) return Container(width: 51, height: 48, decoration: BoxDecoration(color: const Color(0xFFEEF3FF), borderRadius: BorderRadius.circular(8)), child: const Icon(Icons.handyman_outlined, color: piqueBlue));
    final y = switch (photo) { 'air' => 612.51, 'water' => 672.18, _ => 732.36 };
    return SizedBox(width: 51, height: 48, child: ClipRRect(borderRadius: BorderRadius.circular(8), child: OverflowBox(alignment: Alignment.topLeft, maxWidth: 435.03, maxHeight: 940.44, child: Transform.translate(offset: Offset(-29.07, -y), child: Image.asset('assets/design-reference.png', width: 435.03, height: 940.44, fit: BoxFit.fill)))));
  }
}
