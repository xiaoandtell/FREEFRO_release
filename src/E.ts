// Effects
module XG {
	export class EffectBurstScore implements I_destructor {
		private static readonly ksBalls2Particles: K2V = GmH.toK2VFromK0V1s(
			Ks.ballFC, [Ks.particle + Color.WHITE, Ks.particle + Color.BALL_FC],
			Ks.ballGS, [Ks.particle + Color.WHITE, Ks.particle + Color.BALL_GS],
			Ks.ballWM, [Ks.particle + Color.WHITE,
				Ks.particle + Color.BALL_WM_GREEN,
				Ks.particle + Color.BALL_WM_RED
			]
		);
		private emitter: PEm;

		constructor(x: number, y: number, gravity: I_xy, kBall: string) {
			var ksBalls2Particles: K2V = EffectBurstScore.ksBalls2Particles,
				ksParticles: K2String = ksBalls2Particles[kBall];
			var emitter = Gm.ie.add.emitter(x, y, 100);
			emitter.particleClass = ParticleBD;
			emitter.makeParticles(ksParticles);
			emitter.gravity = <Phaser.Point>gravity;
			emitter.minParticleScale = 0.1;
			emitter.maxParticleScale = 1;
			emitter.setXSpeed(gravity.x - gravity.y/3, gravity.x + gravity.y/3);
			emitter.start(true, 4000, null, 100);
			MrStage.ie.groupBall.add(emitter);
			this.emitter = emitter;

			// tween emitter alpha to 0
			var tw: PTw = Gm.ie.add.tween(emitter);
			var propertiesTw: K2V = { alpha: 0 };
			tw.to(propertiesTw, 1000, Phaser.Easing.Quadratic.In);
			tw.start();
			tw.onComplete.addOnce(this.destructor, this);
		}
		destructor(): void {
			this.emitter.destroy();
		}
	}
	/** BitmapData particle */
	export class ParticleBD extends Phaser.Particle {
		constructor(game: Gm, x: number, y: number, key: string) {
			super(game, x, y, Gm.ie.cache.getBitmapData(key));
		}
	}


	export class EffectGravitySpike implements I_destructor {
		private gs: Graphic[];

		constructor(x: number, y: number, colors: number[]) {
			var gm: Gm = Gm.ie;
			// draw segments (S) dotting around concentric rings (R)
			// tween rings to drop and expand explosively
			var groupR: PGp = MrStage.ie.groupEffects,
				gsR: Graphic[] = [],
				numR: number = 4,
				numSPerR: number = 64;
			/** radius of outermost ring */
			var radiusROut: number = 64;
			/** rotational increment between adjacent segments */
			var offsetRotationS: number = box2d.b2_two_pi / numSPerR;

			var EaseQ: typeof Phaser.Easing.Quadratic = Phaser.Easing.Quadratic;

			for (var iR: number = 0; iR < numR; iR++) {
				var gR: Graphic = gm.add.graphics(x, y, groupR);
				var iRInv: number = numR - iR;
				// inner rings more smaller
				var radiusR: number = radiusROut - 8 * iRInv;
				// inner rings' segments more thinner
				var lineWidthS: number = 7 * Math.pow(iRInv / numR, 2);

				// draw ring
				for (var iS: number = 0; iS < numSPerR; iS++) {
					var color: number = gm.rnd.pick(colors);
					gR.lineStyle(lineWidthS, color, 0.25);
					var rotationS: number = iS * offsetRotationS;
					var x0S: number = radiusR * Math.cos(rotationS),
						x1S: number = radiusROut * Math.cos(rotationS),
						y0S: number = radiusR * Math.sin(rotationS),
						y1S: number = radiusROut * Math.sin(rotationS);
					gR.moveTo(x0S, y0S);
					gR.lineTo(x1S, y1S);
				}
				var scaleG: I_xy = gR.scale;
				scaleG.x = scaleG.y = 0;

				// tween ring
				// inner rings tween more time
				var dur: number = MC_GravitySpike.DURATION_COOLDOWN + 250 * iR;
				var propertiesTwAlphaY: K2V = {
					alpha: 0,
					y: gR.y + Math.pow(10 * iR, 2) // inner rings drop more
				};
				var twAlphaY: PTw = Gm.ie.add.tween(gR);
				twAlphaY.to(propertiesTwAlphaY, dur, EaseQ.In);
				twAlphaY.start();
				var propertiesTwScale: K2V = {
					x: 2 + iR, // inner rings expand more
					y: 2 + 2 * iR // inner rings stretch more downward
				};
				var twScale: PTw = Gm.ie.add.tween(scaleG);
				twScale.to(propertiesTwScale, dur, EaseQ.Out);
				twScale.start();
			}
			twScale.onComplete.addOnce(this.destructor, this);
			this.gs = gsR;
		}
		destructor(): void {
			var gs: Graphic[] = this.gs;
			for (var g of gs) {
				g.destroy();
			}
		}
	}


	export class EffectObjTweenout implements I_destructor {
		private obj: { destroy: Function };
		constructor(
			obj: {
				alpha: number,
				x: number, y: number,
				destroy: Function
			},
			propertiesTween?: {
				/** milliseconds */ duration?: number,
				offsetY?: number;
			}
		) {
			this.obj = obj;
			MrStage.ie.groupEffects.add(obj);

			// set tween properties
			var duration: number = 2000;
			var offsetY: number = -100;
			if (propertiesTween) {
				duration = propertiesTween.duration || duration;
				offsetY = propertiesTween.offsetY || offsetY;
			}

			var yTo: number = obj.y + offsetY;

			// tween obj
			var propertiesTw: K2V = { alpha: 0, y: yTo };
			var tw: PTw = Gm.ie.add.tween(obj);
			tw.to(propertiesTw, duration, Phaser.Easing.Quadratic.In);
			tw.start();
			tw.onComplete.addOnce(this.destructor, this);
		}
		destructor(): void {
			this.obj.destroy();
		}
	}
	export class EffectAfroGlitter {
		constructor(x: number, y: number) {
			var gm: Gm = Gm.ie;
			var alphaFlare: number = gm.rnd.realInRange(0.25, 1),
				lFlare: number = 16,
				wFlare: number = gm.rnd.realInRange(2, 6);
			var g: Graphic = Gm.ie.add.graphics(x, y);
			g.beginFill(Color.WHITE, alphaFlare);
			g.drawPolygon( // horizontal flare
				0, -lFlare,
				-wFlare, 0,
				0, lFlare,
				wFlare, 0
			);
			g.drawPolygon( // vertical flare
				0, -wFlare,
				-lFlare, 0,
				0, wFlare,
				lFlare, 0
			);
			g.scale.x = g.scale.y = Math.random();

			var propertiesTween = {
				duration: Gm.ie.rnd.realInRange(100, 1000),
				offsetY: -16 * Math.random()
			};
			new EffectObjTweenout(g, propertiesTween);
		}
	}
	export class EffectText {
		constructor(
			x: number, y: number,
			text: string,
			propertiesText?: {
				font?: string;
				size?: number;
				tint?: number;
			},
			propertiesTween?: {
				/** milliseconds */
				duration?: number;
				offsetY?: number;
			}
		) {
			propertiesText = propertiesText || {};
			var font: string = propertiesText.font || Ks.font0,
				size: number = propertiesText.size || 32;
			var txt: PTx = Gm.ie.add.bitmapText(x, y, font, text, size);
			txt.align = 'center';
			txt.anchor.setTo(0.5, 0.5);
			txt.tint = propertiesText.tint || Color.WHITE;

			new EffectObjTweenout(txt, propertiesTween);
		}
	}

}
