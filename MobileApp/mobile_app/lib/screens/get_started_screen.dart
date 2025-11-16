import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class GetStartedScreen extends StatelessWidget {
  const GetStartedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    final maxWidth = mq.size.width;
    return Scaffold(
      body: Stack(
        children: [
          // background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
                colors: [
                  Color(0xFF0D122B),
                  Color(0xFF0D122B),
                  Color(0x001A202C),
                ],
                stops: [0.0, 0.6, 1.0],
              ),
            ),
          ),
          // ripple circles
          Positioned.fill(
            child: Stack(
              children: const [
                _Ripple(delay: Duration(seconds: 0)),
                _Ripple(delay: Duration(seconds: 1)),
                _Ripple(delay: Duration(seconds: 2)),
                _Ripple(delay: Duration(seconds: 3)),
              ],
            ),
          ),
          // content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
              child: Column(
                children: [
                  // header
                  Row(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF4444),
                          shape: BoxShape.circle,
                        ),
                        padding: const EdgeInsets.all(6),
                        child: const Icon(Icons.emergency, color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 10),
                      Text('SafeNet',
                          style: GoogleFonts.inter(
                              fontWeight: FontWeight.w700, fontSize: 18, color: Colors.white)),
                    ],
                  ),
                  const Spacer(),
                  // main texts
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        'Collective\nAwareness\nfor Safer Roads.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: mq.size.width < 360 ? 34 : 40,
                          height: 1.02,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 18),
                      SizedBox(
                        width: maxWidth * 0.8,
                        child: Text(
                          'Join the V2X safety mesh. Receive real-time alerts on driving risks and help create a safer driving environment for everyone.',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            color: const Color(0xFFBFC7D6),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      const SizedBox(height: 36),
                      // CTA
                      SizedBox(
                        width: 320,
                        child: ElevatedButton(
                          onPressed: () {
                            // navigate to profile setup later
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEF4444),
                            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(40),
                            ),
                            elevation: 12,
                            shadowColor: Colors.red.withOpacity(0.45),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Get Started',
                                style: GoogleFonts.inter(
                                    fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                              ),
                              const SizedBox(width: 10),
                              const Icon(Icons.arrow_forward, size: 20),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: () {},
                        child: Text.rich(
                          TextSpan(
                            text: 'Already have an account? ',
                            style: GoogleFonts.inter(color: const Color(0xFF9AA3B6)),
                            children: [
                              TextSpan(
                                text: 'Sign In',
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ],
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                  const Spacer(flex: 2),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Ripple extends StatefulWidget {
  final Duration delay;
  const _Ripple({super.key, required this.delay});

  @override
  State<_Ripple> createState() => _RippleState();
}

class _RippleState extends State<_Ripple> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(seconds: 6));
    _anim = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
    Future.delayed(widget.delay, () {
      if (mounted) _ctrl.repeat();
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screen = MediaQuery.of(context).size;
    return AnimatedBuilder(
      animation: _anim,
      builder: (context, child) {
        final t = _anim.value;
        final size = lerpDouble(0, screen.width * 1.15, t)!;
        final opacity = (1.0 - t).clamp(0.0, 1.0) * 0.18;
        return Center(
          child: IgnorePointer(
            child: Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: Colors.red.withOpacity(opacity), width: 2),
              ),
            ),
          ),
        );
      },
    );
  }
}