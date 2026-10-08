import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pique/main.dart';

void main() {
  test('Sorting preserves providers and orders by price and rating', () {
    expect(sortedProfessionals('price').map((p) => p.id), ['diego', 'martin', 'laura']);
    expect(sortedProfessionals('rating').first.id, 'laura');
    expect(professionals.first.id, 'martin');
  });
  test('Selection belongs to its order only', () {
    final store = DemoStore();
    final second = ServiceOrder(id: '2', category: 'Pintura', description: 'Pintar una pared', zone: 'Centro', urgency: 'Esta semana');
    store.add(second);
    store.select(second, professionals[1]);
    expect(second.selected, professionals[1]);
    expect(store.orders.last.selected, isNull);
    expect(arrival(second, professionals[1]), 'A coordinar esta semana');
    store.dispose();
  });
  testWidgets('Request validates and returns the entered data', (tester) async {
    ServiceOrder? submitted;
    await tester.pumpWidget(MaterialApp(home: Builder(builder: (context) => Scaffold(body: FilledButton(onPressed: () async { submitted = await Navigator.of(context).push<ServiceOrder>(MaterialPageRoute(builder: (_) => const RequestPage(category: 'Electricidad'))); }, child: const Text('Abrir'))))));
    await tester.tap(find.text('Abrir'));
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('CONTINUAR'));
    await tester.tap(find.text('CONTINUAR'));
    await tester.pumpAndSettle();
    expect(find.text('ESCRIBÍ AL MENOS 10 CARACTERES.'), findsOneWidget);
    await tester.enterText(find.byKey(const ValueKey('description')), 'Instalar dos lámparas');
    await tester.ensureVisible(find.text('CONTINUAR'));
    await tester.tap(find.text('CONTINUAR'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const ValueKey('zone')), 'Cordón');
    await tester.ensureVisible(find.text('CONTINUAR'));
    await tester.tap(find.text('CONTINUAR'));
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('ENCONTRAR PROFESIONALES'));
    await tester.tap(find.text('ENCONTRAR PROFESIONALES'));
    await tester.pumpAndSettle();
    expect(submitted?.category, 'Electricidad');
    expect(submitted?.description, 'Instalar dos lámparas');
    expect(submitted?.zone, 'Cordón');
  });
}
