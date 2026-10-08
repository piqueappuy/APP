import 'package:flutter/material.dart';
import 'interface_text.dart';
import 'blue_home.dart';

const brand = Color(0xFF0055FF);
const ink = Color(0xFF0C123D);
const muted = Color(0xFF686D86);
const soft = Color(0xFFEEF3FF);
const background = Color(0xFFFFFFFF);
const categories = ['Sanitaria', 'Electricidad', 'Pintura', 'Limpieza', 'Carpintería', 'Jardinería', 'Mascotas', 'Otros servicios', 'Hogar', 'Mudanzas', 'Jardín', 'Reparaciones'];
const categoryIcons = [Icons.plumbing, Icons.bolt_outlined, Icons.format_paint_outlined, Icons.cleaning_services_outlined, Icons.chair_outlined, Icons.yard_outlined, Icons.pets_outlined, Icons.grid_view, Icons.home, Icons.local_shipping, Icons.eco, Icons.build];
const urgencies = ['Ahora', 'Hoy', 'Esta semana', 'Solo cotizar'];

void main() => runApp(const PiqueApp());

class Professional {
  final String id, name, initials, arrival, distance;
  final double rating;
  final int reviews, price, minutes, years;
  final bool verified;
  const Professional(this.id, this.name, this.initials, this.rating, this.reviews, this.price, this.minutes, this.arrival, this.distance, this.years, this.verified);
}

const professionals = [
  Professional('martin', 'Martín Rodríguez', 'MR', 4.9, 86, 1800, 40, '40–60 min', '1,2 km', 8, true),
  Professional('laura', 'Laura Fernández', 'LF', 5.0, 32, 2200, 90, '1 h 30 min', '2,4 km', 6, true),
  Professional('diego', 'Diego Pereira', 'DP', 4.7, 54, 1500, 180, '3 horas', '3,1 km', 5, false),
];

class ServiceOrder {
  final String id, category, description, zone, urgency;
  Professional? selected;
  Professional? assigned;
  final DateTime? createdAt;
  String get status => selected != null || assigned != null ? 'FINALIZADO' : 'PENDIENTE';
  ServiceOrder({required this.id, required this.category, required this.description, required this.zone, required this.urgency, this.createdAt});
}

class DemoStore extends ChangeNotifier {
  final List<ServiceOrder> orders = [ServiceOrder(id: 'ref-air', category: 'Hogar', description: 'Instalación de aire acondicionado', zone: 'Pocitos', urgency: 'Esta semana'), ServiceOrder(id: 'ejemplo', category: 'Sanitaria', description: 'Arreglar pérdida de agua en cocina', zone: 'Villa Biarritz', urgency: 'Hoy'), ServiceOrder(id: 'ref-pet', category: 'Mascotas', description: 'Cuidado de mascota por viaje', zone: 'Punta Carretas', urgency: 'Esta semana')];
  void add(ServiceOrder order) { orders.insert(0, order); notifyListeners(); }
  void select(ServiceOrder order, Professional person) { order.selected = person; notifyListeners(); }
}

String publicationDate(ServiceOrder order) {
  final date = order.createdAt?.toLocal();
  if (date == null) return 'FECHA NO REGISTRADA';
  String two(int value) => value.toString().padLeft(2, '0');
  return '${two(date.day)}/${two(date.month)}/${date.year} · ${two(date.hour)}:${two(date.minute)}';
}
String money(int price) => '\$ ${price ~/ 1000}.${(price % 1000).toString().padLeft(3, '0')}';
String scope(ServiceOrder order, Professional person) => order.category == 'Sanitaria' && person.id == 'laura' ? 'Visita, mano de obra y sellos estándar' : 'Visita y mano de obra';
String arrival(ServiceOrder order, Professional person) => switch (order.urgency) { 'Ahora' || 'Hoy' => 'En ${person.arrival}', 'Esta semana' => 'A coordinar esta semana', _ => 'A coordinar' };
List<Professional> sortedProfessionals(String sort) {
  final result = [...professionals];
  result.sort((a, b) => switch (sort) { 'price' => a.price.compareTo(b.price), 'rating' => b.rating.compareTo(a.rating), _ => a.minutes.compareTo(b.minutes) });
  return result;
}

class PiqueApp extends StatefulWidget {
  const PiqueApp({super.key});
  @override
  State<PiqueApp> createState() => _PiqueAppState();
}
class _PiqueAppState extends State<PiqueApp> {
  final store = DemoStore();
  @override
  void dispose() { store.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'PIQUE', debugShowCheckedModeBanner: false,
    theme: ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: brand, primary: brand, surface: Colors.white), scaffoldBackgroundColor: background,
      appBarTheme: const AppBarTheme(backgroundColor: Color(0xFF073DBC), foregroundColor: Colors.white, surfaceTintColor: Colors.transparent),
      inputDecorationTheme: InputDecorationTheme(filled: true, fillColor: background, border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
      filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)))),
      textTheme: const TextTheme(headlineLarge: TextStyle(fontSize: 34, fontWeight: FontWeight.w800, color: ink, letterSpacing: -1), headlineSmall: TextStyle(fontSize: 25, fontWeight: FontWeight.w700, color: ink), titleMedium: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: ink), bodyMedium: TextStyle(fontSize: 15, color: ink, height: 1.5))),
    home: HomeShell(store: store),
  );
}

class Surface extends StatelessWidget {
  final Widget child;
  final Color color;
  const Surface({super.key, required this.child, this.color = Colors.white});
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.all(22), decoration: BoxDecoration(color: color, border: Border.all(color: const Color(0xFFDFE6DF)), borderRadius: BorderRadius.circular(20)), child: child);
}
class Pill extends StatelessWidget {
  final String text;
  const Pill(this.text, {super.key});
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: soft, borderRadius: BorderRadius.circular(8)), child: PiqueText(text, style: const TextStyle(fontSize: 11, color: brand, fontWeight: FontWeight.w600)));
}
class PageContent extends StatelessWidget {
  final Widget child;
  const PageContent({super.key, required this.child});
  @override
  Widget build(BuildContext context) => SingleChildScrollView(child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 620), child: Padding(padding: EdgeInsets.all(MediaQuery.sizeOf(context).width < 600 ? 18 : 36), child: child))));
}
class PageTitle extends StatelessWidget {
  final String title, subtitle;
  const PageTitle(this.title, this.subtitle, {super.key});
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(bottom: 24), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText(title, style: Theme.of(context).textTheme.headlineLarge), const SizedBox(height: 10), PiqueText(subtitle, style: const TextStyle(color: muted))]));
}
class Detail extends StatelessWidget {
  final String label, value;
  const Detail(this.label, this.value, {super.key});
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.symmetric(vertical: 12), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText(label, style: const TextStyle(fontSize: 12, color: muted)), const SizedBox(height: 4), PiqueText(value)]));
}

class HomeShell extends StatefulWidget {
  final DemoStore store;
  const HomeShell({super.key, required this.store});
  @override
  State<HomeShell> createState() => _HomeShellState();
}
class _HomeShellState extends State<HomeShell> {
  int index = 0;
  final shell = GlobalKey<ScaffoldState>();
  Future<void> newOrder(String category, [String description = '']) async {
    final result = await Navigator.of(context).push<ServiceOrder>(MaterialPageRoute(builder: (_) => RequestPage(category: category, initialDescription: description)));
    if (result != null && mounted) { widget.store.add(result); openOrder(result); }
  }
  void openOrder(ServiceOrder order) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => ProposalsPage(store: widget.store, order: order)));
  void information(String title, String content) => showDialog<void>(context: context, builder: (context) => AlertDialog(title: PiqueText(title), content: PiqueText(content), actions: [TextButton(onPressed: () => Navigator.of(context).pop(), child: const PiqueText('Entendido'))]));
  @override
  Widget build(BuildContext context) => ListenableBuilder(listenable: widget.store, builder: (context, _) {
    return Scaffold(key: shell,
      appBar: index == 0 ? null : AppBar(title: const PiqueWordmark(size: 25)),
      drawer: Drawer(child: SafeArea(child: Column(children: [const ListTile(title: PiqueText('PIQUE', style: TextStyle(fontWeight: FontWeight.w800, color: brand, fontSize: 26))), for (final item in [(0, 'Inicio'), (5, 'Mis pedidos'), (1, 'Explorar rubros'), (4, 'Mi perfil')]) ListTile(title: PiqueText(item.$2), onTap: () { Navigator.of(context).pop(); setState(() => index = item.$1); })]))),
      body: index == 0 ? SafeArea(bottom: false, child: home(context)) : PageContent(child: index == 5 ? orders(context) : index == 1 ? explore(context) : index == 3 ? messages(context) : account(context)),
      bottomNavigationBar: SafeArea(top: false, child: Container(decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Color(0xFFF0F1F5)))), child: Row(children: [for (int i = 0; i < 5; i++) Expanded(child: InkWell(onTap: () { if (i == 2) { newOrder('Otros servicios'); } else { setState(() => index = i); } }, child: Padding(padding: const EdgeInsets.symmetric(vertical: 10), child: Column(mainAxisSize: MainAxisSize.min, children: [if (i == 2) const CircleAvatar(radius: 21, backgroundColor: brand, child: Icon(Icons.add, color: Colors.white, size: 30)) else SizedBox(height: 42, child: Icon([Icons.home_rounded, Icons.search, Icons.add, Icons.chat_bubble_outline, Icons.person_outline][i], color: index == i ? brand : muted, size: 28)), const SizedBox(height: 3), PiqueText(['INICIO','EXPLORAR','PUBLICAR','MENSAJES','PERFIL'][i], style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: index == i ? brand : muted))])))]))),
    );
  });
  Widget home(BuildContext context) => BlueHome(
    onPublish: (category) => newOrder(category),
    onMenu: () => shell.currentState?.openDrawer(),
    onNotifications: () => information('Notificaciones', 'Tenés propuestas de ejemplo para revisar. Podés encontrarlas en Mis pedidos.'),
    onExplore: () => setState(() => index = 1), onOrders: () => setState(() => index = 5),
    onVerification: () => information('Profesionales verificados', 'Los perfiles y las insignias de esta demo son ficticios. El proceso de verificación real todavía no está implementado.'),
    orders: widget.store.orders.take(3).map((o) => BlueOrderView(title: o.description, zone: o.zone, status: o.status, time: publicationDate(o), photo: o.id == 'ref-air' ? 'air' : o.id == 'ref-pet' ? 'pet' : o.id == 'ejemplo' ? 'water' : '', onTap: () => openOrder(o))).toList(),
  );
  Widget explore(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const PageTitle('Explorá por rubro', 'Elegí el servicio que necesitás.'), Wrap(spacing: 9, runSpacing: 9, children: categories.map((c) => ActionChip(label: PiqueText(c), onPressed: () => newOrder(c))).toList())]);
  Widget messages(BuildContext context) => const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PageTitle('Mensajes', 'Tus conversaciones, en un solo lugar.'), Surface(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(Icons.chat_bubble_outline, color: brand, size: 40), SizedBox(height: 16), PiqueText('Todavía no hay conversaciones'), SizedBox(height: 8), PiqueText('El chat con profesionales estará disponible cuando conectemos la aplicación. Por ahora podés probar pedidos y propuestas.', style: TextStyle(color: muted))]))]);
  Widget orderCard(ServiceOrder o) => Surface(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Pill(o.status), const SizedBox(height: 12), PiqueText(o.description, style: Theme.of(context).textTheme.titleMedium), PiqueText('${o.category} · 📍 ${o.zone}', style: const TextStyle(color: muted, fontSize: 13)), PiqueText('📅 CREADO: ${publicationDate(o)}', style: const TextStyle(color: muted, fontSize: 12)), if (o.selected != null) PiqueText('${o.selected!.name} · ${money(o.selected!.price)} UYU'), const SizedBox(height: 12), OutlinedButton(onPressed: () => openOrder(o), child: const PiqueText('Ver propuestas →'))]));
  Widget orders(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const PageTitle('Mis pedidos', 'Seguí tus pedidos y volvé a comparar las propuestas.'), FilledButton.icon(onPressed: () => newOrder('Otros servicios'), icon: const Icon(Icons.add), label: const PiqueText('Crear un pedido')), const SizedBox(height: 24), ...widget.store.orders.map((o) => Padding(padding: const EdgeInsets.only(bottom: 16), child: orderCard(o)))]);
  Widget account(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const PageTitle('Mi perfil', 'Estás explorando PIQUE como visitante.'), Surface(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const CircleAvatar(backgroundColor: soft, child: PiqueText('V')), const SizedBox(height: 14), PiqueText('Visitante de prueba', style: Theme.of(context).textTheme.titleMedium), const Detail('Modo actual', 'Usuario que busca servicios'), const Detail('Datos de esta versión Flutter', 'Guardados en memoria durante esta sesión.'), const PiqueText('Esta versión no incluye registro, pagos ni chat real. Los perfiles y las propuestas son ficticios.', style: TextStyle(color: muted))]))]);
}

class RequestPage extends StatefulWidget {
  final String category;
  final String initialDescription;
  const RequestPage({super.key, required this.category, this.initialDescription = ''});
  @override
  State<RequestPage> createState() => _RequestPageState();
}
class _RequestPageState extends State<RequestPage> {
  final form = GlobalKey<FormState>();
  late final description = TextEditingController(text: widget.initialDescription);
  final zone = TextEditingController();
  late String category = widget.category;
  String urgency = 'Hoy';
  int step = 0;
  @override
  void dispose() { description.dispose(); zone.dispose(); super.dispose(); }
  void next() {
    if (!form.currentState!.validate()) return;
    if (step < 2) { setState(() => step++); return; }
    Navigator.of(context).pop(ServiceOrder(id: DateTime.now().microsecondsSinceEpoch.toString(), category: category, description: description.text.trim(), zone: zone.text.trim(), urgency: urgency, createdAt: DateTime.now().toUtc()));
  }
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const PiqueText('Nuevo pedido')), body: PageContent(child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 700), child: Surface(child: Form(key: form, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    PiqueText('PASO ${step + 1} DE 3', style: const TextStyle(fontSize: 12, color: muted)), const SizedBox(height: 12), LinearProgressIndicator(value: (step + 1) / 3, backgroundColor: soft), const SizedBox(height: 28),
    if (step == 0) ...[PiqueText('Contanos qué necesitás.', style: Theme.of(context).textTheme.headlineSmall), const SizedBox(height: 20), DropdownButtonFormField<String>(initialValue: category, isExpanded: true, decoration: const InputDecoration(labelText: 'RUBRO'), items: categories.map((c) => DropdownMenuItem(value: c, child: PiqueText(c))).toList(), onChanged: (v) => category = v!), const SizedBox(height: 20), TextFormField(controller: description, key: const ValueKey('description'), decoration: const InputDecoration(labelText: '¿QUÉ HAY QUE RESOLVER?', hintText: 'POR EJEMPLO: PIERDE AGUA DEBAJO DE LA PILETA…', alignLabelWithHint: true), maxLines: 5, maxLength: 500, validator: (v) => (v?.trim().length ?? 0) < 10 ? 'ESCRIBÍ AL MENOS 10 CARACTERES.' : null)],
    if (step == 1) ...[PiqueText('¿Dónde y para cuándo?', style: Theme.of(context).textTheme.headlineSmall), const SizedBox(height: 20), TextFormField(controller: zone, key: const ValueKey('zone'), decoration: const InputDecoration(labelText: 'BARRIO O ZONA EN MONTEVIDEO', hintText: 'POR EJEMPLO: CORDÓN'), maxLength: 80, validator: (v) => (v?.trim().length ?? 0) < 2 ? 'INGRESÁ UN BARRIO O ZONA.' : null), const SizedBox(height: 20), const PiqueText('¿Cuándo lo necesitás?'), const SizedBox(height: 10), Wrap(spacing: 8, runSpacing: 8, children: urgencies.map((u) => ChoiceChip(label: PiqueText(u), selected: urgency == u, onSelected: (_) => setState(() => urgency = u))).toList())],
    if (step == 2) ...[PiqueText('Así van a ver tu pedido.', style: Theme.of(context).textTheme.headlineSmall), Detail('Rubro', category), Detail('Tu pedido', description.text), Detail('Zona', zone.text), Detail('Cuándo', urgency), const PiqueText('Al continuar se crearán tres propuestas ficticias. No se contactará a ningún profesional.', style: TextStyle(fontSize: 12, color: muted))],
    const SizedBox(height: 28), Wrap(spacing: 12, runSpacing: 12, children: [if (step > 0) OutlinedButton(onPressed: () => setState(() => step--), child: const PiqueText('Anterior')), FilledButton(onPressed: next, child: PiqueText(step == 2 ? 'Encontrar profesionales' : 'Continuar'))]),
  ])))))));
}

class ProposalsPage extends StatefulWidget {
  final DemoStore store;
  final ServiceOrder order;
  const ProposalsPage({super.key, required this.store, required this.order});
  @override
  State<ProposalsPage> createState() => _ProposalsPageState();
}
class _ProposalsPageState extends State<ProposalsPage> {
  String sort = 'time';
  void choose(Professional person) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => ChoosePage(store: widget.store, order: widget.order, person: person)));
  @override
  Widget build(BuildContext context) => ListenableBuilder(listenable: widget.store, builder: (context, _) => Scaffold(appBar: AppBar(title: const PiqueWordmark(size: 25), centerTitle: true, bottom: widget.order.status == 'PENDIENTE' ? const PreferredSize(preferredSize: Size.fromHeight(90), child: Padding(padding: EdgeInsets.fromLTRB(24, 12, 24, 24), child: PiqueText('TU SOLICITUD, UN PASO MÁS CERCA', textAlign: TextAlign.center, style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800, color: Colors.white)))) : null), body: PageContent(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Surface(color: soft, child: SizedBox(width: double.infinity, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText(widget.order.description, style: Theme.of(context).textTheme.titleMedium), const SizedBox(height: 12), Row(children: [Icon(categoryIcons[categories.indexOf(widget.order.category)], color: brand, size: 19), const SizedBox(width: 8), Expanded(child: PiqueText(widget.order.category)), Pill(widget.order.status == 'PENDIENTE' ? 'SIN COTIZAR' : widget.order.status)]), const SizedBox(height: 8), PiqueText('📍 ${widget.order.zone}, MONTEVIDEO'), const SizedBox(height: 8), PiqueText('📅 CREADO: ${publicationDate(widget.order)}')]))), const SizedBox(height: 20),
    Surface(child: Builder(builder: (context) { final visibleProfessionals = widget.order.status == 'FINALIZADO' ? [widget.order.selected ?? widget.order.assigned!].whereType<Professional>().toList() : sortedProfessionals(sort).where((p) => p.id != 'martin' || widget.order.category != 'Limpieza').toList(); final hasResults = visibleProfessionals.isNotEmpty; return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [if (widget.order.status == 'PENDIENTE' && hasResults) ...[const SizedBox(width: double.infinity, child: PiqueText('ENCONTRÁ TU MEJOR OPCIÓN', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700))), const SizedBox(height: 16),
    SizedBox(width: double.infinity, child: Row(children: [for (final item in [('time', 'Llega antes'), ('price', 'Menor precio'), ('rating', 'Mejor valoración')]) Expanded(child: Padding(padding: const EdgeInsets.symmetric(horizontal: 2), child: ChoiceChip(showCheckmark: false, label: Center(child: PiqueText(item.$2, style: const TextStyle(fontSize: 9))), selected: sort == item.$1, onSelected: (_) => setState(() => sort = item.$1))))])), const SizedBox(height: 20)] else if (widget.order.status == 'PENDIENTE' && !hasResults) ...[const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Row(children: [Icon(Icons.info_outline, color: brand, size: 20), SizedBox(width: 10), Expanded(child: PiqueText('AÚN NO ENCONTRAMOS PROFESIONALES QUE APLIQUEN PARA ESTA SOLICITUD', maxLines: 1, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF0C123D))))) ])), const SizedBox(height: 4)],
    LayoutBuilder(builder: (context, c) { if (!hasResults) return const SizedBox.shrink(); final width = c.maxWidth >= 850 ? (c.maxWidth - 32) / 3 : c.maxWidth; return Wrap(spacing: 16, runSpacing: 16, children: visibleProfessionals.map((p) => SizedBox(width: width, child: Surface(color: widget.order.status == 'FINALIZADO' ? soft : Colors.white, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [if (widget.order.status == 'FINALIZADO') Container(margin: const EdgeInsets.only(bottom: 16), padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: brand, borderRadius: BorderRadius.circular(8)), child: const PiqueText('✓ PROFESIONAL ELEGIDO', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800))), Row(crossAxisAlignment: CrossAxisAlignment.start, children: [Expanded(child: PersonHeader(person: p)), const SizedBox(width: 8), Container(padding: const EdgeInsets.only(left: 10), decoration: const BoxDecoration(border: Border(left: BorderSide(color: Color(0xFFCDD6E5)))), child: Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: const Color(0xFFDFF6E9), borderRadius: BorderRadius.circular(10)), child: PiqueText(money(p.price), style: const TextStyle(color: Color(0xFF087547), fontSize: 14, fontWeight: FontWeight.w800)))) ]), const SizedBox(height: 14), Wrap(spacing: 6, runSpacing: 6, children: (p.id == 'martin' ? ['Electricidad', 'Reparaciones'] : p.id == 'laura' ? ['Sanitaria', 'Hogar'] : ['Pintura', 'Carpintería']).map((trade) => Pill(trade)).toList()), const SizedBox(height: 10), ExpansionTile(tilePadding: EdgeInsets.zero, title: const PiqueText('Qué incluye y qué se cobra aparte', style: TextStyle(fontSize: 13)), children: [PiqueText('${scope(widget.order, p)}. Materiales adicionales sujetos a cotización y aprobación previa.', style: const TextStyle(fontSize: 12, color: muted))]), const SizedBox(height: 12), if (widget.order.status == 'PENDIENTE') SizedBox(width: double.infinity, child: FilledButton(onPressed: () => choose(p), child: PiqueText(widget.order.selected == p ? 'Ver selección' : 'Elegir a ${p.name.split(' ').first}'))), Center(child: TextButton(onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => ProfilePage(store: widget.store, order: widget.order, person: p))), child: const PiqueText('Ver perfil completo')))])))).toList()); })
    ]); }))
    ])),
  ]))));
}

class PersonHeader extends StatelessWidget {
  final Professional person;
  const PersonHeader({super.key, required this.person});
  @override
  Widget build(BuildContext context) => Row(children: [CircleAvatar(backgroundColor: soft, child: PiqueText(person.initials, style: const TextStyle(color: brand))), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText(person.name, style: Theme.of(context).textTheme.titleMedium), PiqueText('★ ${person.rating.toStringAsFixed(1)} · ${person.reviews} opiniones', style: const TextStyle(fontSize: 12, color: muted))]))]);
}

class ProfilePage extends StatefulWidget {
  final DemoStore store;
  final ServiceOrder order;
  final Professional person;
  const ProfilePage({super.key, required this.store, required this.order, required this.person});
  @override
  State<ProfilePage> createState() => _ProfilePageState();
}
class _ProfilePageState extends State<ProfilePage> {
  int tab = 0;
  @override
  Widget build(BuildContext context) {
    final p = widget.person;
    return Scaffold(appBar: AppBar(title: const PiqueText('Perfil del profesional')), body: PageContent(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Surface(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PersonHeader(person: p), const SizedBox(height: 18), PiqueText('${widget.order.category} · Montevideo'), PiqueText(p.verified ? '✓ Identidad verificada' : 'Identidad sin verificar', style: const TextStyle(color: brand)), Detail('Experiencia declarada', '${p.years} años'), Wrap(spacing: 8, children: [for (int i = 0; i < 3; i++) ChoiceChip(label: PiqueText(['Perfil', 'Trabajos', 'Opiniones'][i]), selected: tab == i, onSelected: (_) => setState(() => tab = i))]), const SizedBox(height: 20),
      if (tab == 0) ...[PiqueText('Sobre ${p.name.split(' ').first}', style: Theme.of(context).textTheme.titleMedium), PiqueText('Trabajo en ${widget.order.category.toLowerCase()} en Montevideo. Antes de empezar, revisamos qué necesitás y acordamos el alcance y el presupuesto.'), const Detail('Zona de trabajo', 'Cordón, Centro, Parque Rodó y Pocitos.'), const PiqueText('La verificación corresponde a su identidad. Perfil ficticio para esta demo.', style: TextStyle(fontSize: 12, color: muted))],
      if (tab == 1) ...[Detail('Trabajo de ejemplo · Agosto 2026', '${widget.order.category} a domicilio en Cordón'), Detail('Trabajo de ejemplo · Agosto 2026', 'Servicio de ${widget.order.category.toLowerCase()} en Centro'), const PiqueText('Sin fotografías en esta demo.', style: TextStyle(color: muted))],
      if (tab == 2) ...[const Detail('Lucía M. · ★ 5,0', 'Me explicó el trabajo y el costo antes de empezar. Dejó todo en orden.'), const Detail('Federico S. · ★ 4,0', 'El trabajo quedó bien. Llegó un poco más tarde, pero me avisó.'), const PiqueText('Opiniones ficticias para esta demostración.', style: TextStyle(fontSize: 12, color: muted))],
    ])), const SizedBox(height: 20), Surface(color: soft, child: SizedBox(width: double.infinity, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [PiqueText('Su propuesta para tu pedido', style: Theme.of(context).textTheme.titleMedium), PiqueText(widget.order.description), Detail('Precio propuesto', '${money(p.price)} UYU'), PiqueText(scope(widget.order, p)), Detail('Disponibilidad de ejemplo', arrival(widget.order, p)), const PiqueText('Los materiales adicionales se cotizan antes de empezar.', style: TextStyle(fontSize: 12, color: muted)), const SizedBox(height: 16), FilledButton(onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => ChoosePage(store: widget.store, order: widget.order, person: p))), child: PiqueText('Elegir a ${p.name.split(' ').first}'))])))])));
  }
}

class ChoosePage extends StatelessWidget {
  final DemoStore store;
  final ServiceOrder order;
  final Professional person;
  const ChoosePage({super.key, required this.store, required this.order, required this.person});
  @override
  Widget build(BuildContext context) => ListenableBuilder(listenable: store, builder: (context, _) {
    final selected = order.selected == person;
    return Scaffold(appBar: AppBar(title: const PiqueText('Tu elección')), body: PageContent(child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 660), child: Surface(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(selected ? Icons.check_circle_outline : Icons.arrow_outward, size: 52, color: brand), const SizedBox(height: 20), PageTitle(selected ? 'Elegiste a ${person.name.split(' ').first}.' : '¿Seguimos con ${person.name.split(' ').first}?', selected ? 'Selección guardada durante esta sesión.' : 'Revisá el alcance de la propuesta.'), Detail('Tu pedido', order.description), Detail('Profesional', person.name), Detail('Precio propuesto', '${money(person.price)} UYU'), Detail('Incluye', scope(order, person)), Detail('Disponibilidad', arrival(order, person)), const PiqueText('Esta selección es una simulación. No genera reserva, pago ni contacto real. Los materiales adicionales no están incluidos.', style: TextStyle(fontSize: 12, color: muted)), const SizedBox(height: 20), FilledButton(onPressed: selected ? () => Navigator.of(context).popUntil((r) => r.isFirst) : () => store.select(order, person), child: PiqueText(selected ? 'Volver al inicio' : 'Guardar elección de prueba'))]))))));
  });
}
