// Game
// Game Classes
// Game Constants
// Game Type

module XG {
	// **** game starting point ****
	window.onload = () => {
		var gm: Gm = new Gm(1280, 720, Phaser.AUTO);
		gm.transparent = true;
		gm.state.add(Ks.game, GmStPlay);
		gm.state.start(Ks.game);
	}

	/** game */
	export class Gm extends Phaser.Game {
		physics: GmPhysics; // type for inherited property

		static readonly isDebugging: boolean = false; // true; //

		/** game instance */
		static get ie(): Gm {
			return <Gm>Phaser.GAMES[0];
		}

		get b2d(): PB {
			return this.physics.box2d;
		}

		// signals:
		get onBallGrabbed(): PSg { return this._onBallGrabbed; }
		private _onBallGrabbed: PSg = new Phaser.Signal();
		get onGravitySpike(): PSg { return this._onGravitySpike; }
		private _onGravitySpike: PSg = new Phaser.Signal();
		get onInputDown(): PSg { return this._onInputDown; }
		private _onInputDown: PSg = new Phaser.Signal();
		// signals: steps
		get onPreRender(): PSg { return this._onPreRender; }
		private _onPreRender: PSg = new Phaser.Signal();
		get onUpdate(): PSg { return this._onUpdate; }
		private _onUpdate: PSg = new Phaser.Signal();
	}

	/** playing game state */
	export class GmStPlay extends Phaser.State {
		game: Gm;

		init(): void {
			// fill page with game
			this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			// for accurate fps
			this.game.time.advancedTiming = true;
		}

		preload(): void {
			this.preloadAudio();
			this.preloadFonts();
			this.preloadGraphics();
		}
		private preloadAudio(): void {
			var dir: string = 'assets/audio/';
			var ks: string[] = [
				Ks.afroHit, Ks.tierBonusBronze, Ks.tierBonusSilver,
				Ks.tierBonusGold, Ks.tierBonusTyrian, Ks.tierBonusBling,
				Ks.attractBall, Ks.ballBounce, Ks.ballHit, Ks.bruh,
				Ks.fenceHit, Ks.footStep, Ks.gameOn, Ks.gameOver,
				Ks.gravitySpike, Ks.none, Ks.score, Ks.timeTick, Ks.timeTock
			];
			for (var k of ks) {
				this.game.load.audio(k, dir + k + '.ogg');
			}
		}
		private preloadFonts(): void {
			var dir: string = 'assets/fonts/';
			var ks: string[] = [Ks.font0, Ks.font1];
			for (var k of ks) {
				var pathK: string = dir + k;
				this.game.load.bitmapFont(k, pathK + '.png', pathK + '.fnt');
			}
		}
		private preloadGraphics(): void {
			var dir: string = 'assets/graphics/'; //_collision
			var ks: string[] = [
				Ks.ballFC, Ks.ballGS, Ks.ballWM,
				Ks.bg, Ks.cloud, Ks.ground, Ks.hoop,
				Ks.mcChest, Ks.mcFemur, Ks.mcFoot, Ks.mcGut, Ks.mcHand,
				Ks.mcHead, Ks.mcHeadBronze, Ks.mcHeadSilver,
				Ks.mcHeadGold, Ks.mcHeadTyrian, Ks.mcHeadBling,
				Ks.mcHip, Ks.mcHumerus, Ks.mcTibia, Ks.mcUlna
			];
			for (var k of ks) {
				this.game.load.image(k, dir + k + '.png');
			}
		}

		create(): void {
			this.createBox2D();
			this.createManagers();
		}
		private createBox2D(): void {
			var physics: GmPhysics = this.game.physics;
			physics.startSystem(Phaser.Physics.BOX2D);
			var gmB2D: PB = physics.box2d;
			gmB2D.debugDraw.joints = true;
			gmB2D.setPTMRatio(GmPhysics.B2D_PTM);
			gmB2D.gravity.y = GmPhysics.B2D_GRAVITY;
			gmB2D.world.SetContactListener(new GmContactListener());

			// debugging
			gmB2D.debugDraw.joints = true;
			box2d.DEBUG = true;
			box2d.ENABLE_ASSERTS = true;
		}
		private createManagers(): void {
			MrCookie.init();
			MrVsGm.init();
			MrSettings.init();
			MrTierBonus.init();
			MrSound.init();
			MrStage.init();
			MrInput.init();
		}

		preRender(): void {
			this.game.onPreRender.dispatch();
		}
		render(): void {
			if (Gm.isDebugging) {
				this.game.debug.box2dWorld();
			}
		}
		update(): void {
			this.game.onUpdate.dispatch();
		}
	}


	export class GmContactListener extends box2d.b2ContactListener {
		BeginContact(contact: BC): void {
			this.contact(contact, Ks.handleBeginContact);
		}
		EndContact(contact: BC): void {
			this.contact(contact, Ks.handleEndContact);
		}
		PreSolve(contact: BC, oldManifold: box2d.b2Manifold): void {
			this.contact(contact, Ks.handlePreSolve/*, oldManifold*/);
		}

		private contact(contact: BC, kFunction: string): void {
			var fA: BF = contact.GetFixtureA(),
				eA: any = fA.GetUserData();
			var fB: BF = contact.GetFixtureB(),
				eB: any = fB.GetUserData();
			if (eA && eA[kFunction]) {
				eA[kFunction](fA, fB, contact);
			}
			if (eB && eB[kFunction]) {
				eB[kFunction](fB, fA, contact);
			}
		}
	}

	/** game physics */
	export class GmPhysics extends Phaser.Physics {
		box2d: PB;

		static readonly B2D_PTM: number = 100;
		static readonly B2D_GRAVITY: number = 200;
		static readonly GRAVITYSCALE_x1: number = 1;
		static readonly GRAVITYSCALE_DROP: number = 4;
		static readonly MIN_MASS: number = 0.001;

		// enables physics on graphics without fixtures
		static enable(obj: { body: PBBody }): PBBody {
			Gm.ie.b2d.enable(obj, false);
			obj.body.clearFixtures();
			return obj.body;
		}
		// disables contacts for fixtures intended to be weights
		static disableContactsFixture(f: BF): void {
			f.SetSensor(true);
			f.GetFilterData().categoryBits = Collision.NONE;
			f.GetFilterData().maskBits = Collision.NONE;
		}
	}


	/** game helper functions */
	export class GmH {
		static count(vs: K2V): number {
			return Object.keys(vs).length;
		}

		static getKs(obj: K2V): K[] { return Object.keys(obj); }

		static isUndefined(v: V): boolean {
			return typeof v === 'undefined';
		}

		/**
		 * transforms an implicitly even-length array into a K2V Object
		 *
		 * even-indexed elements become keys, odd-indexed elements become values
		 */
		static toK2VFromK0V1s(...pairsK0V1: (K | V)[]): K2V {
			var result: K2V = {};
			for (var iKV: number = 0; iKV < pairsK0V1.length; iKV += 2) {
				var k: K = pairsK0V1[iKV],
					v: V = pairsK0V1[iKV + 1];
				result[k] = v;
			}
			return result;
		}
	}


	/**
	 * generic component class to handle functional specifics of larger classes
	 */
	export abstract class A_ {
		protected entity: any;

		constructor(entity: any) {
			this.entity = entity;
			this.constructThis();
		}
		protected abstract constructThis(): void;
	}


	export class Graphic extends Phaser.Graphics {
		body: PBBody;
	}
	export class GSprite extends Phaser.Sprite {
		body: PBBody;
	}


	/** collision constants */
	export class Collision {
		static readonly NONE: number = 0x0000;
		static readonly GROUND: number = 0x0001;
		static readonly FENCE: number = 0x0002;
		static readonly HOOP: number = 0x0004;
		static readonly BALL: number = 0x0008;
		static readonly MC: number = 0x0010;
		static readonly MC_TORSO: number = 0x0020;
		static readonly MC_LIMB: number = 0x0040;
		static readonly MC_HAND: number = 0x0080;
		static readonly MC_SHOULDER: number = 0x0100;
		static readonly BOUNDARY: number = Collision.GROUND | Collision.FENCE;
	}

	/** color constants */
	export class Color {
		static readonly BALL_FC: number = 0xff9933;
		static readonly BALL_GS: number = 0xcc00cc;
		static readonly BALL_WM_GREEN: number = 0x009900;
		static readonly BALL_WM_RED: number = 0xcc0000;
		static readonly BLACK: number = 0x000000;
		static readonly BRONZE: number = 0x993300;
		static readonly BRONZE_DARK: number = 0x663300;
		static readonly CYAN: number = 0x00ffff;
		static readonly GREEN: number = 0x00ff00;
		static readonly GRAY_DARK: number = 0x333333;
		static readonly GRAY_MID: number = 0x999999;
		static readonly MC_SKIN: number = 0x8c6239;
		static readonly ORANGE: number = 0xff9900;
		static readonly PINK: number = 0xff9999;
		static readonly RED: number = 0xff0000;
		static readonly TYRIAN: number = 0x993399;
		static readonly TYRIAN_DARK: number = 0x660033;
		static readonly WHITE: number = 0xffffff;
		static readonly YELLOW: number = 0xffff00;

		static toStringHex(c: number): string {
			return '#' + c.toString(16).substring(0, 6);
		}
	}

	/** miscellaneous constants */
	export class Consts {
		static readonly E: number = 2.71828182846;
		static readonly PHI: number = 1.61803398875;
	}

	/** keys or keyword constants */
	export class Ks {
		static readonly afroHit: string = 'afroHit';
		static readonly attractBall: string = 'attractBall';
		static readonly ballGS: string = 'ballGS';
		static readonly ballFC: string = 'ballFC';
		static readonly ballWM: string = 'ballWM';
		static readonly ball_throwUnready: string = 'ball_throwUnready';
		static readonly ball_throwReady: string = 'ball_throwReady';
		static readonly ball_release: string = 'ball_release';
		static readonly ballArrow: string = 'ballArrow';
		static readonly ballBounce: string = 'ballBounce';
		static readonly ballHit: string = 'ballHit';
		static readonly bg: string = 'bg';
		static readonly bruh: string = 'bruh';
		static readonly cloud: string = 'cloud';
		static readonly fenceHit: string = 'fenceHit';
		static readonly font0: string = 'ToBeContinued';
		static readonly font1: string = 'DAMAGED';
		static readonly footStep: string = 'footStep';
		static readonly fAfro: string = 'fAfro';
		static readonly fHand: string = 'fHand';
		static readonly fFoot: string = 'fFoot';
		static readonly fLomoStep: string = 'fLomoStep';
		static readonly game: string = 'game';
		static readonly gameOn: string = 'gameOn';
		static readonly gameOver: string = 'gameOver';
		static readonly gravitySpike: string = 'gravitySpike';
		static readonly ground: string = 'ground';
		static readonly handleBeginContact: string = 'handleBeginContact';
		static readonly handleEndContact: string = 'handleEndContact';
		static readonly handlePreSolve: string = 'handlePreSolve';
		static readonly hiScore: string = 'hiScore';
		static readonly hiTier: string = 'hiTier';
		static readonly hoop: string = 'hoop';
		static readonly input: string = 'input';
		static readonly instructions: string = 'instructions';
		static readonly jump_ready: string = 'jump_ready';
		static readonly jump_started: string = 'jump_started';
		static readonly jump_stopped: string = 'jump_stopped';
		static readonly k: string = 'k';
		static readonly mcChest: string = 'mcChest';
		static readonly mcFemur: string = 'mcFemur';
		static readonly mcFoot: string = 'mcFoot';
		static readonly mcGut: string = 'mcGut';
		static readonly mcHand: string = 'mcHand';
		static readonly mcHead: string = 'mcHead';
		static readonly mcHeadBronze: string = 'mcHeadBronze';
		static readonly mcHeadSilver: string = 'mcHeadSilver';
		static readonly mcHeadGold: string = 'mcHeadGold';
		static readonly mcHeadTyrian: string = 'mcHeadTyrian';
		static readonly mcHeadBling: string = 'mcHeadBling';
		static readonly mcHip: string = 'mcHip';
		static readonly mcHumerus: string = 'mcHumerus';
		static readonly mcTibia: string = 'mcTibia';
		static readonly mcUlna: string = 'mcUlna';
		static readonly none: string = 'none';
		static readonly particle: string = 'particle';
		static readonly score: string = 'score';
		static readonly sound: string = 'sound';
		static readonly tierBonusBronze: string = 'tierBonusBronze';
		static readonly tierBonusSilver: string = 'tierBonusSilver';
		static readonly tierBonusGold: string = 'tierBonusGold';
		static readonly tierBonusTyrian: string = 'tierBonusTyrian';
		static readonly tierBonusBling: string = 'tierBonusBling';
		static readonly timeTick: string = 'timeTick';
		static readonly timeTock: string = 'timeTock';
	}

	export class Text {
		static get NOUN_INPUT(): string {
			return (DetectDevice.isMobileOrTablet)
				? 'TOUCH FINGER'
				: 'CURSOR';
		}
		static get VERB_INPUT(): string {
			return (DetectDevice.isMobileOrTablet)
				? 'TAP'
				: 'CLICK';
		}
	}


	// interfaces
	export interface I_destructor { destructor(): void; }
	export interface I_xy { x: number; y: number; }
	export interface I_xyPrev { xPrev: number; yPrev: number; }
	/** key or index to access values in object or array */
	export type K = string | number;
	/** value or variable */
	export type V = any;
	// K-V mapped objects
	export type K2V = { [k: string]: V };
	export type K2Ball = { [k: string]: Ball };
	export type K2Bool = { [k: string]: boolean };
	export type K2Number = { [k: string]: number };
	export type K2Sg = { [k: string]: PSg };
	export type K2String = { [k: string]: string };
	// imported
	export type BC = box2d.b2Contact;
	export type BF = box2d.b2Fixture;
	export type PAdd = Phaser.GameObjectFactory;
	export type PB = Phaser.Physics.Box2D;
	export type PBBody = Phaser.Physics.Box2D.Body;
	export type PEm = Phaser.Particles.Arcade.Emitter;
	export type PGp = Phaser.Group;
	export type PSg = Phaser.Signal;
	export type PTw = Phaser.Tween;
	export type PTx = Phaser.BitmapText;
}
