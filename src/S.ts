// Stage Elements

// Hoop
// Score
// Timer

module XG {
	export class BG {
		constructor() {
			var gm: Gm = Gm.ie;
			var g: GSprite = gm.add.sprite(0, 0, Ks.bg, null, MrStage.ie.groupBG);
			g.anchor.x = 0.5;
			g.anchor.y = 1;
			g.x = 0.5 * gm.width;
			g.y = 0.82 * gm.height;
		}
	}

	/** a cloud that periodically floats across background */
	export class Cloud {
		constructor() {
			var gm: Gm = Gm.ie;
			var g: GSprite = gm.add.sprite(2000, 0, Ks.cloud,
				null, MrStage.ie.groupBG);
			g.rotation = 0.1;
			// cloud floats leftward in 1 minute
			var propertiesTwX: K2V = { x: -1000 },
				twX: PTw = gm.add.tween(g);
			twX.to(propertiesTwX, 60000, Phaser.Easing.Linear.None);
			twX.start();
			twX.repeat(-1);
			// cloud subtly bobs up and down
			var propertiesTwYRotation: K2V = { y: 10, rotation: 0.05 },
				easingTwyRotation = Phaser.Easing.Sinusoidal.InOut,
				twYRotation: PTw = gm.add.tween(g);
			twYRotation.to(propertiesTwYRotation, 6000, easingTwyRotation);
			twYRotation.start();
			twYRotation.repeat(-1);
			twYRotation.yoyo(true);
		}
	}

	/** responsible for handling all text effects on screen */
	export class EffectsText {
		constructor() {
			this.constructEffectGameReady();
			this.constructListenSignals();
		}
		private constructEffectGameReady(): void {
			var x: number = Gm.ie.width / 2,
				y: number = Gm.ie.height / 2;
			new EffectText(
				x, y,
				'FREE FRO',
				{ size: 100 }, { duration: 5000 }
			);
			new EffectText(
				x, y + 150,
				'by XJ',
				{ font: Ks.font1, size: 72 }, { duration: 5000 }
			);
			new EffectText(
				x, y + 300,
				Text.VERB_INPUT + ' fo instructions',
				{ font: Ks.font1, size: 42 }, { duration: 7000 }
			);
		}
		private constructListenSignals(): void {
			Gm.ie.onInputDown.add(this.effectTextDirections, this);
			var balls: K2Ball = MrStage.ie.balls;
			for (var k in balls) {
				var ball: Ball = balls[k];
				ball.onScore.add(this.effectTextScore, this, 0, ball);
			}
			var mrVsGm: MrVsGm = MrVsGm.ie;
			mrVsGm.onStateChange.add(this.effectTextGameStateChange, this);
			mrVsGm.onTimeAdd.add(this.effectTextTimeAdded, this);
			MrSettings.ie.onSet.add(this.effectTextSetting, this,);
		}


		/** show game directions if game is not in play */
		private effectTextDirections(): void {
			if (MrVsGm.ie.isStarted) { return; }

			var nounInput: string = Text.NOUN_INPUT,
				verbInput: string = Text.VERB_INPUT;
			var directions: string = `
				Yo run n jump inna direction of yo ${nounInput}.

				Yo finna fro yo BALLS inna HOOP.
				(1) Grab on yo balls.
				(2) Put yo ${nounInput} on yo ball to ready yo fro.
				(3) Swish yo ${nounInput} inna direction yo finna fro.
				(4) When yo balls inna air, ${verbInput} to drop yo balls mo.

				YO BALLS BE UNIQUE.
			`;
			new EffectText(Gm.ie.width / 2, Gm.ie.height / 2, directions,
				{ font: Ks.font1, size: 48 }, { duration: 5000, offsetY: 0.01 }
			);
		}
		private effectTextGameStateChange(isStarted: boolean): void {
			var text: string = (isStarted) ? 'GAME ON' : 'GAME OVER';
			new EffectText(Gm.ie.width / 2, Gm.ie.height / 2,
				text, { font: Ks.font1, size: 100 });
		}
		private effectTextScore(ball: Ball): void {
			new EffectText(Gm.ie.width / 2, Gm.ie.height / 2,
				'SCORE!', { font: Ks.font1, size: 64, tint: ball.color });
		}
		private effectTextTimeAdded(dtime: number): void {
			new EffectText(Gm.ie.width / 2, Gm.ie.height / 2 + 64,
				'+' + dtime + ' seconds', { size: 48 });

			// vibrate screen proportionate to time bonus
			Gm.ie.camera.shake(dtime * 0.0001, 1000);
		}
		private effectTextSetting(k: string, isOn: boolean): void {
			var textOn: string = (isOn) ? ' ON' : ' OFF',
				text: string = k.toUpperCase() + textOn,
				tint: number = (isOn) ? Color.YELLOW : Color.GRAY_MID;
			new EffectText(
				Gm.ie.width / 2, Gm.ie.height / 2, text,
				{ font: Ks.font1, size: 100, tint: tint },
				{ duration: 2000 }
			);
		}
	}

	/** invisible chain link fence bounded by left and right sides of screen */
	export class Fence {
		constructor() {
			var gm: Gm = Gm.ie;
			var wBoundary: number = 100;
			var b: PBBody = new Phaser.Physics.Box2D.Body(gm, null);
			var offsetsX: number[] = [
				-wBoundary / 2, // left boundary
				wBoundary / 2 + gm.width // right boundary
			];
			for (var offsetX of offsetsX) {
				var f: BF = b.addRectangle(wBoundary, 100000, offsetX);
				f.SetUserData(this);
			}
			b.static = true;
			b.setCollisionCategory(Collision.FENCE);
		}

		handleBeginContact(_fThis: BF, fThat: BF): void {
			if (fThat.IsSensor()) { return; }

			// minor body parts don't make noise
			var categThat: number = fThat.GetFilterData().categoryBits;
			if (categThat & Collision.MC_HAND
				|| categThat & Collision.MC_LIMB
			) { return; }

			Gm.ie.sound.play(Ks.fenceHit);
		}
	}
	export class Ground {
		g: GSprite;

		constructor() {
			var gm: Gm = Gm.ie;
			var g: GSprite = gm.add.sprite(gm.width / 2, 1.5 * gm.height,
				Ks.ground, undefined, MrStage.ie.groupHoopGround);
			gm.b2d.enable(g);
			g.body.friction = 1;
			g.body.static = true;
			g.body.setCollisionCategory(Collision.GROUND);
			this.g = g;
		}
	}
	export class Hoop {
		static readonly Y: number = 200;

		g: GSprite;

		/** keep track of balls that may score from above hoop */
		private ksBallsScorable: K2Ball = {};

		/** rim radius equals half of rim's thickness */
		private get rRim(): number { return 4; }
		/** distance between rim's inner edges; space for ball to go through */
		private get wHoopInner(): number {
			return Math.ceil(Consts.PHI * Ball.DIAMETER);
		}
		/** distance between rim's outer edges; end-to-end diameter of hoop */
		// private get wHoopOuter(): number {
		// 	return 4 * this.rRim + this.wHoopInner;
		// }

		constructor() {
			var gm: Gm = Gm.ie;
			var g: GSprite = gm.add.sprite(1200, Hoop.Y, Ks.hoop,
				undefined, MrStage.ie.groupHoopGround);
			this.g = g;
			var b: PBBody = GmPhysics.enable(g);
			var rRim: number = this.rRim;
			var wHoopInner: number = this.wHoopInner;
			// hoop rim fixture
			var oxRim: number = wHoopInner / 2 + rRim;
			for (var i: number = 0; i < 2; i++) {
				oxRim = (i > 0) ? -oxRim : oxRim;
				var fRim: BF = b.addCircle(rRim, oxRim, 0);
				fRim.SetUserData(this);
			}
			/**
			 * @description
			 * This tall triangular sensor detects a faster-falling ball
			 * which would clip undetected through a thinner sensor.
			 * It also denies the player from scoring by tossing the ball
			 * up through the hoop from directly underneath.
			 */
			var fSensor: BF = b.addPolygon([
				-wHoopInner / 2, 0,
				wHoopInner / 2, 0,
				0, -256
			]);
			fSensor.SetSensor(true);
			fSensor.SetUserData(this);
			b.bullet = true;
			b.setCollisionCategory(Collision.HOOP);

			// welding hoop's dynamic body to a static point
			// allows hoop to remain mostly rigid,
			// yet give way slightly upon impact
			var bFix: PBBody = new Phaser.Physics.Box2D.Body(gm, null,
				gm.width, this.g.y);
			bFix.setCircle(4, 0, 0);
			bFix.static = true;
			Gm.ie.b2d.weldJoint(bFix, b, 0, 0, gm.width - this.g.x, 0);
		}

		handleBeginContact(fThis: BF, fThat: BF): void {
			if (!fThis.IsSensor()) { return; }

			var ball: Ball = fThat.GetUserData();
			if (!(
				ball instanceof Ball &&
				ball.g.y < this.g.y
			)) { return; }

			// ball is above hoop,
			// keep track to see if it falls through
			this.ksBallsScorable[ball.k] = ball;
		}
		handleEndContact(fThis: BF, fThat: BF): void {
			if (!fThis.IsSensor()) { return; }

			var ball: Ball = fThat.GetUserData();
			if (!(
				ball instanceof Ball &&
				ball.g.y > this.g.y &&
				this.ksBallsScorable[ball.k]
			)) { return; }

			// ball has fallen through hoop
			this.score(ball);
		}

		private score(ball: Ball): void {
			var mrVsGm: MrVsGm = MrVsGm.ie;
			if (mrVsGm.isStarted) {
				MrVsGm.ie.addVTime(ball.timeBonus);
			}
			mrVsGm.vScore++;
			ball.onScore.dispatch();

			var bBall: PBBody = ball.g.body,
				vBall: I_xy = bBall.velocity;
			new EffectBurstScore(bBall.x, Hoop.Y, vBall, ball.k);

			delete this.ksBallsScorable[ball.k];
		}
	}

	export class Scoreboard {
		labelScore: PTx; counterScore: PTx;
		labelTimer: PTx; countdownTimer: PTx;
		labelHiScore: PTx; counterHiScore: PTx;

		// component
		updateTimer: Scoreboard_UpdateTimer;

		constructor() {
			this.constructTexts();
			this.constructListenSignals();
			this.constructComponent();
		}
		private constructTexts(): void {
			var gm: Gm = Gm.ie,
				gmAdd: PAdd = gm.add;
			var groupSboard: PGp = MrStage.ie.groupScoreboard;
			var colorLabel: number = Color.RED;
			var font: string = Ks.font1;
			var size: number = 64;
			var xCenter: number = gm.width / 2,
				offsetXCenter: number = 256;
			var yTop: number = 32,
				yBottom: number = 80;
			// score counter
			var xScore: number = xCenter - offsetXCenter;
			var labelScore: PTx = gmAdd.bitmapText(
				xScore, yTop, font,
				'SCORE', size, groupSboard
			);
			labelScore.tint = colorLabel;
			this.labelScore = labelScore;
			var counterScore: PTx = gmAdd.bitmapText(
				xScore, yBottom, font,
				'0', size, groupSboard);
			this.counterScore = counterScore;
			// countdown timer
			var countdownTimer: PTx = gmAdd.bitmapText(
				xCenter, yTop + 10, font,
				'', size, groupSboard
			);
			this.countdownTimer = countdownTimer;
			var labelTimer: PTx = gmAdd.bitmapText(
				xCenter, yBottom + 20, font,
				'TIME REMAINING', size / Consts.PHI, groupSboard
			);
			labelTimer.tint = colorLabel;
			this.labelTimer = labelTimer;
			// high score counter
			var xHiScore: number = xCenter + offsetXCenter;
			var labelHiScore: PTx = gmAdd.bitmapText(
				xHiScore, yTop, font,
				'HIGH SCORE', size, groupSboard
			);
			labelHiScore.tint = colorLabel;
			this.labelHiScore = labelHiScore;
			var counterHiScore: PTx = gmAdd.bitmapText(
				xHiScore, yBottom, font,
				'', size, groupSboard
			);
			this.counterHiScore = counterHiScore;

			var mrVsGm: MrVsGm = MrVsGm.ie;
			this.setCounterHiScore(mrVsGm.vHiScore);
			this.setTintHiScore(mrVsGm.iHiTier);

			for (var text of [
				labelScore, counterScore,
				labelTimer, countdownTimer,
				labelHiScore, counterHiScore
			]) {
				text.anchor.x = 0.5;
			}
		}
		private constructListenSignals(): void {
			MrVsGm.ie.onScoreChange.add(this.setCounterScore, this);
			MrVsGm.ie.onHiScoreChange.add(this.setCounterHiScore, this);
			MrVsGm.ie.onHiTierChange.add(this.setTintHiScore, this);
		}
		private constructComponent(): void {
			this.updateTimer = new Scoreboard_UpdateTimer(this);
		}

		private setCounterScore(v: number): void {
			this.counterScore.text = v.toString();

			if (v > 0) {
				Gm.ie.sound.play(Ks.score);
			}
		}
		private setCounterHiScore(v: number): void {
			this.counterHiScore.text = v.toString();
		}
		private setTintHiScore(iHiTier: number): void {
			var colorHiTier: number = MrTierBonus.Tiers[iHiTier].colors[0];
			if (colorHiTier != Color.BLACK) {
				this.counterHiScore.tint = colorHiTier;
			}
		}
	}
	export class Scoreboard_UpdateTimer extends A_ {
		protected entity: Scoreboard;

		private timerEvent: Phaser.TimerEvent;

		protected constructThis(): void {
			this.reset();
			// when adding time bonus,
			// reset tick to add remainder of unfinished second
			// as an implicit additional time bonus
			MrVsGm.ie.onTimeAdd.add(this.setTickNext, this);
			MrVsGm.ie.onTimeChange.add(this.setCounter, this);
		}

		private reset(): void {
			this.setCounter(0);

			Gm.ie.onBallGrabbed.addOnce(this.start, this);
		}
		private start(): void {
			MrVsGm.ie.isStarted = true;
			MrVsGm.ie.vTime = MrSettings.SECONDS_PER_GAME;

			this.setTickNext();

			Gm.ie.sound.play(Ks.gameOn);
		}
		private stop(): void {
			MrVsGm.ie.isStarted = false;

			if (MrVsGm.ie.vScore > 0) {
				Gm.ie.sound.play(Ks.gameOver);
			} else {
				Gm.ie.sound.play(Ks.bruh); // utterance of disappointment
			}

			this.reset();
		}
		private tick(): void {
			var vTime: number = --MrVsGm.ie.vTime;
			if (vTime <= 0) {
				this.stop();
				return;
			}

			if (vTime <= 10) {
				// 10 second warning ticks
				var kSound: string = ((vTime % 2) == 0)
					? Ks.timeTick
					: Ks.timeTock;
				Gm.ie.sound.play(kSound);
			}

			this.setTickNext();
		}

		private setTickNext(): void {
			var gmTimer: Phaser.Timer = Gm.ie.time.events;
			gmTimer.remove(this.timerEvent);
			this.timerEvent = gmTimer.add(1000, this.tick, this);
		}

		private setCounter(v: number): void {
			var vSeconds: string = (v % 60).toString(),
				vMinutes: string = Math.floor(v / 60).toString();
			this.entity.countdownTimer.text =
				Phaser.Utils.pad(vMinutes, 2, '0', 1)
				+ ' : ' +
				Phaser.Utils.pad(vSeconds, 2, '0', 1);
		}
	}

	export class UI {
		// components from bottom to top
		screenInput: UI_ScreenInput;
		buttonsSettings: UI_ButtonsSettings;

		constructor() {
			this.screenInput = new UI_ScreenInput(this);
			this.buttonsSettings = new UI_ButtonsSettings(this);
		}
	}
	/** screen area that can be clicked or tapped */
	export class UI_ScreenInput extends A_ {
		protected entity: UI;

		protected constructThis(): void {
			var gm: Gm = Gm.ie;
			// use a Graphic to register user input
			var g: Graphic = gm.add.graphics(0, 0, MrStage.ie.groupUI);
			g.beginFill(Color.BLACK, 0);
			g.drawRect(0, 0, gm.width, gm.height - 2);
			g.inputEnabled = true;
			g.events.onInputDown.add(gm.onInputDown.dispatch, gm.onInputDown);
		}
	}
	export class UI_ButtonsSettings extends A_ {
		protected entity: UI;

		private btns: { [k: string]: PTx };

		protected constructThis(): void {
			this.constructThisBtns();
			this.constructThisShowBtnGravitySpike();
		}
		private constructThisBtns(): void {
			var mrSettings: MrSettings = MrSettings.ie;
			// create buttons
			this.btns = {};
			var yBtn: number = Gm.ie.height;
			var ksSettings: string[] = mrSettings.getKs();
			for (var k of ksSettings) {
				yBtn -= 40;
				this.constructThisBtn(yBtn, k, mrSettings.getV(k));
			}
		}
		private constructThisBtn(y: number, k: string, v: boolean): void {
			var gm: Gm = Gm.ie,
				mrSettings: MrSettings = MrSettings.ie;
			var x: number = 8,
				font: string = Ks.font1,
				size: number = 35,
				group: PGp = MrStage.ie.groupUI;
			var btn: PTx = gm.add.bitmapText(x, y, font, '', size, group);
			btn.inputEnabled = true;
			btn.tint = Color.GRAY_MID;
			btn.events.onInputDown.add(this.updateSetting, this,
				Number.POSITIVE_INFINITY, k);
			this.btns[k] = btn;

			this.updateSettingTextBtn(k, v);
		}
		private constructThisShowBtnGravitySpike(): void {
			// only allow player to turn off gravity spike
			// after gold tier has been attained
			if (!MrTierBonus.ie.isTierGoldAchieved) {
				this.btns[Ks.gravitySpike].visible = false;
				MrVsGm.ie.onHiScoreChange.add(this.showBtnGravitySpike, this);
			}
		}

		private showBtnGravitySpike(): void {
			if (!MrTierBonus.ie.isTierGoldAchieved) { return; }

			this.btns[Ks.gravitySpike].visible = true;
			MrVsGm.ie.onHiScoreChange.remove(this.showBtnGravitySpike, this);
		}

		private updateSetting(btn: PTx, v: V, k: string): void {
			var mrSettings: MrSettings = MrSettings.ie,
				isOnCurrent = !mrSettings.getV(k);
			mrSettings.setV(k, isOnCurrent);
			this.updateSettingTextBtn(k, isOnCurrent);

			// play sound effect to notify effect change
			Gm.ie.sound.play(Ks.afroHit);
		}
		private updateSettingTextBtn(k: string, isOn: boolean): void {
			var btn: PTx = this.btns[k];
			// set button's text to inform user:
			// clicking button will set the specified setting to the next one
			var strNextSetting: string = (isOn) ? ' OFF' : ' ON';
			btn.text = 'SET ' + k.toUpperCase() + strNextSetting;
			// updated width of button text

			// allow button to register clicks in text's whitespace
			var hBtn: number = btn.height + 5; // 5 pixel BitmapText overflow
			btn.hitArea = new PIXI.Rectangle(0, 0, btn.width, hBtn);
		}
	}
}
