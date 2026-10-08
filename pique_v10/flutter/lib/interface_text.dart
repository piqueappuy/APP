import 'package:flutter/material.dart';

/// Displays interface copy in uppercase while preserving stored data.
class PiqueText extends StatelessWidget {
  final String data;
  final TextStyle? style;
  final TextAlign? textAlign;
  const PiqueText(this.data, {super.key, this.style, this.textAlign});

  @override
  Widget build(BuildContext context) => Text(
    data.toUpperCase(),
    style: style,
    textAlign: textAlign,
  );
}
