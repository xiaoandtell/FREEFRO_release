// Main Character

module XG {
	export class MC {
		tierBonus: TierBonus;
		// torso
		gHead: GSprite;
		gChest: GSprite;
		gGut: GSprite;
		gHip: GSprite; // center of gravity: from hips to midsection
		jNeck: box2d.b2RevoluteJoint;
		jGutChest: box2d.b2RevoluteJoint;
		jHipGut: box2d.b2RevoluteJoint;
		// limbs
		// F - front, B - back
		gHumerusF: GSprite; gHumerusB: GSprite; // (upper) arm
		gUlnaF: GSprite; gUlnaB: GSprite; // forearm
		gHandF: GSprite; gHandB: GSprite;
		jShoulderF: box2d.b2RevoluteJoint; jShoulderB: box2d.b2RevoluteJoint;
		jElbowF: box2d.b2RevoluteJoint; jElbowB: box2d.b2RevoluteJoint;
		jWristF: box2d.b2RevoluteJoint; jWristB: box2d.b2RevoluteJoint;
		gFemurF: GSprite; gFemurB: GSprite; // thigh bone
		gTibiaF: GSprite; gTibiaB: GSprite; // shin bone
		gFootF: GSprite; gFootB: GSprite;
		gsLimbs: GsLimb[];
		jHipLegF: box2d.b2RevoluteJoint; jHipLegB: box2d.b2RevoluteJoint;
		jKneeF: box2d.b2RevoluteJoint; jKneeB: box2d.b2RevoluteJoint;
		jAnkleF: box2d.b2RevoluteJoint; jAnkleB: box2d.b2RevoluteJoint;

		// components
		gravitySpike: MC_GravitySpike;
		jointsFixHypex: MC_JointsFixHyperextension;
		jointsStretch: MC_JointsStretch;
		jump: MC_Jump;
		locomotor: MC_Locomotor;
		pupils: MC_Pupils;
		sounds: MC_Sounds;
		updateAfro: MC_UpdateAfro;
		updateBall: MC_UpdateBall;
		updateBodies: MC_UpdateBodies;
		walkCycle: MC_WalkCycle;

		// signals
		/** dispatch(fThis: BF, fThat: BF) */
		get onBeginContact(): PSg { return this._onBeginContact; }
		private _onBeginContact: PSg = new Phaser.Signal();
		/** dispatch(fThis: BF, fThat: BF) */
		get onEndContact(): PSg { return this._onEndContact; }
		private _onEndContact: PSg = new Phaser.Signal();
		get onUpdate(): PSg { return this._onUpdate; }
		private _onUpdate: PSg = new Phaser.Signal();

		get gsLimbFront(): GsLimb { return this.gsLimbs[0]; }
		get xyAfro(): I_xy {
			var MCC: typeof MCConstruct = MCConstruct;
			var xyAfro_head = new PIXI.Point(MCC.dxAfro, MCC.dyAfro);
			return Gm.ie.stage.toLocal(xyAfro_head, this.gHead);
		}

		constructor() {
			this.tierBonus = MrTierBonus.Tiers[0]
			this.constructHeadTorso();
			this.constructLimbs();
			this.constructComponents();
			Gm.ie.onUpdate.add(this.update, this);
		}
		/** head, chest, gut, hip */
		private constructHeadTorso(): void {
			this.constructHeadTorsoGraphics();
			this.constructHeadTorsoBodies();
			this.constructHeadTorsoJoints();
		}
		private constructHeadTorsoGraphics(): void {
			var gmAdd: PAdd = Gm.ie.add;
			var group: PGp = MrStage.ie.groupMCMiddle;
			var MCC: typeof MCConstruct = MCConstruct;
			var x: number = MrSettings.X0_MC,
				y: number = MrSettings.Y0_MC;

			var gHip: GSprite = gmAdd.sprite(x, y, Ks.mcHip, null, group);
			this.gHip = gHip;
			y -= MCC.hHip;

			var gGut: GSprite = gmAdd.sprite(x, y, Ks.mcGut, null, group);
			this.gGut = gGut;
			y -= MCC.hGut;

			var gChest: GSprite = gmAdd.sprite(x, y, Ks.mcChest, null, group);
			this.gChest = gChest;
			y -= MCC.hChest;

			var gHead: GSprite = gmAdd.sprite(x, y, Ks.mcHead, null, group);
			this.gHead = gHead;
		}
		private constructHeadTorsoBodies(): void {
			var MCC: typeof MCConstruct = MCConstruct;

			var hwTorso: number = MCC.hwTorso;

			var bHip: PBBody = GmPhysics.enable(this.gHip);
			bHip.setPolygon([
				-hwTorso, 0,
				hwTorso, 0,
				0, -MCC.hHip
			]);

			var rGut: number = MCC.rGut;
			var bGut: PBBody = GmPhysics.enable(this.gGut);
			bGut.setCircle(rGut, 0, -rGut);
			// adding a larger non-collideable fixture improves joint stability
			var fSensorGut = bGut.addCircle(MCC.u, 0, -rGut);
			GmPhysics.disableContactsFixture(fSensorGut);

			var bChest: PBBody = GmPhysics.enable(this.gChest);
			bChest.setPolygon([
				-hwTorso, -MCC.hChest,
				hwTorso, -MCC.hChest,
				0, 0
			]);
			var fShoulder: BF = bChest.addCircle(MCC.wLimb,
				-MCC.dxShoulder, MCC.dyShoulder);

			var bHead: PBBody = GmPhysics.enable(this.gHead);
			var fHead: BF = bHead.setCircle(MCC.rHead, 0, -MCC.rHead);
			// head does not have significant weight
			fHead.GetMassData().mass = GmPhysics.MIN_MASS;

			var fAfro: BF = bHead.addCircle(MCC.rAfro, MCC.dxAfro, MCC.dyAfro);
			fAfro[Ks.k] = Ks.fAfro;
			fAfro.SetUserData(this);
			// afro does not have significant weight
			fAfro.GetMassData().mass = GmPhysics.MIN_MASS;
			// afro absorbs slide and bounce
			fAfro.SetFriction(1);
			fAfro.SetRestitution(0);

			// set collision
			var cCategory: number = Collision.MC | Collision.MC_TORSO,
				cMask: number = Collision.BOUNDARY | Collision.BALL
					| Collision.HOOP;
			for (var b of [bHip, bGut, bChest, bHead]) {
				b.setCollisionCategory(cCategory);
				b.setCollisionMask(cMask);
			}
			// front shoulder fixture prevents held ball from passing through it
			// while minimally affecting ball throw
			fShoulder.GetFilterData().categoryBits |= Collision.MC_SHOULDER;
			fShoulder.SetFriction(0);
			fShoulder.SetRestitution(0);
		}
		private constructHeadTorsoJoints(): void {
			var gmB2D: PB = Gm.ie.b2d;

			var MCC: typeof MCConstruct = MCConstruct;

			this.jHipGut = gmB2D.revoluteJoint(this.gHip, this.gGut,
				0, -MCC.hHip, 0, 0,
				0, 0, false, 0, 5, true);

			this.jGutChest = gmB2D.revoluteJoint(this.gGut, this.gChest,
				0, -MCC.hGut, 0, 0,
				0, 0, false, 0, 5, true);

			var hChest: number = MCC.hChest;
			this.jNeck = gmB2D.revoluteJoint(this.gChest, this.gHead,
				0, -hChest, 0, 0,
				0, 0, false, -10, 10, true);

			// prevent torso from overbending
			/** y distance from bottom of hip to top of chest */
			var dyHipChest: number = MCC.hTorso,
				hwTorso: number = MCC.hwTorso;
			gmB2D.distanceJoint(this.gHip, this.gChest, dyHipChest,
				hwTorso, 0, hwTorso, -hChest, 3, 0.25);
			gmB2D.distanceJoint(this.gHip, this.gChest, dyHipChest,
				-hwTorso, 0, -hwTorso, -hChest, 3, 0.25);
		}
		/** arm, legs */
		private constructLimbs(): void {
			this.constructLimbsGraphics();
			this.constructLimbsBodies();
			this.constructLimbsJoints();
		}
		private constructLimbsGraphics(): void {
			var gmAdd: PAdd = Gm.ie.add;

			var MCC: typeof MCConstruct = MCConstruct;
			var hlArm: number = MCC.hlArm,
				hlLeg: number = MCC.hlLeg,
				hwTorso: number = MCC.hwTorso,
				hTorso: number = MCC.hTorso,
				x: number = MrSettings.X0_MC,
				y: number = MrSettings.Y0_MC;

			var gsLimbs: GsLimb[] = [];
			for (var i: number = 0; i < 2; i++) {
				var isFront: boolean = i == 0;
				var signDx: number = (isFront) ? -1 : 1;
				var dxTorso: number = signDx * hwTorso;

				var xArm: number = x + dxTorso,
					yArm: number = y - hTorso;
				var groupArm: PGp = (isFront)
					? MrStage.ie.groupMCFront
					: MrStage.ie.groupMCBack;

				var gHumerus: GSprite = gmAdd.sprite(xArm, yArm, Ks.mcHumerus,
					null, groupArm);
				xArm += hlArm;

				var gUlna: GSprite = gmAdd.sprite(xArm, yArm, Ks.mcUlna,
					null, groupArm);
				xArm += hlArm;

				var gHand: GSprite = gmAdd.sprite(xArm, yArm, Ks.mcHand,
					null, groupArm);

				var xLeg: number = x + dxTorso,
					yLeg: number = y;
				var groupLeg: PGp = (isFront)
					? MrStage.ie.groupMCMiddle
					: MrStage.ie.groupMCBack;

				var gFemur: GSprite = gmAdd.sprite(xLeg, yLeg, Ks.mcFemur,
					null, groupLeg);
				yLeg += hlLeg;

				var gTibia: GSprite = gmAdd.sprite(xLeg, yLeg, Ks.mcTibia,
					null, groupLeg);
				yLeg += hlLeg;

				var gFoot: GSprite = gmAdd.sprite(xLeg, yLeg, Ks.mcFoot,
					null, groupLeg);

				gsLimbs[i] = {
					gHumerus: gHumerus,
					gUlna: gUlna,
					gHand: gHand,
					gFemur: gFemur,
					gTibia: gTibia,
					gFoot: gFoot
				}
				if (isFront) {
					this.gHumerusF = gHumerus;
					this.gUlnaF = gUlna;
					this.gHandF = gHand;
					this.gFemurF = gFemur;
					this.gTibiaF = gTibia;
					this.gFootF = gFoot;
				} else {
					this.gHumerusB = gHumerus;
					this.gUlnaB = gUlna;
					this.gHandB = gHand;
					this.gFemurB = gFemur;
					this.gTibiaB = gTibia;
					this.gFootB = gFoot;
				}
			}
			this.gsLimbs = gsLimbs;
		}
		private constructLimbsBodies(): void {
			var MCC: typeof MCConstruct = MCConstruct;
			var wLimb: number = MCC.wLimb;
			var hlArm: number = MCC.hlArm,
				rHand: number = MCC.rHand;
			var hlLeg: number = MCC.hlLeg,
				hFoot: number = MCC.hFoot,
				lFoot: number = MCC.lFoot;

			var gsLimbs: GsLimb[] = this.gsLimbs;
			for (var i = 0; i < gsLimbs.length; i++) {
				var gsLimb: GsLimb = gsLimbs[i];

				var oxHLArm: number = hlArm / 2;
				var bHumerus: PBBody = GmPhysics.enable(gsLimb.gHumerus);
				bHumerus.setRectangle(hlArm, wLimb, oxHLArm, 0);

				var bUlna: PBBody = GmPhysics.enable(gsLimb.gUlna);
				var fUlna: BF = bUlna.setRectangle(hlArm, wLimb, oxHLArm, 0);
				fUlna.SetUserData(this);

				var bHand: PBBody = GmPhysics.enable(gsLimb.gHand);
				var fHand: BF = bHand.setCircle(rHand, rHand);
				fHand[Ks.k] = Ks.fHand;
				fHand.SetUserData(this);

				var bFemur: PBBody = GmPhysics.enable(gsLimb.gFemur);
				bFemur.addRectangle(wLimb, hlLeg, 0, hlLeg / 2);

				var bTibia: PBBody = GmPhysics.enable(gsLimb.gTibia);
				bTibia.addRectangle(wLimb, hlLeg, 0, hlLeg / 2);

				var bFoot: PBBody = GmPhysics.enable(gsLimb.gFoot),
					dxBFoot: number = -6;
				var fFoot: BF = bFoot.addRectangle(lFoot, hFoot,
					lFoot / 2 + dxBFoot, hFoot / 2);
				fFoot[Ks.k] = Ks.fFoot;
				fFoot.SetUserData(this);

				// set collision
				var cCategory: number = Collision.MC | Collision.MC_LIMB,
					cMask: number = Collision.BOUNDARY | Collision.HOOP;
				for (var b of [bHumerus, bUlna, bFemur, bTibia, bFoot]) {
					b.setCollisionCategory(cCategory);
					b.setCollisionMask(cMask);
				}
				// hand should be able to touch ball
				bHand.setCollisionCategory(cCategory | Collision.MC_HAND);
				bHand.setCollisionMask(cMask | Collision.BALL);


				// leg counterweights to prevent swing from excess torquing
				for (var b of [bFemur, bTibia]) {
					var fCounterWeight: BF = b.addRectangle(
						wLimb, hlLeg, 0, -hlLeg / 2);
					GmPhysics.disableContactsFixture(fCounterWeight);
				}
			}
		}
		private constructLimbsJoints(): void {
			var gmB2D: PB = Gm.ie.b2d;
			var MCC: typeof MCConstruct = MCConstruct;
			var hlArm: number = MCC.hlArm;
			var hlLeg: number = MCC.hlLeg;

			var gsLimbs: GsLimb[] = this.gsLimbs;
			for (var i = 0; i < gsLimbs.length; i++) {
				var gsLimb: GsLimb = gsLimbs[i];
				var isFront: boolean = i == 0;
				var signDx: number = (isFront) ? -1 : 1;

				var jShoulder: box2d.b2RevoluteJoint = gmB2D.revoluteJoint(
					this.gChest, gsLimb.gHumerus,
					signDx * MCC.dxShoulder, MCC.dyShoulder, 0, 0);
					// kill rotation limits to make control smoother
					//, false, -90, 135, true);

				var jElbow: box2d.b2RevoluteJoint = gmB2D.revoluteJoint(
					gsLimb.gHumerus, gsLimb.gUlna,
					hlArm, 0, 0, 0,
					0, 0, false, -160, 0, true);

				var jWrist: box2d.b2RevoluteJoint = gmB2D.revoluteJoint(
					gsLimb.gUlna, gsLimb.gHand,
					hlArm, 0, 0, 0,
					0, 0, false, -10, 10, true);

				var jHipLeg: box2d.b2RevoluteJoint = gmB2D.revoluteJoint(
					this.gHip.body, gsLimb.gFemur,
					signDx * MCC.dxLegHip, MCC.dyLegHip, 0, 0,
					0, 0, false, -60, 20, true);

				var jKnee: box2d.b2RevoluteJoint = gmB2D.revoluteJoint(
					gsLimb.gFemur, gsLimb.gTibia,
					0, hlLeg, 0, 0,
					0, 0, false, 0, 135, true);

				var jAnkle: box2d.b2RevoluteJoint = gmB2D.revoluteJoint(
					gsLimb.gTibia, gsLimb.gFoot,
					0, hlLeg, 0, 0,
					0, 0, false, -30, 30, true);

				if (isFront) {
					this.jShoulderF = jShoulder;
					this.jElbowF = jElbow;
					this.jWristF = jWrist;
					this.jHipLegF = jHipLeg;
					this.jKneeF = jKnee;
					this.jAnkleF = jAnkle;
				} else {
					this.jShoulderB = jShoulder;
					this.jElbowB = jElbow;
					this.jWristB = jWrist;
					this.jHipLegB = jHipLeg;
					this.jKneeB = jKnee;
					this.jAnkleB = jAnkle;
				}
			}
		}
		private constructComponents(): void {
			this.gravitySpike = new MC_GravitySpike(this);
			this.jointsFixHypex = new MC_JointsFixHyperextension(this);
			this.jointsStretch = new MC_JointsStretch(this);
			this.jump = new MC_Jump(this);
			this.locomotor = new MC_Locomotor(this);
			this.sounds = new MC_Sounds(this);
			this.updateAfro = new MC_UpdateAfro(this);
			this.updateBall = new MC_UpdateBall(this);
			this.updateBodies = new MC_UpdateBodies(this);
			this.walkCycle = new MC_WalkCycle(this);
			this.pupils = new MC_Pupils(this); // after updateBall constructs
		}


		handleBeginContact(fThis: BF, fThat: BF): void {
			this.onBeginContact.dispatch(fThis, fThat);
		}
		handleEndContact(fThis: BF, fThat: BF): void {
			this.onEndContact.dispatch(fThis, fThat);
		}


		update(): void {
			this.onUpdate.dispatch();
		}
	}
	/** construct variables for MC */
	export class MCConstruct {
		/** basic unit of bodypart measurement */
		static readonly u: number = 32;
		static get dxAfro(): number { return -this.u / Math.sqrt(2); }
		static get dxLegHip(): number { return 3 * this.u / 8; }
		static get dxShoulder(): number { return this.u / 2; }
		static get dyAfro(): number { return this.dxAfro - this.rHead; }
		static get dyLegHip(): number { return -this.u / 8; }
		static get dyShoulder(): number { return -7 * this.u / 8; }
		static get hChest(): number { return this.u; }
		static get hGut(): number { return 2 * this.rGut; }
		static get hFoot(): number { return this.wLimb; }
		static get hHip(): number { return this.u / 2; }
		static get hTorso(): number {
			return this.hHip + this.hGut + this.hChest;
		}
		static get hlArm(): number { return 1.5 * this.u; }
		static get hlLeg(): number { return 1.5 * this.u; }
		static get hwTorso(): number { return this.u / 2; }
		static get lArmHand(): number { return 2 * this.hlArm + this.rHand; }
		static get lFoot(): number { return 8 * this.wLimb; }
		static get lLegFoot(): number { return 2 * this.hlLeg + this.hFoot; }
		static get rAfro(): number { return 1.5 * this.rHead; }
		static get rGut(): number { return this.u / 4; }
		static get rHand(): number { return 2 * this.wLimb; }
		static get rHead(): number { return this.u; }
		static get wLimb(): number { return 4; }
	}
	/** limb graphics */
	export type GsLimb = {
		// arm
		gHumerus: GSprite; // hind arm
		gUlna: GSprite; // forearm
		gHand: GSprite;
		// leg
		gFemur: GSprite; // top bone
		gTibia: GSprite; // bottom bone
		gFoot: GSprite;
	};
	/** limb joints */
	export type JsLimb = {
		jHip: box2d.b2RevoluteJoint;
		jKnee: box2d.b2RevoluteJoint;
		jAnkle: box2d.b2RevoluteJoint;
	};
}
