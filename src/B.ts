// Ball
/// <reference path="./G.ts" />

module XG {
	export class Ball {
		static readonly DIAMETER: number = 64;

		k: string;
		g: GSprite;
		gravityScale_x1: number = GmPhysics.GRAVITYSCALE_x1;
		gravityScale_drop: number = GmPhysics.GRAVITYSCALE_DROP;
		mass_x1: number;

		/** primary color */
		color: number = Color.WHITE;

		timeBonus: number = MrSettings.SECONDS_PER_SCORE;

		get isHeld(): boolean { return !this.isTouchable; }
		set isHeld(v: boolean) {
			var g: GSprite = this.g,
				b: PBBody = g.body;
			if (v) {
				this.isTouchable = false;
				this.onHoldChange.dispatch(true);
				MrStage.ie.groupMCMiddle.add(g);
				// prevent ball from weighing hands down
				b.mass = GmPhysics.MIN_MASS;
			} else {
				this.onHoldChange.dispatch(false);
				MrStage.ie.groupBall.add(g);
				// ball remains untouchable to prevent sticking to hand
				Gm.ie.time.events.add(1000, this.isHeldSetBallTouchable, this);
				b.mass = this.mass_x1;
			}
		}
		private isHeldSetBallTouchable(): void {
			this.isTouchable = true;
		}
		isTouchable: boolean;

		get isOffscreen(): boolean { return this.g.body.y < -Ball.DIAMETER; }

		// components
		arrow: Ball_Arrow;
		componentK: A_;

		// signals
		get onBeginContact(): PSg { return this._onBeginContact; }
		private _onBeginContact: PSg = new Phaser.Signal();
		get onEndContact(): PSg { return this._onEndContact; }
		private _onEndContact: PSg = new Phaser.Signal();
		get onForce(): PSg { return this._onForce; }
		private _onForce: PSg = new Phaser.Signal();
		/** dispatch(isInHands: boolean) */
		get onHoldChange(): PSg { return this._onHoldChange; }
		private _onHoldChange: PSg = new Phaser.Signal();
		get onScore(): PSg { return this._onScore; }
		private _onScore: PSg = new Phaser.Signal();

		constructor(x: number, y: number, k: string) {
			this.k = k;
			this.isTouchable = true;
			this.constructBall(x, y);
			this.constructComponents();
			this.constructlistenSignals();
		}
		private constructBall(x: number, y: number): void {
			var k: string = this.k,
				group: PGp = MrStage.ie.groupBall;
			var g: GSprite = Gm.ie.add.sprite(x, y, k, null, group);
			this.g = g;
			var b: PBBody = GmPhysics.enable(g);
			var f: BF = b.setCircle(Ball.DIAMETER / 2);
			f.SetUserData(this);
			b.bullet = true;
			b.restitution = 1 - 1 / Consts.PHI;
			b.setCollisionCategory(Collision.BALL);
			b.setCollisionMask(Collision.BALL | Collision.BOUNDARY
				| Collision.HOOP | Collision.MC_TORSO | Collision.MC_HAND);
			// set default mass
			this.mass_x1 = b.mass;
		}
		private constructComponents(): void {
			switch (this.k) {
				case Ks.ballFC:
					this.componentK = new Ball_KFC(this);
					break;
				case Ks.ballGS:
					this.componentK = new Ball_KGS(this);
					break;
				case Ks.ballWM:
					this.componentK = new Ball_KWM(this);
					break;
			}
			// componentK first sets ball's primary color,
			// arrow next uses ball's primary color
			this.arrow = new Ball_Arrow(this);
		}
		private constructlistenSignals(): void {
			Gm.ie.onGravitySpike.add(this.handleGravitySpike, this);
			Gm.ie.onUpdate.add(this.update, this);
		}

		private handleGravitySpike(): void {
			this.g.body.velocity.y += 500;
		}
		//
		handleBeginContact(fThis: BF, fThat: BF): void {
			this.onBeginContact.dispatch(fThis, fThat);

			var categThat: number = fThat.GetFilterData().categoryBits;
			if (categThat & Collision.GROUND) {
				Gm.ie.sound.play(Ks.ballBounce);
			} else if (categThat & Collision.HOOP && !fThat.IsSensor()) {
				Gm.ie.sound.play(Ks.ballHit);
			}
		}
		handlePreSolve(fThis: BF, fThat: BF, c: BC): void {
			// do not contact MC if being held or just thrown
			if (this.isTouchable) { return; }

			var categThat: number = fThat.GetFilterData().categoryBits;
			var isCollidingThat: boolean =
				// held ball should collide with front shoulder
				((categThat & Collision.MC_SHOULDER) == 0) &&
				// held ball should pass through MC's body and other balls
				((categThat & (Collision.MC | Collision.BALL)) != 0);
			if (isCollidingThat) {
				c.SetEnabled(false);
			}
		}
		handleEndContact(fThis: BF, fThat: BF): void {
			this.onEndContact.dispatch(fThis, fThat);

			if (fThat.IsSensor()) { return; }

			var categThat: number = fThat.GetFilterData().categoryBits;
			if ((categThat & Collision.HOOP) != 0) {
				// ball bouncing off top off hoop's rim forces MC to release
				if (this.g.body.y < Hoop.Y) {
					this.onForce.dispatch();
				}
			}
		}


		update(): void {
			var b: PBBody = this.g.body;
			b.gravityScale = (b.velocity.y > 0)
				? this.gravityScale_drop
				: this.gravityScale_x1;
		}
	}

	export class Ball_Arrow extends A_ {
		protected entity: Ball;
		//
		gArrow: Graphic;
		gPlus: Graphic;

		set tint(v: number) { this.gArrow.tint = this.gPlus.tint = v; }

		protected constructThis(): void {
			this.constructThisGraphicArrow();
			this.constructThisGraphicPlus();
			this.constructThisListenSignals();
			this.tint = this.entity.color;
		}
		private constructThisGraphicArrow(): void {
			var ht: number = 2, // thickness / 2
				hw: number = 16,
				yT: number = 8,
				yB: number = 20;
			var g: Graphic = Gm.ie.add.graphics(0, 0, MrStage.ie.groupBall);
			g.beginFill(Color.WHITE);
			g.lineStyle(2, Color.BLACK, 0.75);
			g.drawPolygon(
				0, yT - ht, // top
				-hw - ht, yB, -hw + ht, yB + ht, // left
				0, yT + ht, // inner top
				hw - ht, yB + ht, hw + ht, yB // right
			);
			this.gArrow = g;
		}
		private constructThisGraphicPlus(): void {
			var ht: number = 2, // thickness / 2
				hd: number = 8; // dimension / 2 == width / 2 == height / 2
			var g: Graphic = Gm.ie.add.graphics(0, 0, MrStage.ie.groupBall);
			g.beginFill(Color.WHITE);
			g.lineStyle(2, Color.BLACK, 0.75);
			// top -> center
			g.moveTo(ht, -hd); g.lineTo(-ht, -hd); g.lineTo(-ht, -ht);
			// left -> center
			g.lineTo(-hd, -ht); g.lineTo(-hd, ht); g.lineTo(-ht, ht);
			// bottom -> center
			g.lineTo(-ht, hd); g.lineTo(ht, hd); g.lineTo(ht, ht);
			// right -> center
			g.lineTo(hd, ht); g.lineTo(hd, -ht); g.lineTo(ht, -ht);

			g.alpha = 0;
			this.gPlus = g;
		}
		private constructThisListenSignals(): void {
			Gm.ie.onUpdate.add(this.update, this);
			Gm.ie.onGravitySpike.add(this.handleGravitySpike, this);
		}

		private handleGravitySpike(): void {
			// plus sign to indicate drop speed increase
			var gPlus: Graphic = this.gPlus;
			gPlus.alpha = 1;
			var propertiesTw: K2V = { alpha: 0 };
			var tw: PTw = Gm.ie.add.tween(gPlus);
			tw.to(propertiesTw, 250, Phaser.Easing.Quadratic.In);
			tw.start();
		}

		private update(): void {
			var gArrow: Graphic = this.gArrow,
				gPlus: Graphic = this.gPlus;
			if (!this.entity.isOffscreen) {
				// hide arrow and plus sign when ball is on screen,
				// as these only exist to indicate offscreen ball's x
				gArrow.y = gPlus.y = -100;
				return;
			}

			var gBall: GSprite = this.entity.g;
			gArrow.scale.x = Math.min(1, 500 / (-Ball.DIAMETER - gBall.y));
			gArrow.x = gPlus.x = gBall.x;
			gArrow.y = 0;
			gPlus.y = 32;
		}
	}

	/**
	 * unique fried chicken ball properties:
	 * less friction, increasing game time bonus
	 */
	export class Ball_KFC extends A_ {
		protected entity: Ball;

		// game time bonus increases periodically by Fibonacci sequence
		// (skip 1, 1,) 2, 3, 5, 8, 13, 21, ...
		// so player may gamble ball-in-air time to extend game time
		/** game time bonus in seconds when scoring */
		private timeBonusPrev: number = 1;
		private static readonly DELAY_TIME_BONUS: number = Consts.E * 1000;
		/** remember when game time bonus is incrementing when ball is thrown */
		private eventTimeBonus: Phaser.TimerEvent;
		private gEffectTimeBonus: Graphic;

		private get isTimeBonusActive(): boolean {
			return this.eventTimeBonus != null && MrVsGm.ie.isStarted;
		}

		protected constructThis(): void {
			this.constructThisProperties();
			this.constructThisGraphicEffect();
			this.constructThisListenSignals();
		}
		private constructThisProperties(): void {
			this.entity.color = Color.BALL_FC;
			// less friction
			this.entity.g.body.friction /= 2;
		}
		private constructThisGraphicEffect(): void {
			var g: Graphic = Gm.ie.add.graphics(0, 0);
			g.lineStyle(16, Color.BALL_FC, 0.5);
			g.beginFill(Color.WHITE);
			g.drawCircle(0, 0, Ball.DIAMETER + 16);
			g.alpha = 0;
			this.entity.g.addChild(g);
			this.gEffectTimeBonus = g;
		}
		private constructThisListenSignals(): void {
			var ball: Ball = this.entity;
			ball.onBeginContact.add(this.handleBeginContact, this);
			ball.onHoldChange.add(this.handleHoldChange, this);
			ball.onScore.add(this.clearTimeBonus, this);
		}

		private handleBeginContact(_fThis: BF, fThat: BF): void {
			if (this.entity.isHeld || fThat.IsSensor()) { return; }

			var categThat: number = fThat.GetFilterData().categoryBits;
			if ((categThat & Collision.GROUND) == 0) { return; }

			this.clearTimeBonus();
		}
		private handleHoldChange(isInHands: boolean): void {
			this.clearTimeBonus();

			if (isInHands) { return; }

			this.eventTimeBonus = Gm.ie.time.events.add(
				Ball_KFC.DELAY_TIME_BONUS, this.activateTimeBonus, this);
		}

		private activateTimeBonus(): void {
			this.incrementTimeBonus();
			this.updateEffectTimeBonus();
		}
		private incrementTimeBonus(): void {
			var ball: Ball = this.entity;
			// update time bonus to next number in Fibonacci sequence
			var timeBonusPrev: number = ball.timeBonus;
			ball.timeBonus += this.timeBonusPrev;
			this.timeBonusPrev = timeBonusPrev;
			this.eventTimeBonus = Gm.ie.time.events.add(
				Ball_KFC.DELAY_TIME_BONUS, this.incrementTimeBonus, this);
		}
		private clearTimeBonus(): void {
			if (!this.isTimeBonusActive) { return; }

			Gm.ie.time.events.remove(this.eventTimeBonus);
			this.eventTimeBonus = null;
			this.timeBonusPrev = 1;
			this.entity.timeBonus = MrSettings.SECONDS_PER_SCORE;

			// complete time bonus effect
		}
		private updateEffectTimeBonus(): void {
			var gm: Gm = Gm.ie;
			var isActive: boolean = this.isTimeBonusActive;

			var ball: Ball = this.entity;
			var gEffect: Graphic = this.gEffectTimeBonus;
			var isBlinkingOn: boolean = isActive && gEffect.alpha == 0;
			if (isBlinkingOn) {
				gEffect.alpha = Math.min(1, this.entity.timeBonus / 21);
				ball.arrow.tint = Color.WHITE;
				gm.sound.play(Ks.timeTick);
			} else {
				gEffect.alpha = 0;
				ball.arrow.tint = ball.color;
				gm.sound.play(Ks.timeTock);
			}

			if (!isActive) { return; }

			var delayBlink: number = 1000 / Math.min(21, this.entity.timeBonus)
			gm.time.events.add(delayBlink, this.updateEffectTimeBonus, this);
		}
	}
	/**
	 * unique grape soda ball properties:
	 * slower drop, erratic bounce
	 */
	export class Ball_KGS extends A_ {
		protected entity: Ball;

		protected constructThis(): void {
			this.constructThisProperties();
			this.constructThisListenSignals();
		}
		protected constructThisProperties(): void {
			this.entity.color = Color.BALL_GS;
			// slower drop
			this.entity.gravityScale_drop /= 2;
		}
		protected constructThisListenSignals(): void {
			var ball: Ball = this.entity;
			ball.onEndContact.add(this.handleEndContact, this);
		}

		private handleEndContact(_fThis: BF, fThat: BF): void {
			if (this.entity.isHeld || fThat.IsSensor()) { return; }

			// bounce erratically
			var vBall: I_xy = this.entity.g.body.velocity;
			vBall.x += vBall.x * Consts.PHI * (Math.random() - Math.random());
			vBall.y += vBall.y * Consts.PHI * (Math.random() - Math.random());
		}
	}
	/**
	 * unique watermelon ball properties:
	 * faster drop, heavy, less bounce, pull other balls
	 */
	export class Ball_KWM extends A_ {
		protected entity: Ball;

		private static readonly ACCELERATION_PULL: number = Consts.E;

		private gEffectPull: Graphic;
		private soundEffectPull: Phaser.Sound;
		private twEffectAlpha: PTw;
		private twEffectScale: PTw;

		protected constructThis(): void {
			this.constructThisProperties();
			this.constructThisGraphicEffect();
			this.constructThisTweenEffect();
		}
		protected constructThisProperties(): void {
			var ball: Ball = this.entity,
				bBall: PBBody = ball.g.body;
			ball.color = Color.BALL_WM_GREEN;
			// faster drop
			ball.gravityScale_drop *= 2;
			// heavy
			ball.mass_x1 *= 2;
			bBall.mass = ball.mass_x1;
			// less bounce
			bBall.restitution /= 2;

			this.entity.onHoldChange.add(this.handleHoldingChange, this);
			Gm.ie.onUpdate.add(this.update, this);
		}
		private constructThisGraphicEffect(): void {
			var diameter: number = Ball.DIAMETER + 64;
			var g: Graphic = Gm.ie.add.graphics(0, 0);
			g.lineStyle(4, Color.BALL_WM_GREEN);
			g.drawCircle(0, 0, diameter);
			diameter -= 7;
			g.lineStyle(4, Color.WHITE);
			g.drawCircle(0, 0, diameter);
			diameter -= 11;
			g.lineStyle(8, Color.BALL_WM_RED);
			g.drawCircle(0, 0, diameter);
			g.alpha = 0;
			this.entity.g.addChild(g);
			this.gEffectPull = g;
		}
		private constructThisTweenEffect(): void {
			var g: Graphic = this.gEffectPull;
			var dur: number = 777;
			var ease: Function = Phaser.Easing.Cubic.In;
			var twAlpha: PTw = Gm.ie.add.tween(g);
			twAlpha.to({ alpha: 0.77 }, dur, ease);
			twAlpha.yoyo(true);
			this.twEffectAlpha = twAlpha;
			var twScale: PTw = Gm.ie.add.tween(g.scale);
			twScale.to({ x: 0, y: 0 }, dur, ease);
			twScale.yoyo(true);
			this.twEffectScale = twScale;
		}

		private handleHoldingChange(isInHands: boolean): void {
			var g: Graphic = this.gEffectPull;
			if (isInHands) {
				// loop attract effect
				this.twEffectAlpha.repeat(-1);
				this.twEffectAlpha.start();
				this.twEffectScale.repeat(-1);
				this.twEffectScale.start();
				this.soundEffectPull = Gm.ie.sound.play(Ks.attractBall,
					undefined, true);
			} else {
				// complete attract effect
				this.twEffectAlpha.repeat(0);
				this.twEffectScale.repeat(0);
				this.soundEffectPull.fadeOut();
				this.soundEffectPull.onFadeComplete.add(
					this.stopSoundEffectAttract, this);
			}
		}
		private stopSoundEffectAttract(sound: Phaser.Sound): void {
			sound.stop();
			this.soundEffectPull = null;
		}

		private update(): void {
			if (this.entity.isHeld) {
				this.updateAttractBalls();
			}
		}
		private updateAttractBalls(): void {
			var maxAx: number = Ball_KWM.ACCELERATION_PULL,
				minAx: number = -maxAx;
			var bThis: PBBody = this.entity.g.body;
			var balls: K2Ball = MrStage.ie.balls;
			for (var ball of [balls[Ks.ballFC], balls[Ks.ballGS]]) {
				var bBall: PBBody = ball.g.body;
				var dx: number = bThis.x - bBall.x,
					ax: number = Phaser.Math.clamp(dx, minAx, maxAx);
				bBall.velocity.x += ax;
			}
		}
	}
}
