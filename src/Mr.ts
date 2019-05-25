// Managers

module XG {
	/*
	NOTE: copy-paste because Typescript interfaces cannot have static members
	{
		private static _ie: ;
		static get ie():  { return ._ie; }
		static init(): void { ._ie = ._ie || new (); }

		private constructor() {
		}
	}
	*/

	/**
	 * cookie manager, for saving game data
	 * @see https://www.w3schools.com/js/js_cookies.asp
	 */
	export class MrCookie {
		private static _ie: MrCookie;
		static get ie(): MrCookie { return MrCookie._ie; }
		static init(): void { MrCookie._ie = MrCookie._ie || new MrCookie(); }

		private constructor() { }

		getCookie(k: string): V {
			var k_: string = k + '=';
			var entriesCookie: string[] = document.cookie.split(';');
			for (var entry of entriesCookie) {
				while (entry.charAt(0) == ' ') {
					entry = entry.substring(1);
				}
				if (entry.indexOf(k_) == 0) {
					return entry.substring(k_.length, entry.length);
				}
			}
			return undefined;
		}
		getCookieBool(k: string, vDefault: boolean): boolean {
			var vStr: string = this.getCookie(k);
			return (GmH.isUndefined(vStr))
				? vDefault
				: (vStr === 'true');
		}
		getCookieNum(k: string, vDefault: number): number {
			var vStr: string = this.getCookie(k);
			var v: number = Number(vStr);
			return (isNaN(v))
				? vDefault
				: v;
		}
		setCookie(k: string, v: V): void {
			document.cookie = k + '=' + v + ';' // 'path=/'; //
		}
	}

	export class MrInput implements I_xy, I_xyPrev {
		private static _ie: MrInput;
		static get ie(): MrInput { return MrInput._ie; }
		static init(): void { MrInput._ie = MrInput._ie || new MrInput(); }

		x: number; xPrev: number;
		y: number; yPrev: number;
		get dyPerSecond(): number {
			// if input's rising speed is above a threshold in pixels per second
			return (this.y - this.yPrev) * Gm.ie.time.fps;
		}

		private constructor() {
			this.constructThisDisableEventInputDefault();

			Gm.ie.input.maxPointers = 1;

			Gm.ie.onUpdate.add(this.update, this);
		}
		/** disable right click dropdown, mouse wheel scroll */
		private constructThisDisableEventInputDefault(): void {
			var fnPreventDefaultInputEvent =
				function (this: V, ev: PointerEvent | WheelEvent): void {
					ev.preventDefault();
				};
			window.oncontextmenu = fnPreventDefaultInputEvent;
			window.onmousewheel = fnPreventDefaultInputEvent;
		}

		update(): void {
			var input: Phaser.Input = Gm.ie.input;
			this.xPrev = this.x;
			this.x = input.x;
			this.yPrev = this.y;
			this.y = input.y;
		}
	}

	export class MrSettings {
		private static _ie: MrSettings;
		static get ie(): MrSettings { return MrSettings._ie; }
		static init(): void {
			MrSettings._ie = MrSettings._ie || new MrSettings();
		}

		static readonly SECONDS_PER_GAME: number = 120;
		static readonly SECONDS_PER_SCORE: number = 2;
		static get X0_MC(): number { return 222; }
		static get Y0_MC(): number { return Gm.ie.height / 2 + 111; }

		private settings: K2Bool;
		// signals
		private signals: K2Sg;
		/** dispatch(isOn: boolean) */
		get onSet(): PSg { return this._onSet; }
		private _onSet: PSg = new Phaser.Signal();
		/** dispatch(isOn: boolean) */
		get onSetGravitySpike(): PSg { return this.signals[Ks.gravitySpike]; }
		/** dispatch(isOn: boolean) */
		get onSetSound(): PSg { return this.signals[Ks.sound]; }

		private constructor() {
			this.settings = {};
			this.signals = {};
			this.constructSetting(Ks.sound, true);
			this.constructSetting(Ks.gravitySpike, true);

			// write setting changes to cookies
			var mrCookie: MrCookie = MrCookie.ie;
			this.onSet.add(mrCookie.setCookie, mrCookie);
		}
		private constructSetting(k: string, vDefault: V): void {
			// if setting doesn't exist in cookies, set to default value
			var v: boolean = MrCookie.ie.getCookieBool(k, vDefault);
			this.settings[k] = v;
			// set signal
			this.signals[k] = new Phaser.Signal();
		}

		getKs(): string[] {
			return <string[]>GmH.getKs(this.settings);
		}
		getV(k: string): boolean { return this.settings[k]; }
		setV(k: string, v: boolean): void {
			this.settings[k] = v;
			this.signals[k].dispatch(v);
			this.onSet.dispatch(k, v);
		}
	}

	export class MrSound {
		private static _ie: MrSound;
		static get ie(): MrSound { return MrSound._ie; }
		static init(): void { MrSound._ie = MrSound._ie || new MrSound(); }

		private constructor() {
			this.setIsOn(MrSettings.ie.getV(Ks.sound));
			MrSettings.ie.onSetSound.add(this.setIsOn, this);
		}

		getIsOn(): boolean {
			return !Gm.ie.sound.mute;
		}
		setIsOn(v: boolean): void {
			Gm.ie.sound.mute = !v;
		}
	}

	export class MrStage {
		private static _ie: MrStage;
		static get ie(): MrStage { return MrStage._ie; }
		static init(): void { MrStage._ie = MrStage._ie || new MrStage(); }

		// z-group orderings from bottom to top
		groupBG: PGp;
		groupScoreboard: PGp;
		groupMCBack: PGp;
		groupMCMiddle: PGp;
		groupMCFront: PGp;
		groupBall: PGp;
		groupHoopGround: PGp;
		groupEffects: PGp;
		groupUI: PGp;
		// objects
		balls: K2Ball;
		cloud: Cloud;
		effectsText: EffectsText;
		fence: Fence;
		ground: Ground;
		bg: BG;
		hoop: Hoop;
		mc: MC;
		scoreboard: Scoreboard;
		ui: UI;

		private constructor() {
			this.constructGroups();
			this.constructParticles();
			Gm.ie.onUpdate.addOnce(this.constructObjects, this);
		}
		/** create groups from bottom to top */
		private constructGroups(): void {
			var gmAdd: PAdd = Gm.ie.add;
			this.groupBG = gmAdd.group();
			this.groupScoreboard = gmAdd.group();
			this.groupMCBack = gmAdd.group();
			this.groupMCMiddle = gmAdd.group();
			this.groupMCFront = gmAdd.group();
			this.groupBall = gmAdd.group();
			this.groupHoopGround = gmAdd.group();
			this.groupEffects = gmAdd.group();
			this.groupUI = gmAdd.group();
		}
		/** create particle effects in cache */
		private constructParticles(): void {
			var radius: number = 8;
			var diam: number = 2 * radius;
			var colors: number[] = [
				Color.WHITE,
				Color.BALL_FC, Color.BALL_GS,
				Color.BALL_WM_GREEN, Color.BALL_WM_RED
			];
			for (var color of colors) {
				var fillStyle: string = Phaser.Color.RGBtoString(
					0xff & (color >> 16), // r
					0xff & (color >> 8), // g
					0xff & (color) // b
				);
				var bmd: Phaser.BitmapData = Gm.ie.make.bitmapData(diam, diam);
				bmd.circle(radius, radius, radius, fillStyle);
				var k: string = Ks.particle + color;
				Gm.ie.cache.addBitmapData(k, bmd);
			}
		}
		private constructObjects(): void {
			// create balls at center
			var dxBall: number = 2 * Ball.DIAMETER;
			var xBall: number = Gm.ie.width / 2 - dxBall,
				yBall: number = Gm.ie.height / 2;
			var ksBalls: string[] = [Ks.ballFC, Ks.ballGS, Ks.ballWM];
			var balls: K2Ball = {};
			for (var k of ksBalls) {
				balls[k] = new Ball(xBall, yBall, k);
				xBall += dxBall;
			};
			this.balls = balls;
			this.cloud = new Cloud();
			this.bg = new BG();
			this.effectsText = new EffectsText();
			this.fence = new Fence();
			this.ground = new Ground();
			this.hoop = new Hoop();
			this.mc = new MC();
			this.scoreboard = new Scoreboard();
			this.ui = new UI();
		}
	}

	export class MrTierBonus {
		private static _ie: MrTierBonus;
		static get ie(): MrTierBonus { return MrTierBonus._ie; }
		static init(): void {
			MrTierBonus._ie = MrTierBonus._ie || new MrTierBonus();
		}

		static readonly scaleDifficulty: number = 7; // 1; //
		static readonly Tiers: TierBonus[] = [
			{
				i: 0, colors: [Color.BLACK, Color.GRAY_DARK],
				kGHead: Ks.mcHead, kSound: Ks.none,
				scoreUpperLimit: 1 * MrTierBonus.scaleDifficulty, value: 0
			}, {
				i: 1, colors: [Color.BRONZE, Color.BRONZE_DARK, Color.WHITE],
				kGHead: Ks.mcHeadBronze, kSound: Ks.tierBonusBronze,
				scoreUpperLimit: 2 * MrTierBonus.scaleDifficulty, value: 1
			}, {
				i: 2, colors: [Color.GRAY_MID, Color.GRAY_DARK, Color.WHITE],
				kGHead: Ks.mcHeadSilver, kSound: Ks.tierBonusSilver,
				scoreUpperLimit: 3 * MrTierBonus.scaleDifficulty, value: 2
			}, {
				i: 3, colors: [Color.YELLOW, Color.ORANGE, Color.WHITE],
				kGHead: Ks.mcHeadGold, kSound: Ks.tierBonusGold,
				scoreUpperLimit: 6 * MrTierBonus.scaleDifficulty, value: 4
			}, {
				i: 4, colors: [Color.TYRIAN, Color.TYRIAN_DARK, Color.WHITE],
				kGHead: Ks.mcHeadTyrian, kSound: Ks.tierBonusTyrian,
				scoreUpperLimit: 7 * MrTierBonus.scaleDifficulty, value: 16
			}, {
				i: 5,
				isLockedByGravitySpike: true,
				colors: [Color.CYAN, Color.PINK, Color.YELLOW, Color.WHITE],
				kGHead: Ks.mcHeadBling, kSound: Ks.tierBonusBling,
				scoreUpperLimit: Number.POSITIVE_INFINITY, value: 32,
			}
		];
		static getITierAt(score: number, isSpiked: boolean): number {
			for (var tier of MrTierBonus.Tiers) {
				if (score >= tier.scoreUpperLimit) { continue; }

				return (!(tier.isLockedByGravitySpike && isSpiked))
					? tier.i
					: tier.i - 1;
			}
		}

		private constructor() { }

		/** if current high score tier is at least Gold */
		get isTierGoldAchieved(): boolean {
			var tierSilver: TierBonus = MrTierBonus.Tiers[2],
				scoreUpperLimitSilver: number = tierSilver.scoreUpperLimit;
			return MrVsGm.ie.vHiScore >= scoreUpperLimitSilver;
		}
	}
	export type TierBonus = {
		/** tier index */
		i: number;
		/**
		 * colors associated with current tier
		 * element 0 is tier's primary color
		 */
		colors: number[];
		/** MC's head graphic's key */
		kGHead: string;
		/** sound to play upon reaching tier */
		kSound: string;
		/**
		 * exclusive upper limit;
		 * next tier begins at this score
		 */
		scoreUpperLimit: number;
		/** defines number of glitter effects to generate */
		value: number;
		/** using gravity spike during game session prevents tier attainment */
		isLockedByGravitySpike?: boolean;
	}

	export class MrVsGm {
		private static _ie: MrVsGm;
		static get ie(): MrVsGm { return MrVsGm._ie; }
		static init(): void { MrVsGm._ie = MrVsGm._ie || new MrVsGm(); }

		// signals
		// signals: tier
		/** dispatch(iTier: number) */
		get onHiTierChange(): PSg { return this._onHiTierChange; }
		private _onHiTierChange: PSg = new Phaser.Signal();
		/** dispatch(iTier: number) */
		get onTierChange(): PSg { return this._onTierChange; }
		private _onTierChange: PSg = new Phaser.Signal();
		// signals: state
		/** dispatch(isStarted: boolean) */
		get onStateChange(): PSg { return this._onStateChange; }
		private _onStateChange: PSg = new Phaser.Signal();
		// signals: scoreboard
		/** dispatch(v: number) */
		get onHiScoreChange(): PSg { return this._onHiScoreChange; }
		private _onHiScoreChange: PSg = new Phaser.Signal();
		/** dispatch(v: number) */
		get onScoreChange(): PSg { return this._onScoreChange; }
		private _onScoreChange: PSg = new Phaser.Signal();
		/** dispatch(dtime: number) */
		get onTimeAdd(): PSg { return this._onTimeAdd; }
		private _onTimeAdd: PSg = new Phaser.Signal();
		/** dispatch(v: number) */
		get onTimeChange(): PSg { return this._onTimeChange; }
		private _onTimeChange: PSg = new Phaser.Signal();

		get isStarted(): boolean { return this._isStarted; }
		set isStarted(v: boolean) {
			if (v == this._isStarted) { return; }

			if (v) {
				this._isSpiked = false;
				this.vScore = 0;
			}

			this._isStarted = v;
			this.onStateChange.dispatch(v);
		}
		private _isStarted: boolean;
		/** if gravity spiked in current game session */
		private _isSpiked: boolean;
		private setIsSpiked(): void {
			this._isSpiked = true;
		}
		// tier
		/** highest bonus tier attained across all game sessions */
		get iHiTier(): number { return this._iHiTier; }
		set iHiTier(v: number) {
			this._iHiTier = v;
			this.onHiTierChange.dispatch(v);
			MrCookie.ie.setCookie(Ks.hiTier, v)
		}
		private _iHiTier: number;
		/** highest bonus tier attained in current game session */
		get iTier(): number { return this._iTier; }
		set iTier(v: number) {
			this._iTier = v;
			this.onTierChange.dispatch(v);

			if (v > this.iHiTier) {
				this.iHiTier = v;
			}
		}
		private _iTier: number;
		// scoreboard
		get vHiScore(): number { return this._vHiScore; }
		set vHiScore(v: number) {
			this._vHiScore = v;
			this.onHiScoreChange.dispatch(v);
			MrCookie.ie.setCookie(Ks.hiScore, v)
		}
		private _vHiScore: number;
		get vScore(): number { return this._vScore; }
		set vScore(v: number) {
			this._vScore = v;
			this.onScoreChange.dispatch(v);

			if (v > this.vHiScore) {
				this.vHiScore = v;
			}

			var isSpiked: boolean = this._isSpiked;
			var iTierGame: number = this.iTier,
				iTierCurrent: number = MrTierBonus.getITierAt(v, isSpiked);
			if (iTierCurrent > iTierGame) {
				this.iTier = iTierCurrent;
			}
		}
		private _vScore: number;
		get vTime(): number { return this._vTime; }
		set vTime(v: number) {
			this._vTime = v;
			this.onTimeChange.dispatch(v);
		}
		addVTime(d: number): void {
			this.vTime += d;
			this.onTimeAdd.dispatch(d);
		}
		private _vTime: number;

		private constructor() {
			this.isStarted = this._isSpiked = false;
			this.iTier = this.vScore = this.vTime = 0;
			this.iHiTier = MrCookie.ie.getCookieNum(Ks.hiTier, 0);
			this.vHiScore = MrCookie.ie.getCookieNum(Ks.hiScore, 0);

			Gm.ie.onGravitySpike.add(this.setIsSpiked, this);
		}
	}
}
